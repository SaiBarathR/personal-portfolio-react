import { Outlet } from "react-router-dom";
import PortfolioHeader from "./PortfolioHeader";

export default function PortfolioContent() {

    return (
        <>
            <PortfolioHeader />
            <main className="fixed block z-[2] left-0 top-0 w-full h-full overflow-hidden mix-blend-difference">
                <div
                    className="relative min-h-full transform"
                    style={{ transform: "translate3d(0px,0px,0px)" }}
                >
                    <Outlet />
                </div>
            </main>
        </>
    );
}