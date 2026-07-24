import { useState, useEffect } from "react";
import GitService from "../service/gitService";
import {
    buildLatestActivityByRepo,
    resolveProjectActivity,
} from "../utils/githubActivity";

export default function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProjects = async () => {
        setLoading(true);
        try {
            const [reposResult, eventsResult] = await Promise.allSettled([
                GitService.getRepos(),
                GitService.getUserEventsPages(3),
            ]);

            const resp = reposResult.status === "fulfilled" ? reposResult.value : null;
            const events =
                eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value)
                    ? eventsResult.value
                    : [];

            if (!resp || (resp.message === "Not Found") || (resp.length !== undefined && resp.length < 1)) {
                setLoading(false);
                return console.log("No repos found");
            }

            const latestByRepo = buildLatestActivityByRepo(events);

            const filterdRepoList = resp
                .reduce((acc, repo) => {
                    if (repo?.topics?.includes("sbc")) {
                        const repoName = repo.name || "";
                        const activity = resolveProjectActivity(
                            repoName,
                            latestByRepo,
                            repo.pushed_at
                        );

                        return [...acc, {
                            id: repo.id,
                            repoName,
                            name: repoName.replace(/-/g, " "),
                            repoUrl: repo.html_url,
                            updated_at: repo.updated_at,
                            pushed_at: repo.pushed_at,
                            created_at: repo.created_at ? new Date(repo.created_at).getFullYear() : "",
                            liveUrl: repo.homepage,
                            language: repo.language,
                            topics: repo.topics,
                            activityLabel: activity.activityLabel,
                            activityAt: activity.activityAt,
                            activityRelative: activity.activityRelative,
                        }];
                    }
                    return acc;
                }, [])
                .sort((a, b) => {
                    const aTime = a.activityAt ? new Date(a.activityAt).getTime() : 0;
                    const bTime = b.activityAt ? new Date(b.activityAt).getTime() : 0;
                    return bTime - aTime;
                });

            setProjects(filterdRepoList);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getProjects();
    }, []);

    return { projects, loading };

}
