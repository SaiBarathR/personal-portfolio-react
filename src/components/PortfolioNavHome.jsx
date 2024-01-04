import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function PortfolioNavHome() {

    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (pathname === "/") {
            navigate("/home");
        }
    }, [navigate, pathname]);

    const navItems = [
        { path: "/home", name: "Home" },
        { path: "/projects", name: "Projects" },
        { path: "/info", name: "Info" },
        { path: "/contact", name: "Contact" },
    ];

    return (
        <nav className="mt-8">
            <ol className="flex flex-col gap-3">
                {navItems.map((item) => (
                    <li key={item.path}>
                        <div className={`${pathname === item.path ? "animate-appear-smooth" : " hidden"} absolute`}>
                            ●
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