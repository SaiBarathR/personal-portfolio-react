import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./ease";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeekdayCadence({ weekdayTotals }) {
    const reduced = useReducedMotion();
    const [hover, setHover] = useState(null);
    const max = Math.max(...weekdayTotals, 1);
    const peakIndex = weekdayTotals.indexOf(Math.max(...weekdayTotals));

    return (
        <div>
            <div className="flex items-baseline justify-between mb-6">
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-50">
                    Weekly cadence
                </p>
                <p className="font-NeueMontrealMono text-[11px] tabular-nums opacity-60 min-h-[1rem]">
                    {hover !== null
                        ? `${weekdayTotals[hover]} on ${DAY_LABELS[hover]}s`
                        : `loudest on ${DAY_LABELS[peakIndex]}s`}
                </p>
            </div>

            <div className="flex items-end gap-2 h-36 md:h-44">
                {weekdayTotals.map((total, index) => {
                    const share = total / max;
                    return (
                        <button
                            key={index}
                            type="button"
                            aria-label={`${total} contributions on ${DAY_LABELS[index]}s`}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover(index)}
                            onBlur={() => setHover(null)}
                            className="group flex-1 h-full flex flex-col justify-end focus:outline-none"
                        >
                            <motion.div
                                className="w-full bg-current group-hover:!opacity-100 group-focus-visible:!opacity-100 transition-opacity duration-300"
                                style={{
                                    height: `${Math.max(share * 100, total > 0 ? 3 : 1)}%`,
                                    opacity: 0.15 + share * 0.85,
                                    originY: 1,
                                }}
                                initial={reduced ? false : { scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{
                                    duration: 0.9,
                                    delay: index * 0.07,
                                    ease: EASE,
                                }}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-2 mt-3">
                {DAY_LABELS.map((label, index) => (
                    <span
                        key={label}
                        className={
                            "flex-1 text-center text-[9px] uppercase tracking-[0.18em] " +
                            (index === peakIndex ? "opacity-80" : "opacity-40")
                        }
                    >
                        {label.slice(0, 1)}
                    </span>
                ))}
            </div>
        </div>
    );
}

function MonthlyFlow({ monthly, peakMonth }) {
    const reduced = useReducedMotion();
    if (!monthly || monthly.length < 2) return null;

    const width = 600;
    const height = 180;
    const pad = 6;
    const max = Math.max(...monthly.map((month) => month.total), 1);

    const points = monthly.map((month, index) => [
        pad + (index * (width - pad * 2)) / (monthly.length - 1),
        height - pad - (month.total / max) * (height - pad * 2),
    ]);

    const line = points
        .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`)
        .join(" ");
    const area = `${line} L${points[points.length - 1][0]},${height} L${points[0][0]},${height} Z`;
    const peakIndex = monthly.findIndex((month) => month.key === peakMonth?.key);

    return (
        <div>
            <div className="flex items-baseline justify-between mb-6">
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-50">
                    Monthly flow
                </p>
                <p className="font-NeueMontrealMono text-[11px] tabular-nums opacity-60">
                    {peakMonth ? `crest ${peakMonth.total} · ${peakMonth.label}` : ""}
                </p>
            </div>

            <div className="relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-36 md:h-44 overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <motion.path
                        d={area}
                        fill="currentColor"
                        initial={reduced ? false : { opacity: 0 }}
                        whileInView={{ opacity: 0.08 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                    />
                    <motion.path
                        d={line}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                        initial={reduced ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.6, ease: EASE }}
                    />
                </svg>
                {peakIndex >= 0 && (
                    <motion.span
                        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                        style={{
                            left: `${(points[peakIndex][0] / width) * 100}%`,
                            top: `${(points[peakIndex][1] / height) * 100}%`,
                        }}
                        initial={reduced ? false : { opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: 1.2, ease: EASE }}
                    />
                )}
            </div>

            <div className="flex justify-between mt-3">
                {monthly.map((month) => (
                    <span
                        key={month.key}
                        className={
                            "text-[9px] uppercase tracking-[0.14em] " +
                            (month.key === peakMonth?.key ? "opacity-80" : "opacity-40")
                        }
                    >
                        {month.label.slice(0, 1)}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function ActivityRhythm({ insights, loading }) {
    if (loading || !insights) {
        return (
            <div className="grid md:grid-cols-2 gap-10 opacity-30">
                <div className="activity-skeleton h-52 border border-current/15" />
                <div className="activity-skeleton h-52 border border-current/15" />
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <WeekdayCadence weekdayTotals={insights.weekdayTotals} />
            <MonthlyFlow monthly={insights.monthly} peakMonth={insights.peakMonth} />
        </div>
    );
}
