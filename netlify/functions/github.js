/* eslint-env node */
import { gitConfig } from "../../src/utils/config.js";

// Server-side GitHub proxy. The token never reaches the browser, so it may
// read private repositories — everything private is masked before responding.

const PRIVATE_REPO_LABEL = "Private repository";
const FIRST_YEAR = 2008;
const MAX_EVENT_PAGES = 3;

const baseUrl = gitConfig.gitBaseUrl;
const username = gitConfig.gitUserName;

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
            ...(status === 200
                ? {
                      "Cache-Control": "public, max-age=60",
                      "Netlify-CDN-Cache-Control": "public, max-age=600",
                  }
                : { "Cache-Control": "no-store" }),
        },
    });

const github = async (path, init = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
            Authorization: `token ${process.env.GIT_PERSONAL_KEY}`,
            ...init.headers,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.message || `GitHub responded ${response.status}`);
    }
    return data;
};

const calendarDays = (extra = "") => `
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  ${extra}
                }
              }
            }`;

const yearRange = (year) => ({
    from: `${year}-01-01T00:00:00Z`,
    to: `${year}-12-31T23:59:59Z`,
});

const REPO_BREAKDOWNS = [
    "commitContributionsByRepository",
    "pullRequestContributionsByRepository",
    "issueContributionsByRepository",
    "pullRequestReviewContributionsByRepository",
];

const maskPrivateRepos = (collection) => {
    REPO_BREAKDOWNS.forEach((key) => {
        collection[key] = (collection[key] || []).map((row) => ({
            contributions: row.contributions,
            repository: row.repository?.isPrivate
                ? { nameWithOwner: PRIVATE_REPO_LABEL, url: null }
                : {
                      nameWithOwner: row.repository?.nameWithOwner,
                      url: row.repository?.url,
                  },
        }));
    });
    return collection;
};

const getContributions = async (year, withPreviousYear) => {
    // Always a full calendar year; for the current year GitHub pads the
    // days that haven't happened yet with zero counts.
    const { from, to } = yearRange(year);
    // Previous year's days let a live streak run back past Jan 1.
    const previous = yearRange(year - 1);
    const previousYear = withPreviousYear
        ? `previousYear: contributionsCollection(from: "${previous.from}", to: "${previous.to}") {${calendarDays()}
          }`
        : "";
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          createdAt
          ${previousYear}
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            restrictedContributionsCount
            ${calendarDays("color weekday")}
            ${REPO_BREAKDOWNS.map(
                (key) => `${key}(maxRepositories: 25) {
              contributions { totalCount }
              repository { nameWithOwner url isPrivate }
            }`
            ).join("\n            ")}
          }
        }
      }
    `;
    const result = await github("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username, from, to } }),
    });
    if (result.errors?.length) {
        throw new Error(result.errors[0]?.message || "GitHub GraphQL error");
    }
    const collection = result.data?.user?.contributionsCollection;
    if (collection) maskPrivateRepos(collection);
    return result.data;
};

// Private events keep only what the timeline counts — no names, titles,
// branch refs or links.
const maskPrivateEvent = (event) => {
    const payload = event.payload || {};
    const pullRequest = payload.pull_request;
    return {
        id: event.id,
        type: event.type,
        public: false,
        created_at: event.created_at,
        repo: { name: PRIVATE_REPO_LABEL },
        payload: {
            action: payload.action,
            ref_type: payload.ref_type,
            size: payload.size ?? payload.commits?.length,
            pull_request: pullRequest
                ? { merged: pullRequest.merged, state: pullRequest.state }
                : undefined,
        },
    };
};

const getEvents = async (pages) => {
    // Authenticated as the user, this feed includes private events too.
    const batches = await Promise.all(
        Array.from({ length: pages }, (_, i) =>
            github(`/users/${username}/events?per_page=30&page=${i + 1}`)
        )
    );
    return batches
        .flat()
        .map((event) => (event.public === false ? maskPrivateEvent(event) : event));
};

const getRepos = async (perPage = 100, maxPages = 10) => {
    const all = [];
    for (let page = 1; page <= maxPages; page += 1) {
        const batch = await github(
            `/users/${username}/repos?per_page=${perPage}&page=${page}`
        );
        all.push(...batch);
        if (batch.length < perPage) break;
    }
    // The projects list stays public-only.
    return all
        .filter((repo) => !repo.private)
        .map((repo) => ({
            id: repo.id,
            name: repo.name,
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            topics: repo.topics,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
        }));
};

export default async (request) => {
    if (request.method !== "GET") return json({ message: "Method not allowed" }, 405);
    if (!process.env.GIT_PERSONAL_KEY) {
        console.error("GIT_PERSONAL_KEY is not set");
        return json({ message: "GitHub proxy is not configured" }, 500);
    }

    const params = new URL(request.url).searchParams;

    try {
        switch (params.get("op")) {
            case "contributions": {
                const year = Number(params.get("year"));
                const currentYear = new Date().getUTCFullYear();
                if (!Number.isInteger(year) || year < FIRST_YEAR || year > currentYear + 1) {
                    return json({ message: "Invalid year" }, 400);
                }
                return json(await getContributions(year, params.has("previousYear")));
            }
            case "events": {
                const pages = Number(params.get("pages") || 1);
                if (!Number.isInteger(pages) || pages < 1 || pages > MAX_EVENT_PAGES) {
                    return json({ message: "Invalid pages" }, 400);
                }
                return json(await getEvents(pages));
            }
            case "repos":
                return json(await getRepos());
            default:
                return json({ message: "Unknown operation" }, 400);
        }
    } catch (error) {
        console.error(error);
        return json({ message: "GitHub request failed" }, 502);
    }
};
