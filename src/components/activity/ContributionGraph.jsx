import { useMemo, useState } from "react";

const LEVEL_OPACITY = [0.08, 0.24, 0.45, 0.7, 1];
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const readoutDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

export default function ContributionGraph({ calendar, loading }) {
    const [hover, setHover] = useState(null);

    const peak = useMemo(() => {
        let top = null;
        calendar?.days?.forEach((day) => {
            if (!top || day.count > top.count) top = day;
        });
        return top;
    }, [calendar]);

    if (loading || !calendar) {
        return (
            <div className="w-full h-32 opacity-30">
                <div className="activity-skeleton h-full w-full border border-current/20" />
            </div>
        );
    }

    const { weeks, monthLabels } = calendar;

    return (
        <div className="w-full">
            <div className="flex justify-end mb-3 min-h-[1.25rem]">
                <p
                    aria-live="polite"
                    className="font-NeueMontrealMono text-[11px] tracking-wide opacity-60 tabular-nums shrink-0"
                >
                    {hover
                        ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} · ${readoutDate(hover.date)}`
                        : peak && peak.count > 0
                          ? `peak ${peak.count} · ${readoutDate(peak.date)}`
                          : "hover a day"}
                </p>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
                <div className="min-w-[680px] flex gap-3">
                    <div className="w-7 shrink-0 flex flex-col">
                        <div className="h-4 mb-2" />
                        <div className="relative flex-1">
                            {WEEKDAY_LABELS.map((label, index) =>
                                label ? (
                                    <span
                                        key={index}
                                        className="absolute left-0 -translate-y-1/2 text-[9px] uppercase tracking-[0.18em] opacity-40"
                                        style={{ top: `${((index + 0.5) / 7) * 100}%` }}
                                    >
                                        {label}
                                    </span>
                                ) : null
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="relative h-4 mb-2">
                            {monthLabels.map((month) => (
                                <span
                                    key={`${month.label}-${month.weekIndex}`}
                                    className="absolute top-0 text-[10px] uppercase tracking-[0.18em] opacity-45"
                                    style={{ left: `${(month.weekIndex / weeks.length) * 100}%` }}
                                >
                                    {month.label}
                                </span>
                            ))}
                        </div>

                        <div
                            className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                                gap: "3px",
                            }}
                        >
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                                    {Array.from({ length: 7 }, (_, dayIndex) => {
                                        const day = week.find((d) => d.weekday === dayIndex);
                                        if (!day) {
                                            return (
                                                <span
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className="aspect-square"
                                                />
                                            );
                                        }

                                        const isPeak =
                                            peak && peak.count > 0 && day.date === peak.date;

                                        return (
                                            <button
                                                key={day.date}
                                                type="button"
                                                aria-label={`${day.count} contributions on ${day.date}`}
                                                onMouseEnter={() => setHover(day)}
                                                onMouseLeave={() => setHover(null)}
                                                onFocus={() => setHover(day)}
                                                onBlur={() => setHover(null)}
                                                className="activity-cell aspect-square w-full rounded-none bg-current origin-center focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
                                                style={{
                                                    opacity: LEVEL_OPACITY[day.level],
                                                    animationDelay: `${Math.min(
                                                        weekIndex * 14 + dayIndex * 26,
                                                        1100
                                                    )}ms`,
                                                    boxShadow: isPeak
                                                        ? "0 0 0 1px currentColor"
                                                        : undefined,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-[0.16em] opacity-45">
                <span>Quiet</span>
                {LEVEL_OPACITY.map((opacity, level) => (
                    <span
                        key={level}
                        className="w-2.5 h-2.5 rounded-none bg-current"
                        style={{ opacity }}
                    />
                ))}
                <span>Loud</span>
            </div>
        </div>
    );
}
