import { useContext, useMemo } from "react";
import ContributionGraph from "../components/activity/ContributionGraph";
import ActivityOverview from "../components/activity/ActivityOverview";
import ActivityPulse from "../components/activity/ActivityPulse";
import ActivityRhythm from "../components/activity/ActivityRhythm";
import ContributionTimeline from "../components/activity/ContributionTimeline";
import { CountUp, Reveal } from "../components/activity/motion";
import useActivity from "../hooks/useActivity";
import { buildInsights } from "../utils/githubActivity";
import { ModeContext } from "../context/ModeContext";

export default function Activity() {
    const { theme } = useContext(ModeContext);
    const needBoldFont = theme === "light" ? window.innerWidth < 768 : false;
    const {
        year,
        setYear,
        years,
        calendar,
        overview,
        timeline,
        loading,
        error,
        username,
    } = useActivity();

    const insights = useMemo(() => buildInsights(calendar), [calendar]);
    const total = calendar?.total ?? 0;
    const periodLabel = calendar?.rolling ? "last 12 months" : String(year);

    return (
        <section className="fixed inset-5 overflow-y-scroll scrollbar-hide">
            <div className="pl-28 md:pl-40 xl:pl-52 pr-6 md:pr-14 py-28 md:py-36">
                <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10 md:mb-14 animate-appear-smooth">
                    <div>
                        <h2 className={needBoldFont ? "font-semibold" : "font-default"}>
                            ■ Activity
                        </h2>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-60">
                            A live read of public GitHub work — density, rhythm, shape, and
                            recent motion across{" "}
                            <a
                                className="text-btn underline underline-offset-4 decoration-current/30"
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                @{username}
                            </a>
                            .
                        </p>
                    </div>

                    <div className="text-right">
                        {loading ? (
                            <p className="animate-pulse opacity-50 text-sm">Counting pulses...</p>
                        ) : (
                            <>
                                <p
                                    className={
                                        (needBoldFont ? "font-semibold" : "project_title") +
                                        " text-[18vw] md:text-[9vw] xl:text-[7vw] leading-none tabular-nums tracking-tight"
                                    }
                                >
                                    <CountUp value={total} duration={1.8} />
                                </p>
                                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] opacity-50">
                                    contributions · {periodLabel}
                                </p>
                            </>
                        )}
                    </div>
                </header>

                <nav
                    aria-label="Select year"
                    className="flex flex-wrap gap-x-6 gap-y-2 mb-16 md:mb-24 animate-appear-smooth"
                >
                    {years.map((y) => {
                        const active = y === year;
                        return (
                            <button
                                key={y}
                                type="button"
                                onClick={() => setYear(y)}
                                className={
                                    "text-btn font-NeueMontrealMono text-xs tracking-[0.14em] tabular-nums " +
                                    (active ? "opacity-100" : "opacity-35")
                                }
                            >
                                <span
                                    className={
                                        "inline-block mr-1.5 transition-opacity duration-300 " +
                                        (active ? "opacity-100" : "opacity-0")
                                    }
                                >
                                    ■
                                </span>
                                {y}
                            </button>
                        );
                    })}
                </nav>

                {error && (
                    <p className="mb-10 text-sm opacity-70 animate-appear-smooth">{error}</p>
                )}

                <div className={"space-y-16 md:space-y-24" + (error ? " hidden" : "")}>
                    <Reveal>
                        <section>
                            <p className="text-[11px] uppercase tracking-[0.22em] opacity-50 mb-5">
                                Year as signal
                            </p>
                            <ContributionGraph calendar={calendar} loading={loading} />
                            <div className="mt-10 md:mt-12">
                                <ActivityPulse
                                    insights={insights}
                                    rolling={Boolean(calendar?.rolling)}
                                    loading={loading}
                                />
                            </div>
                        </section>
                    </Reveal>

                    <Reveal>
                        <section>
                            <p className="text-[11px] uppercase tracking-[0.22em] opacity-50 mb-6">
                                Rhythm
                            </p>
                            <ActivityRhythm insights={insights} loading={loading} />
                        </section>
                    </Reveal>

                    <Reveal>
                        <section>
                            <p className="text-[11px] uppercase tracking-[0.22em] opacity-50 mb-6">
                                Shape of the work
                            </p>
                            <ActivityOverview overview={overview} loading={loading} />
                        </section>
                    </Reveal>

                    <Reveal>
                        <section>
                            <ContributionTimeline
                                timeline={timeline}
                                year={year}
                                loading={loading}
                                needBoldFont={needBoldFont}
                            />
                        </section>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
