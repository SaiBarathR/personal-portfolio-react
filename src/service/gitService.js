import config from '../utils/config.json';

const GitService = (function () {
    const baseUrl = config.gitBaseUrl;
    const username = config.gitUserName;
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }

    const urls = {
        user: `${baseUrl}/users/${username}`,
        repos: `${baseUrl}/users/${username}/repos`,
        repo: `${baseUrl}/repos/${username}`,
    }
    var service = {};

    service.getGithubUserDetails = function () {
        return fetch(urls.user, {
            headers
        }).then((response) => response.json()).then((data) => data);
    }

    service.getRepos = function () {
        return fetch(urls.repos, {
            headers
        }).then((response) => response.json()).then((data) => data);
    }

    service.getRepoDetails = function (repoUserName) {
        return fetch(`${urls.repo}/${repoUserName}`, {
            headers
        }).then((response) => response.json()).then((data) => data);
    }

    service.getWeeklyCommitCount = function (repoUserName) {
        return fetch(`${urls.repo}/${repoUserName}/stats/participation`, {
            headers
        }).then((response) => response.json()).then((data) => data);
    }

    return service;
}());

export default GitService;
