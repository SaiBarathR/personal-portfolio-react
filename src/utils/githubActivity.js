// Shapes GitHub REST events + GraphQL contributions into UI-ready activity data.

const GITHUB_BASE = "https://github.com";

export const relativeTime = (isoDate) => {
    if (!isoDate) return "";
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return "";
    const diff = Math.max(0, Date.now() - then);
    const min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
};

export const formatShortDate = (isoDate) => {
    if (!isoDate) return "";
    // Bare YYYY-MM-DD parses as UTC midnight; anchor it to local time so
    // users west of UTC don't render the previous calendar day.
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(isoDate)
        ? `${isoDate}T00:00:00`
        : isoDate;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const monthKey = (isoDate) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const monthLabel = (key) => {
    const [year, month] = key.split("-").map(Number);
    if (!year || !month) return key;
    return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

const humanizeType = (type = "") =>
    type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");

const repoFromEvent = (event) => {
    const fullName = event?.repo?.name || "";
    return {
        fullName,
        name: fullName ? fullName.split("/").pop() : "",
        url: fullName ? `${GITHUB_BASE}/${fullName}` : GITHUB_BASE,
    };
};

/** Intensity 0–4 for contribution cells (GitHub-style). */
export const contributionLevel = (count = 0) => {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
};

export const buildCalendar = (contributionCalendar) => {
    const weeks = contributionCalendar?.weeks || [];
    const days = weeks.flatMap((week) =>
        (week.contributionDays || []).map((day) => ({
            date: day.date,
            count: day.contributionCount || 0,
            level: contributionLevel(day.contributionCount || 0),
            weekday: day.weekday,
            color: day.color,
        }))
    );

    const monthLabels = [];
    weeks.forEach((week, weekIndex) => {
        const firstDay = week.contributionDays?.[0];
        if (!firstDay?.date) return;
        const date = new Date(`${firstDay.date}T00:00:00`);
        const label = date.toLocaleDateString("en-US", { month: "short" });
        const prev = monthLabels[monthLabels.length - 1];
        if (prev?.label === label) return;
        // Avoid overlapping month labels on tight week columns.
        if (prev && weekIndex - prev.weekIndex < 2) return;
        monthLabels.push({ label, weekIndex });
    });

    return {
        total: contributionCalendar?.totalContributions || 0,
        weeks: weeks.map((week) =>
            (week.contributionDays || []).map((day) => ({
                date: day.date,
                count: day.contributionCount || 0,
                level: contributionLevel(day.contributionCount || 0),
                weekday: day.weekday,
            }))
        ),
        days,
        monthLabels,
    };
};

/**
 * Derive analysis from the contribution calendar: streaks, cadence,
 * monthly flow. Everything comes from data already on the client.
 */
export const buildInsights = (calendar) => {
    const sorted = (calendar?.days || [])
        .filter((day) => day.date)
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!sorted.length) return null;

    const total = calendar?.total || sorted.reduce((sum, day) => sum + day.count, 0);

    let activeDays = 0;
    let longestStreak = 0;
    let run = 0;
    let busiest = sorted[0];
    sorted.forEach((day) => {
        if (day.count > 0) {
            activeDays += 1;
            run += 1;
            if (run > longestStreak) longestStreak = run;
        } else {
            run = 0;
        }
        if (day.count > busiest.count) busiest = day;
    });

    // Streak still alive at the end of the window; a zero on the final
    // day doesn't break it — that day may simply not be over yet.
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
        if (sorted[i].count > 0) currentStreak += 1;
        else if (i === sorted.length - 1) continue;
        else break;
    }

    const weekdayTotals = Array(7).fill(0);
    sorted.forEach((day) => {
        if (day.weekday >= 0 && day.weekday <= 6) {
            weekdayTotals[day.weekday] += day.count;
        }
    });
    const weekendTotal = weekdayTotals[0] + weekdayTotals[6];

    const monthly = [];
    sorted.forEach((day) => {
        const key = monthKey(day.date);
        const last = monthly[monthly.length - 1];
        if (last?.key === key) {
            last.total += day.count;
        } else {
            monthly.push({
                key,
                label: new Date(`${day.date}T00:00:00`).toLocaleDateString("en-US", {
                    month: "short",
                }),
                total: day.count,
            });
        }
    });
    const peakMonth = monthly.reduce(
        (peak, month) => (month.total > peak.total ? month : peak),
        monthly[0]
    );

    return {
        total,
        dayCount: sorted.length,
        activeDays,
        activePct: Math.round((activeDays / sorted.length) * 100),
        dailyAverage: total / sorted.length,
        currentStreak,
        longestStreak,
        busiest,
        weekdayTotals,
        weekendShare: total > 0 ? Math.round((weekendTotal / total) * 100) : 0,
        monthly,
        peakMonth,
    };
};

