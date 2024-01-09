import { gitConfig } from "../utils/config";

const GitService = (function () {
    const baseUrl = gitConfig.gitBaseUrl;
    const username = gitConfig.gitUserName;
    const headers = {
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `token ${gitConfig.gitPersonalKey}`,
    }

    const urls = {
        user: `${baseUrl}/users/${username}`,
        repos: `${baseUrl}/users/${username}/repos`,
        repo: `${baseUrl}/repos/${username}`,
    }
    var service = {};

    service.getWithHeaders = function (url) {
        return fetch(url, {
            headers
        }).then((response) => response.json()).then((data) => data).catch((error) => {
            console.log(error);
            return error;
        });
    }

    service.getGithubUserDetails = function () {
        return service.getWithHeaders(urls.user);
    }

    service.getRepos = function () {
        return service.getWithHeaders(urls.repos);
    }

    service.getRepoDetails = function (repoUserName) {
        return service.getWithHeaders(`${urls.repo}/${repoUserName}`);
    }

    service.getWeeklyCommitCount = function (repoUserName) {
        return service.getWithHeaders(`${urls.repo}/${repoUserName}/stats/participation`);
    }

    return service;
}());

export default GitService;
