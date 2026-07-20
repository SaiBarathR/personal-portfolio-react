import { gitConfig } from "../utils/config";

const GitService = (function () {
    const baseUrl = gitConfig.gitBaseUrl;
    const username = gitConfig.gitUserName;
    const headers = {
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github+json",
        Authorization: `token ${gitConfig.gitPersonalKey}`,
    };

    const urls = {
        user: `${baseUrl}/users/${username}`,
        repos: `${baseUrl}/users/${username}/repos`,
        repo: `${baseUrl}/repos/${username}`,
        graphql: `${baseUrl}/graphql`,
    };

    var service = {};

    service.username = username;

    service.getWithHeaders = function (url) {
        return fetch(url, { headers })
            .then((response) => response.json())
            .then((data) => data)
            .catch((error) => {
                console.log(error);
                return error;
            });
    };

    service.graphql = async function (query, variables = {}) {
        const response = await fetch(urls.graphql, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
        if (data.errors?.length) {
            throw new Error(data.errors[0]?.message || "GitHub GraphQL error");
        }
        return data.data;
    };

    service.getGithubUserDetails = function () {
        return service.getWithHeaders(urls.user);
    };

    service.getRepos = function () {
        return service.getWithHeaders(urls.repos);
    };

    service.getRepoDetails = function (repoUserName) {
        return service.getWithHeaders(`${urls.repo}/${repoUserName}`);
    };

    service.getWeeklyCommitCount = function (repoUserName) {
        return service.getWithHeaders(`${urls.repo}/${repoUserName}/stats/participation`);
    };

    service.getUserEvents = function (page = 1, perPage = 30) {
        return service.getWithHeaders(
            `${urls.user}/events/public?per_page=${perPage}&page=${page}`
        );
    };

    service.getUserEventsPages = async function (pages = 3) {
        const batches = await Promise.all(
            Array.from({ length: pages }, (_, i) => service.getUserEvents(i + 1))
        );
        return batches.flatMap((batch) => (Array.isArray(batch) ? batch : []));
    };

    service.getContributions = async function (year, { rolling = false } = {}) {
        let from;
        let to;
        if (rolling) {
            const end = new Date();
            const start = new Date(end);
            start.setFullYear(start.getFullYear() - 1);
            from = start.toISOString();
            to = end.toISOString();
        } else {
            from = `${year}-01-01T00:00:00Z`;
            to = `${year}-12-31T23:59:59Z`;
        }
        const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          createdAt
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  color
                  date
                  weekday
                }
              }
            }
            commitContributionsByRepository(maxRepositories: 25) {
              contributions { totalCount }
              repository { nameWithOwner url }
            }
            pullRequestContributionsByRepository(maxRepositories: 25) {
              contributions { totalCount }
              repository { nameWithOwner url }
            }
            issueContributionsByRepository(maxRepositories: 25) {
              contributions { totalCount }
              repository { nameWithOwner url }
            }
            pullRequestReviewContributionsByRepository(maxRepositories: 25) {
              contributions { totalCount }
              repository { nameWithOwner url }
            }
          }
        }
      }
    `;
        return service.graphql(query, { username, from, to });
    };

    return service;
})();

export default GitService;
