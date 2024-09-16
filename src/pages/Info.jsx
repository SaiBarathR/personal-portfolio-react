import { useContext } from "react";
import { ModeContext } from "../context/ModeContext";

export default function Info() {
    const { monospace } = useContext(ModeContext);
    return (
        <section className="w-full [min-height:calc(var(--vh, 1vh)*100)] font-semibold animate-appear-smooth">
            <div className="fixed flex flex-col left-12 bottom-10 gap-9">
                <div className="top-[45%] xl:fixed   xl:left-[55%] xl:top-[50%] ">
                    <ul>
                        <li><a className="text-btn " href="https://twitter.com/saibarathr" target="_blank" rel="noopener noreferrer">Twitter ↗</a></li>
                        <li><a className="text-btn " href="https://www.instagram.com/saibarath_r/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></li>
                    </ul>
                </div>
                <div className="xl:fixed  xl:left-[90%] xl:top-14 ">
                    <ul>
                        <li><a className="text-btn " href="https://github.com/SaiBarathR" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
                        <li><a className="text-btn " href="https://www.linkedin.com/in/saibarath-r/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
                        <li><a className="text-btn " href="https://www.npmjs.com/~saibarath" target="_blank" rel="noopener noreferrer">NPM ↗</a></li>

                    </ul>
                </div>
                <div className={"xl:fixed bottom-14 " + (monospace ? "xl:left-[76%]" : "xl:left-[79%]")}>
                    <ul>
                        <li><span className="font-normal ">Awwwards Star Performer Award<br /></span><span>Q3 FY23 - Ozonetel Communications</span></li>
                    </ul>
                </div>
            </div>
        </section >

    )
}
