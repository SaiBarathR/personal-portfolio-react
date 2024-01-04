import { Link, Outlet, useLocation } from "react-router-dom";

export default function PortfolioNavHome() {
    const { pathname } = useLocation();

    const navItems = [
        { path: "/", name: "Home" },
        { path: "/projects", name: "Projects" },
        { path: "/info", name: "Info" },
        { path: "/contact", name: "Contact" },
    ];

    return (
        <nav className="siteHeader_nav">
            <ol>
                {navItems.map((item) => (
                    <li key={item.path}>
                        <div
                            className={`${pathname === item.path ? "animate-appear-smooth" : " hidden"} absolute`}
                        >●
                        </div>
                        <Link
                            className={`_text ${pathname === item.path ? "animate-disappear-smooth" : "animate-appear-smooth"}`}
                            to={item.path}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ol>
            <Outlet />
        </nav>
    );
}