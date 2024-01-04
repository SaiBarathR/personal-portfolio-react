import { createBrowserRouter } from "react-router-dom";
import PortfolioContent from "../components/PortfolioContent";
import Home from "../components/pages/Home";
import Projects from "../components/pages/Projects";
import Info from "../components/pages/Info";
import Contact from "../components/pages/Contact";
import UnknownRoute from "../components/UnknownRoute";

export const portfolioContentRouter = createBrowserRouter([
    {
        path: "/",
        element: <PortfolioContent />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/projects",
                element: <Projects />,
            },
            {
                path: "/info",
                element: <Info />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "*",
                element: <UnknownRoute />,
            },
        ],
    },
]);