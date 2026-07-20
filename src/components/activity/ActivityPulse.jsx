import { CountUp } from "./motion";
import { formatShortDate } from "../../utils/githubActivity";

export default function ActivityPulse({ insights, rolling, loading }) {
    if (loading || !insights) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px opacity-30">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="activity-skeleton h-24 border border-current/15" />
                ))}
            </div>
        );
    }

    const stats = [
        rolling && {
            label: "Current streak",
            value: insights.currentStreak,
            unit: insights.currentStreak === 1 ? "day" : "days",
        },
        {
            label: "Longest streak",
            value: insights.longestStreak,
            unit: insights.longestStreak === 1 ? "day" : "days",
        },
        {
            label: "Busiest day",
            value: insights.busiest?.count || 0,
            unit: insights.busiest?.count
                ? formatShortDate(insights.busiest.date)
                : "—",
        },
        {
            label: "Active days",
            value: insights.activeDays,
            unit: `of ${insights.dayCount} · ${insights.activePct}%`,
        },
        {
            label: "Daily average",
            value: insights.dailyAverage,
            decimals: 1,
            unit: "per day",
        },
        {
            label: "Weekend share",
            value: insights.weekendShare,
            unit: "% of work",
        },
    ].filter(Boolean);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="border-t border-current/15 pt-4 pb-2 pr-6"
                >
                    <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-3">
                        {stat.label}
                    </p>
                    <p className="font-extralight text-left text-3xl md:text-4xl leading-none tabular-nums">
                        <CountUp value={stat.value} decimals={stat.decimals || 0} />
                    </p>
                    <p className="mt-2 font-NeueMontrealMono text-[10px] tracking-[0.08em] opacity-40 tabular-nums">
                        {stat.unit}
                    </p>
                </div>
            ))}
        </div>
    );
}