const mapRepoContributions = (rows = []) =>
    rows
        .map((row) => ({
            name: row.repository?.nameWithOwner || "",
            url: row.repository?.url || "",
            count: row.contributions?.totalCount || 0,
        }))
        .filter((row) => row.name && row.count > 0)
        .sort((a, b) => b.count - a.count);

export const buildOverview = (collection) => {
    const commits = collection?.totalCommitContributions || 0;
    const pullRequests = collection?.totalPullRequestContributions || 0;
    const issues = collection?.totalIssueContributions || 0;
    const reviews = collection?.totalPullRequestReviewContributions || 0;
    const total = commits + pullRequests + issues + reviews;

    const pct = (value) => (total > 0 ? Math.round((value / total) * 100) : 0);

    const repoMap = new Map();
    [
        ...mapRepoContributions(collection?.commitContributionsByRepository),
        ...mapRepoContributions(collection?.pullRequestContributionsByRepository),
        ...mapRepoContributions(collection?.issueContributionsByRepository),
        ...mapRepoContributions(collection?.pullRequestReviewContributionsByRepository),
    ].forEach((repo) => {
        const existing = repoMap.get(repo.name);
        if (existing) {
            existing.count += repo.count;
        } else {
            repoMap.set(repo.name, { ...repo });
        }
    });

    const repositories = Array.from(repoMap.values()).sort((a, b) => b.count - a.count);

    return {
        commits,
        pullRequests,
        issues,
        reviews,
        total,
        percents: {
            commits: pct(commits),
            pullRequests: pct(pullRequests),
            issues: pct(issues),
            reviews: pct(reviews),
        },
        repositories,
        repoCount: collection?.totalRepositoriesWithContributedCommits || repositories.length,
    };
};

