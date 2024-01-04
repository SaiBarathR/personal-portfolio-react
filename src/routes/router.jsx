import { createBrowserRouter } from "react-router-dom";
import PortfolioNavHome from "../components/PortfolioNavHome";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <PortfolioNavHome />,
        children: [
            {
                path: "/",
                element: <div>Home</div>,
            },
            {
                path: "/projects",
                element: <div>Projects</div>,
            },
            {
                path: "/info",
                element: <div>Info</div>,
            },
            {
                path: "/contact",
                element: <div>Contact</div>,
            },
            {
                path: "*",
                element: <div>Not found</div>,
            },
        ],
    },
]);