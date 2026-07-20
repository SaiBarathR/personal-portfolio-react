import { useCallback, useEffect, useMemo, useState } from "react";
import GitService from "../service/gitService";
import {
    buildCalendar,
    buildOverview,
    buildTimeline,
    buildYearSummaryTimeline,
} from "../utils/githubActivity";

const currentYear = new Date().getFullYear();

export default function useActivity() {
    const [year, setYear] = useState(currentYear);
    const [accountCreatedYear, setAccountCreatedYear] = useState(2019);
    const [calendar, setCalendar] = useState(null);
    const [overview, setOverview] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const years = useMemo(() => {
        const list = [];
        for (let y = currentYear; y >= accountCreatedYear; y -= 1) {
            list.push(y);
        }
        return list;
    }, [accountCreatedYear]);

    const load = useCallback(async (selectedYear) => {
        setLoading(true);
        setError(null);
        try {
            const isCurrentYear = selectedYear === currentYear;
            const [contribData, eventData] = await Promise.all([
                GitService.getContributions(selectedYear, { rolling: isCurrentYear }),
                isCurrentYear
                    ? GitService.getUserEventsPages(3)
                    : Promise.resolve([]),
            ]);

            const user = contribData?.user;
            const collection = user?.contributionsCollection;

            if (user?.createdAt) {
                setAccountCreatedYear(new Date(user.createdAt).getFullYear());
            }

            if (!collection) {
                throw new Error("Could not load contribution data");
            }

            setCalendar({
                ...buildCalendar(collection.contributionCalendar),
                rolling: isCurrentYear,
            });
            setOverview(buildOverview(collection));
            setEvents(Array.isArray(eventData) ? eventData : []);
        } catch (err) {
            console.log(err);
            setError(err?.message || "Failed to load activity");
            setCalendar(null);
            setOverview(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(year);
    }, [year, load]);

    const timeline = useMemo(() => {
        const fromEvents = buildTimeline(events, year);
        if (fromEvents.length) return fromEvents;
        return buildYearSummaryTimeline(overview, year);
    }, [events, overview, year]);

    return {
        year,
        setYear,
        years,
        calendar,
        overview,
        timeline,
        loading,
        error,
        username: GitService.username,
        reload: () => load(year),
    };
}