const formatDetailedEvent = (event) => {
    const repo = repoFromEvent(event);
    const payload = event?.payload || {};
    let kind = "activity";
    let title = humanizeType(event?.type);
    let subtitle = "";
    let url = repo.url;
    let meta = {};

    switch (event?.type) {
        case "PushEvent": {
            const count = payload.size || payload.commits?.length || 0;
            kind = "push";
            title = `Created ${count} commit${count === 1 ? "" : "s"} in ${repo.fullName}`;
            meta = { commits: count, repo };
            break;
        }
        case "PullRequestEvent": {
            const pr = payload.pull_request || {};
            const merged = Boolean(pr.merged);
            kind = "pull_request";
            title = merged
                ? `Merged a pull request in ${repo.fullName}`
                : `${payload.action || "updated"} a pull request in ${repo.fullName}`;
            subtitle = pr.title || "";
            url = pr.html_url || repo.url;
            meta = {
                repo,
                prTitle: pr.title,
                state: merged ? "merged" : pr.state || payload.action,
                additions: pr.additions,
                deletions: pr.deletions,
                comments: pr.comments,
                number: pr.number,
            };
            break;
        }
        case "IssuesEvent": {
            const issue = payload.issue || {};
            kind = "issue";
            title = `${payload.action || "updated"} an issue in ${repo.fullName}`;
            subtitle = issue.title || "";
            url = issue.html_url || repo.url;
            meta = {
                repo,
                issueTitle: issue.title,
                state: issue.state,
                number: issue.number,
            };
            break;
        }
        case "IssueCommentEvent": {
            kind = "comment";
            title = `Commented on an issue in ${repo.fullName}`;
            subtitle = payload.issue?.title || "";
            url = payload.comment?.html_url || payload.issue?.html_url || repo.url;
            meta = { repo, issueTitle: payload.issue?.title };
            break;
        }
        case "WatchEvent": {
            kind = "star";
            title = `Starred ${repo.fullName}`;
            break;
        }
        case "ForkEvent": {
            kind = "fork";
            title = `Forked ${repo.fullName}`;
            url = payload.forkee?.html_url || repo.url;
            break;
        }
        case "CreateEvent": {
            kind = payload.ref_type === "repository" ? "create_repo" : "create";
            title =
                payload.ref_type === "repository"
                    ? `Created 1 repository`
                    : `Created ${payload.ref_type || "ref"} in ${repo.fullName}`;
            subtitle = payload.ref_type === "repository" ? repo.fullName : payload.ref || "";
            meta = { repo, refType: payload.ref_type, ref: payload.ref };
            break;
        }
        case "DeleteEvent": {
            kind = "delete";
            title = `Deleted ${payload.ref_type || "ref"} in ${repo.fullName}`;
            meta = { repo, refType: payload.ref_type };
            break;
        }
        case "ReleaseEvent": {
            kind = "release";
            title = `Published a release in ${repo.fullName}`;
            subtitle = payload.release?.tag_name || "";
            url = payload.release?.html_url || repo.url;
            meta = { repo, tag: payload.release?.tag_name };
            break;
        }
        case "PublicEvent": {
            kind = "public";
            title = `Made ${repo.fullName} public`;
            break;
        }
        case "MemberEvent": {
            kind = "member";
            title = `Added a collaborator to ${repo.fullName}`;
            break;
        }
        default:
            title = `${title} in ${repo.fullName}`;
            break;
    }

    return {
        id: event?.id,
        kind,
        title,
        subtitle,
        url,
        date: event?.created_at,
        dateLabel: formatShortDate(event?.created_at),
        relative: relativeTime(event?.created_at),
        month: monthKey(event?.created_at),
        repo,
        meta,
        rawType: event?.type,
    };
};

/**
 * Collapse raw events into GitHub-style monthly activity groups:
 * aggregated commits, notable PRs/issues, repo creates, etc.
 */
