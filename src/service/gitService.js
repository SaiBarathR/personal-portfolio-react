import { gitConfig } from "../utils/config";

// Talks to the Netlify function in netlify/functions/github.js, which holds
// the GitHub token server-side and masks anything private.
const GitService = (function () {
    const proxyUrl = gitConfig.gitProxyUrl;
    const username = gitConfig.gitUserName;

    var service = {};

    service.username = username;

    service.get = async function (op, params = {}) {
        const query = new URLSearchParams({ op, ...params });
        const response = await fetch(`${proxyUrl}?${query}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || "GitHub request failed");
        }
        return data;
    };

    service.getRepos = function () {
        return service.get("repos");
    };

    service.getUserEventsPages = async function (pages = 3, { publicOnly = false } = {}) {
        try {
            return await service.get("events", { pages, ...(publicOnly && { public: 1 }) });
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    service.getContributions = function (year, { withPreviousYear = false } = {}) {
        return service.get("contributions", {
            year,
            ...(withPreviousYear && { previousYear: 1 }),
        });
    };

    return service;
})();

export default GitService;
