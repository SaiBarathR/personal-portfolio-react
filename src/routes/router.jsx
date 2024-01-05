import { createBrowserRouter } from "react-router-dom";
import PortfolioContent from "../components/PortfolioContent";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import Info from "../pages/Info";
import Contact from "../pages/Contact";
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