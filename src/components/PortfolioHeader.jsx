import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PortfolioHeader() {
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
        <header className="fixed text-white z-10 left-14 top-12 mix-blend-difference">
            <h1 className="font-extralight text-3xl xl:text-6xl h-[30px] xl:h-[56px]">
                Sai Barath
            </h1>
            <p className="font-extralight mt-1 ml-[1px]">
                RND Software Engineer
            </p>
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
            </nav>
        </header>
    )
}
