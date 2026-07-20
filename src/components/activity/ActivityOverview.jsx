import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "./motion";
import { EASE } from "./ease";

const METRICS = [
    { key: "commits", label: "Commits", opacity: 1 },
    { key: "pullRequests", label: "Pull requests", opacity: 0.6 },
    { key: "issues", label: "Issues", opacity: 0.35 },
    { key: "reviews", label: "Reviews", opacity: 0.18 },
];

export default function ActivityOverview({ overview, loading }) {
    const reduced = useReducedMotion();

    if (loading || !overview) {
        return (
            <div className="space-y-6 opacity-30">
                <div className="activity-skeleton h-2.5 border border-current/15" />
                <div className="activity-skeleton h-28 border border-current/15" />
                <div className="activity-skeleton h-48 border border-current/15" />
            </div>
        );
    }

    const segments = METRICS.filter((metric) => (overview[metric.key] || 0) > 0);
    const topRepos = overview.repositories.slice(0, 6);
    const maxRepoCount = Math.max(...topRepos.map((repo) => repo.count), 1);
    const repoTotal = overview.repositories.reduce((sum, repo) => sum + repo.count, 0);

    return (
        <div className="space-y-14 md:space-y-16">
            <div>
                <div className="flex h-2.5 gap-px mb-8" role="img" aria-label="Contribution composition">
                    {segments.map((metric, index) => (
                        <motion.div
                            key={metric.key}
                            className="bg-current h-full"
                            style={{
                                opacity: metric.opacity,
                                flexGrow: Math.max(overview.percents?.[metric.key] || 0, 1),
                                flexBasis: 0,
                                originX: 0,
                            }}
                            initial={reduced ? false : { scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 1, delay: index * 0.12, ease: EASE }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                    {METRICS.map((metric) => {
                        const count = overview[metric.key] || 0;
                        const pct = overview.percents?.[metric.key] || 0;
                        return (
                            <div key={metric.key} className="min-w-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="w-2 h-2 bg-current shrink-0"
                                        style={{ opacity: metric.opacity }}
                                    />
                                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 truncate">
                                        {metric.label}
                                    </span>
                                </div>
                                <p className="font-extralight text-left text-4xl md:text-5xl leading-none tabular-nums">
                                    <CountUp value={count} />
                                </p>
                                <p className="mt-2 font-NeueMontrealMono text-[10px] tracking-[0.08em] opacity-40 tabular-nums">
                                    {pct}% of the work
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {topRepos.length > 0 && (
                <div>
                    <div className="flex items-baseline justify-between mb-2">
                        <p className="text-[11px] uppercase tracking-[0.22em] opacity-50">
                            Most touched
                        </p>
                        <p className="font-NeueMontrealMono text-[11px] tabular-nums opacity-40">
                            {overview.repoCount} repositories
                        </p>
                    </div>
                    <ol>
                        {topRepos.map((repo, index) => {
                            const share = repo.count / maxRepoCount;
                            const pct = repoTotal > 0 ? Math.round((repo.count / repoTotal) * 100) : 0;
                            return (
                                <li key={repo.name} className="border-t border-current/10">
                                    <a
                                        href={repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-btn group grid grid-cols-[1.5rem_minmax(0,1fr)_auto] md:grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 md:gap-x-4 py-4"
                                    >
                                        <span className="font-NeueMontrealMono text-[11px] tabular-nums opacity-30">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-base md:text-lg tracking-wide truncate">
                                                {repo.name.split("/").pop()}
                                                <span className="inline-block ml-2 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300">
                                                    ↗
                                                </span>
                                            </span>
                                            <span className="block mt-2.5 h-px bg-current/10 overflow-hidden">
                                                <motion.span
                                                    className="block h-full bg-current"
                                                    style={{
                                                        width: `${Math.max(share * 100, 2)}%`,
                                                        originX: 0,
                                                    }}
                                                    initial={reduced ? false : { scaleX: 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    viewport={{ once: true, margin: "-40px" }}
                                                    transition={{
                                                        duration: 1,
                                                        delay: index * 0.08,
                                                        ease: EASE,
                                                    }}
                                                />
                                            </span>
                                        </span>
                                        <span className="font-NeueMontrealMono text-xs tabular-nums opacity-60">
                                            {repo.count.toLocaleString()}
                                            <span className="opacity-50 hidden md:inline"> · {pct}%</span>
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}
        </div>
    );
}
