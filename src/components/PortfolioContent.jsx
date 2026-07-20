import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ModeContext } from "../context/ModeContext";
import PortfolioHeader from "./PortfolioHeader";

export default function PortfolioContent() {
    const { grain } = useContext(ModeContext);

    // Shader grain is a halftone dither; mix-blend-difference over it speckles text.
    // Keep difference blend for the smooth gradient; use solid colors when grain is on.
    const textClass = grain
        ? "text-black dark:text-white"
        : "text-[#C8B7B7] dark:text-white";

    return (
        <>
            <PortfolioHeader />
            <main
                className={
                    "fixed block z-[2] left-0 top-0 w-full h-full overflow-hidden" +
                    (grain ? "" : " mix-blend-difference")
                }
            >
                <div className={"relative min-h-full transform-[translate3d(0px,0px,0px)] " + textClass}>
                    <Outlet />
                </div>
            </main>
        </>
    );
}
