import { useState, useEffect } from "react";
import { reposToDisplay } from "../utils/constants";
import GitService from "../service/gitService";

export default function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const getProjects = async () => {
        setLoading(true);
        try {
            let resp = await GitService.getRepos();            

            if (!resp || (resp.message === "Not Found") || (resp.length !== undefined && resp.length < 1)) {
                setLoading(false);
                return console.log("No repos found");                
            }
           
            const sortByRepoToDisplay = reposToDisplay.reduce((acc, repoId) => {
                const repo = resp.find((repo) => repo.id === repoId);
                if (!repo) return acc;
                return [...acc, {
                    id: repo.id,
                    name: repo.name ? repo.name.replace(/-/g, " ") : "",
                    repoUrl: repo.html_url,
                    updated_at: repo.updated_at,
                    created_at: repo.created_at ? new Date(repo.created_at).getFullYear() : "",
                    liveUrl: repo.homepage,
                    language: repo.language,
                    topics: repo.topics,
                }];
            }, []);
            
            setProjects(sortByRepoToDisplay);
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
