// Turns a raw GitHub event (from /users/:user/events/public) into a lightweight,
// human-readable shape for the Activity feed: { id, action, repoName, url, date }.

const GITHUB_BASE = "https://github.com";

const relativeTime = (isoDate) => {
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

// Prettify "PushEvent" -> "Push" for the default fallback.
const humanizeType = (type = "") => type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");

const formatEvent = (event) => {
    const repoFullName = event?.repo?.name || "";
    const repoName = repoFullName ? repoFullName.split("/").pop() : "";
    const repoUrl = repoFullName ? `${GITHUB_BASE}/${repoFullName}` : GITHUB_BASE;
    const payload = event?.payload || {};

    let action = humanizeType(event?.type);
    let url = repoUrl;

    switch (event?.type) {
        case "PushEvent": {
            const count = payload.size || payload.commits?.length || 0;
            action = `Pushed ${count} commit${count === 1 ? "" : "s"}`;
            break;
        }
        case "PullRequestEvent": {
            const state = payload.pull_request?.merged ? "merged" : payload.action;
            action = `${state || "updated"} pull request`;
            url = payload.pull_request?.html_url || repoUrl;
            break;
        }
        case "IssuesEvent": {
            action = `${payload.action || "updated"} issue`;
            url = payload.issue?.html_url || repoUrl;
            break;
        }
        case "IssueCommentEvent": {
            action = "Commented on issue";
            url = payload.comment?.html_url || payload.issue?.html_url || repoUrl;
            break;
        }
        case "WatchEvent": {
            action = "Starred";
            break;
        }
        case "ForkEvent": {
            action = "Forked";
            url = payload.forkee?.html_url || repoUrl;
            break;
        }
        case "CreateEvent": {
            action = `Created ${payload.ref_type || "repository"}`;
            break;
        }
        case "DeleteEvent": {
            action = `Deleted ${payload.ref_type || "ref"}`;
            break;
        }
        case "ReleaseEvent": {
            action = `Released ${payload.release?.tag_name || ""}`.trim();
            url = payload.release?.html_url || repoUrl;
            break;
        }
        case "PublicEvent": {
            action = "Open sourced";
            break;
        }
        case "MemberEvent": {
            action = "Added a collaborator";
            break;
        }
        default:
            break;
    }

    return {
        id: event?.id,
        action,
        repoName,
        url,
        date: relativeTime(event?.created_at),
    };
};

// Map + trim a raw events array down to the feed items we render.
export const formatEvents = (events, limit = 18) => {
    if (!Array.isArray(events)) return [];
    return events
        .filter((event) => event?.repo?.name)
        .slice(0, limit)
        .map(formatEvent);
};

export default formatEvents;
