import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./ease";
import { relativeTime } from "../../utils/githubActivity";

function flattenGroups(timeline) {
    return timeline.flatMap((month) =>
        month.groups.map((group) => ({
            ...group,
            monthLabel: month.label,
        }))
    );
}

function itemTitle(group) {
    if (group.kind === "commits") {
        const commits =
            group.commits ??
            (group.repos?.reduce((sum, repo) => sum + (repo.commits || 0), 0) || 0);
        const pushes = group.pushes || 0;
        const useCommits = commits > 0;
        const count = useCommits ? commits : pushes;
        const repoCount = group.repoCount ?? (group.repos?.length || 0);
        const lead = group.repos?.[0];
        return {
            action: useCommits
                ? `Created ${count} commit${count === 1 ? "" : "s"}`
                : `Pushed ${count} time${count === 1 ? "" : "s"}`,
            name: lead?.name?.split("/").pop() || "repositories",
            detail: repoCount > 1 ? `across ${repoCount} repositories` : null,
            url: lead?.url,
        };
    }

    if (group.kind === "create_repo") {
        return {
            action: "Created repository",
            name: group.repo?.name || group.subtitle?.split("/").pop() || "repository",
            detail: null,
            url: group.url,
        };
    }

    if (group.kind === "pull_requests") {
        return {
            action: `${group.merged ? "Merged" : "Opened"} ${group.count} pull request${
                group.count === 1 ? "" : "s"
            }`,
            name: group.repo?.name?.split("/").pop() || "pull requests",
            detail: null,
            url: group.url,
        };
    }

    if (group.kind === "issues") {
        return {
            action: `Opened ${group.count} issue${group.count === 1 ? "" : "s"}`,
            name: group.repo?.name?.split("/").pop() || "issues",
            detail: null,
            url: group.url,
        };
    }

    if (group.kind === "review") {
        return {
            action: group.title || `Reviewed ${group.count || 0} pull requests`,
            name: "reviews",
            detail: null,
            url: group.url,
        };
    }

    const repoLabel =
        group.repo?.name ||
        group.repo?.fullName?.split("/").pop() ||
        group.title?.match(/([\w.-]+\/[\w.-]+)/)?.[1]?.split("/")?.pop();

    return {
        action: group.title || "Activity",
        name: repoLabel || group.subtitle || "github",
        detail: null,
        url: group.url,
    };
}

export default function ContributionTimeline({ timeline, year, loading, needBoldFont }) {
    const reduced = useReducedMotion();
    const items = flattenGroups(timeline).slice(0, 12);
    const titleClass = needBoldFont ? "font-semibold" : "project_title";

    return (
        <div>
            <div className="flex items-baseline justify-between gap-4 mb-10 md:mb-14">
                <h3 className="text-[11px] uppercase tracking-[0.22em] opacity-50">
                    Recent signal
                </h3>
                {!loading && items.length > 0 && (
                    <span className="font-NeueMontrealMono text-[11px] opacity-40 tabular-nums">
                        {items.length} events
                    </span>
                )}
            </div>

            {loading ? (
                <p className="animate-pulse opacity-50 text-right">
                    Tuning into
                    <br />
                    the commit stream...
                </p>
            ) : items.length === 0 ? (
                <p className="opacity-50 text-sm text-right">No public signal for {year}.</p>
            ) : (
                <div className="flex flex-col items-end gap-10 md:gap-14">
                    {items.map((group, index) => {
                        const item = itemTitle(group);
                        const Comp = item.url ? motion.a : motion.div;
                        const linkProps = item.url
                            ? { href: item.url, target: "_blank", rel: "noreferrer" }
                            : {};
                        // Year-summary fallback rows carry synthetic dates — no relative time.
                        const isSummary = group.dateLabel === String(year);
                        const relative =
                            group.date && !isSummary ? relativeTime(group.date) : "";

                        return (
                            <Comp
                                key={group.id}
                                {...linkProps}
                                className="text-btn group text-right w-full max-w-3xl"
                                initial={reduced ? false : { opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    duration: 0.8,
                                    delay: Math.min(index, 3) * 0.08,
                                    ease: EASE,
                                }}
                            >
                                <p className="font-NeueMontrealMono text-[10px] md:text-[11px] tracking-[0.08em] opacity-60 tabular-nums">
                                    {item.action}
                                    <span className="opacity-50">
                                        {" "}
                                        · {group.dateLabel}
                                        {relative ? ` · ${relative}` : ""}
                                    </span>
                                </p>
                                <p
                                    className={
                                        titleClass +
                                        " text-[7vw] md:text-[4.5vw] xl:text-[3.8vw] uppercase leading-[0.95] mt-1 break-words"
                                    }
                                >
                                    {String(item.name).replace(/-/g, " ")}
                                    {item.url && (
                                        <span className="inline-block align-top text-[0.35em] ml-3 mt-2 opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300">
                                            ↗
                                        </span>
                                    )}
                                </p>
                                {item.detail && (
                                    <p className="mt-2 text-xs md:text-sm opacity-40 tracking-wide">
                                        {item.detail}
                                    </p>
                                )}
                            </Comp>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
