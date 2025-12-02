import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ModeContext } from '../context/ModeContext';

export default function PortfolioHeader() {
    const { theme } = useContext(ModeContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const needBoldFont = theme === 'light' ? window.innerWidth < 768 : false

    useEffect(() => {
        if (pathname === "/") {
            navigate("/home");
        }
    }, [navigate, pathname]);

    const navItems = [
        { path: "/home", name: "Home" },
        { path: "/projects", name: "Projects" },
        { path: "/info", name: "Info" },
        // { path: "/contact", name: "Contact" },
    ];

    return (
        <header className="fixed text-[#AD9E9E]  dark:text-white z-10 left-12 top-10 mix-blend-difference">
            <h1 className={(needBoldFont ? "font-bold" : "font-normal") + (" text-3xl xl:text-6xl h-[30px] xl:h-[56px]")}>
                Sai Barath R
            </h1>
            <p className={(needBoldFont ? "font-semibold" : "font-normal") + (" mt-1 ml-[1px]")}>
                Software Engineer
            </p>
            <nav className="mt-10">
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
