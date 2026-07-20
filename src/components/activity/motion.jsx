import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "./ease";

/** Fade + rise wrapper for scroll-triggered section reveals. */
export function Reveal({ children, delay = 0, className = "" }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            className={className}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** Tabular number that counts up once it scrolls into view. */
export function CountUp({ value = 0, duration = 1.4, decimals = 0, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return undefined;
        if (reduced) {
            setDisplay(value);
            return undefined;
        }
        const controls = animate(0, value, {
            duration,
            ease: EASE,
            onUpdate: (latest) => setDisplay(latest),
        });
        return () => controls.stop();
    }, [inView, value, duration, reduced]);

    const formatted = decimals
        ? display.toFixed(decimals)
        : Math.round(display).toLocaleString();

    return (
        <span ref={ref} className={className}>
            {formatted}
        </span>
    );
}