export const buildTimeline = (events = [], year) => {
    if (!Array.isArray(events)) return [];

    const filtered = events
        .filter((event) => event?.repo?.name && event?.created_at)
        .filter((event) => {
            if (!year) return true;
            return new Date(event.created_at).getFullYear() === year;
        })
        .map(formatDetailedEvent)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const byMonth = new Map();
    filtered.forEach((item) => {
        if (!byMonth.has(item.month)) byMonth.set(item.month, []);
        byMonth.get(item.month).push(item);
    });

    return Array.from(byMonth.entries()).map(([key, items]) => {
        const groups = [];
        const pushes = items.filter((item) => item.kind === "push");
        const creates = items.filter((item) => item.kind === "create_repo");
        const prs = items.filter((item) => item.kind === "pull_request");
        const issues = items.filter((item) => item.kind === "issue");
        const notable = items.filter((item) =>
            ["release", "comment"].includes(item.kind)
        );
        // Branch/tag create + delete events carry no signal — drop them.
        const other = items.filter(
            (item) =>
                ![
                    "push",
                    "create_repo",
                    "pull_request",
                    "issue",
                    "release",
                    "comment",
                    "create",
                    "delete",
                ].includes(item.kind)
        );

        if (pushes.length) {
            const repoStats = new Map();
            let totalCommits = 0;
            pushes.forEach((push) => {
                const name = push.repo.fullName;
                // The events API often omits commit counts; track pushes as a fallback.
                const commits = push.meta.commits || 0;
                totalCommits += commits;
                const existing = repoStats.get(name);
                if (existing) {
                    existing.commits += commits;
                    existing.pushes += 1;
                } else {
                    repoStats.set(name, {
                        name,
                        url: push.repo.url,
                        commits,
                        pushes: 1,
                    });
                }
            });
            const repos = Array.from(repoStats.values()).sort(
                (a, b) => b.commits - a.commits || b.pushes - a.pushes
            );
            groups.push({
                id: `${key}-commits`,
                kind: "commits",
                commits: totalCommits,
                pushes: pushes.length,
                repoCount: repos.length,
                dateLabel: pushes[0].dateLabel,
                date: pushes[0].date,
                repos,
            });
        }

        creates.forEach((item) => {
            groups.push({
                id: item.id,
                kind: "create_repo",
                title: item.title,
                subtitle: item.subtitle,
                url: item.url,
                dateLabel: item.dateLabel,
                date: item.date,
                repo: item.repo,
            });
        });

        // Pull request titles aren't exposed by the events API, so aggregate
        // per repository + state instead of repeating title-less headlines.
        const prBuckets = new Map();
        prs.forEach((item) => {
            const merged =
                item.meta?.state === "merged" || /merged/i.test(item.title || "");
            const repoName = item.repo.fullName || item.repo.name;
            const bucketKey = `${repoName}::${merged ? "merged" : "open"}`;
            const existing = prBuckets.get(bucketKey);
            if (existing) {
                existing.count += 1;
                if (new Date(item.date) > new Date(existing.date)) {
                    existing.date = item.date;
                    existing.dateLabel = item.dateLabel;
                    existing.url = item.url;
                }
            } else {
                prBuckets.set(bucketKey, {
                    id: `${key}-pr-${bucketKey}`,
                    kind: "pull_requests",
                    merged,
                    count: 1,
                    repo: item.repo,
                    url: item.url,
                    date: item.date,
                    dateLabel: item.dateLabel,
                });
            }
        });
        prBuckets.forEach((group) => groups.push(group));

        // Aggregate issues per repository for the same reason.
        const issueBuckets = new Map();
        issues.forEach((item) => {
            const repoName = item.repo.fullName || item.repo.name;
            const existing = issueBuckets.get(repoName);
            if (existing) {
                existing.count += 1;
                if (new Date(item.date) > new Date(existing.date)) {
                    existing.date = item.date;
                    existing.dateLabel = item.dateLabel;
                    existing.url = item.url;
                }
            } else {
                issueBuckets.set(repoName, {
                    id: `${key}-issue-${repoName}`,
                    kind: "issues",
                    count: 1,
                    repo: item.repo,
                    url: item.url,
                    date: item.date,
                    dateLabel: item.dateLabel,
                });
            }
        });
        issueBuckets.forEach((group) => groups.push(group));

        notable.forEach((item) => {
            groups.push({
                id: item.id,
                kind: item.kind,
                title: item.title,
                subtitle: item.subtitle,
                url: item.url,
                dateLabel: item.dateLabel,
                date: item.date,
                repo: item.repo,
                meta: item.meta,
            });
        });

        other.slice(0, 6).forEach((item) => {
            groups.push({
                id: item.id,
                kind: item.kind,
                title: item.title,
                subtitle: item.subtitle,
                url: item.url,
                dateLabel: item.dateLabel,
                date: item.date,
                repo: item.repo,
                meta: item.meta,
            });
        });

        groups.sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
            key,
            label: monthLabel(key),
            groups,
        };
    });
};

