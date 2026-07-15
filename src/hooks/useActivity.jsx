import { useState, useEffect } from "react";
import GitService from "../service/gitService";
import { formatEvents } from "../utils/githubActivity";

export default function useActivity() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(false);

    const getActivity = async () => {
        setLoading(true);
        try {
            let resp = await GitService.getUserEvents();

            if (!resp || (resp.message === "Not Found") || (resp.length !== undefined && resp.length < 1)) {
                setLoading(false);
                return console.log("No activity found");
            }

            setActivity(formatEvents(resp));
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getActivity();
    }, []);

    return { activity, loading };

}