/** Year summary timeline when public events don't cover that year. */
export const buildYearSummaryTimeline = (overview, year) => {
    if (!overview?.repositories?.length && !overview?.total) return [];

    const groups = [];
    const repos = overview.repositories || [];
    if (overview.commits > 0 && repos.length) {
        groups.push({
            id: `${year}-year-commits`,
            kind: "commits",
            commits: overview.commits,
            pushes: 0,
            repoCount: repos.length,
            dateLabel: String(year),
            date: `${year}-12-31`,
            repos: repos.slice(0, 8).map((repo) => ({
                name: repo.name,
                url: repo.url,
                commits: repo.count,
            })),
        });
    }

    if (overview.pullRequests > 0) {
        groups.push({
            id: `${year}-year-prs`,
            kind: "pull_requests",
            merged: false,
            count: overview.pullRequests,
            dateLabel: String(year),
            date: `${year}-12-15`,
        });
    }

    if (overview.issues > 0) {
        groups.push({
            id: `${year}-year-issues`,
            kind: "issues",
            count: overview.issues,
            dateLabel: String(year),
            date: `${year}-12-01`,
        });
    }

    if (overview.reviews > 0) {
        groups.push({
            id: `${year}-year-reviews`,
            kind: "review",
            count: overview.reviews,
            title: `Reviewed ${overview.reviews} pull request${overview.reviews === 1 ? "" : "s"}`,
            dateLabel: String(year),
            date: `${year}-11-15`,
        });
    }

    if (!groups.length) return [];

    return [
        {
            key: `${year}-summary`,
            label: String(year),
            groups,
        },
    ];
};

/** Short activity label for the Projects list subtitle. */
export const formatProjectActivityLabel = (event) => {
    const payload = event?.payload || {};
    const action = payload.action;

    switch (event?.type) {
        case "PushEvent": {
            const count = payload.size || payload.commits?.length || 0;
            return count
                ? `Pushed ${count} commit${count === 1 ? "" : "s"}`
                : "Pushed commits";
        }
        case "PullRequestEvent": {
            const pr = payload.pull_request || {};
            if (pr.merged) return "Merged a pull request";
            if (action === "opened") return "Opened a pull request";
            if (action === "closed") return "Closed a pull request";
            return "Updated a pull request";
        }
        case "IssuesEvent": {
            if (action === "opened") return "Opened an issue";
            if (action === "closed") return "Closed an issue";
            if (action === "reopened") return "Reopened an issue";
            return "Updated an issue";
        }
        case "IssueCommentEvent":
            return "Commented on an issue";
        case "WatchEvent":
            return "Starred repository";
        case "ForkEvent":
            return "Forked repository";
        case "CreateEvent":
            return payload.ref_type === "repository"
                ? "Created repository"
                : `Created ${payload.ref_type || "ref"}`;
        case "DeleteEvent":
            return `Deleted ${payload.ref_type || "ref"}`;
        case "ReleaseEvent":
            return payload.release?.tag_name
                ? `Published release ${payload.release.tag_name}`
                : "Published a release";
        case "PublicEvent":
            return "Made repository public";
        case "MemberEvent":
            return "Added a collaborator";
        default:
            return humanizeType(event?.type || "activity");
    }
};

/** Latest public event per repo short name (newest-first walk). */
export const buildLatestActivityByRepo = (events = []) => {
    const latest = new Map();
    if (!Array.isArray(events)) return latest;

    for (const event of events) {
        const fullName = event?.repo?.name;
        if (!fullName) continue;
        const shortName = fullName.split("/").pop();
        if (!shortName || latest.has(shortName)) continue;
        latest.set(shortName, event);
    }

    return latest;
};

/** Event-based activity, or last-push fallback when no recent event exists. */
export const resolveProjectActivity = (repoName, latestByRepo, pushedAt) => {
    const event = latestByRepo?.get(repoName);
    if (event?.created_at) {
        return {
            activityLabel: formatProjectActivityLabel(event),
            activityAt: event.created_at,
            activityRelative: relativeTime(event.created_at),
        };
    }
    if (pushedAt) {
        return {
            activityLabel: "Last pushed",
            activityAt: pushedAt,
            activityRelative: relativeTime(pushedAt),
        };
    }
    return {
        activityLabel: "",
        activityAt: null,
        activityRelative: "",
    };
};

// Legacy feed formatter (kept for compatibility).
export const formatEvents = (events, limit = 18) => {
    if (!Array.isArray(events)) return [];
    return events
        .filter((event) => event?.repo?.name)
        .slice(0, limit)
        .map((event) => {
            const detailed = formatDetailedEvent(event);
            return {
                id: detailed.id,
                action: detailed.title,
                repoName: detailed.repo.name,
                url: detailed.url,
                date: detailed.relative,
            };
        });
};

export default formatEvents;
