import { useContext } from "react";
import useActivity from "../hooks/useActivity";
import { ModeContext } from "../context/ModeContext";

export default function Activity() {

  const { theme } = useContext(ModeContext);
  const { activity, loading } = useActivity();
  const needBoldFont = theme === 'light' ? window.innerWidth < 768 : false
  const activityTitleClass = (needBoldFont ? "font-semibold" : "project_title")

  return (
    <section className="fixed inset-5 overflow-y-scroll scrollbar-hide">
      <div className="px-14 py-36 text-right whitespace-nowrap">
        <h2 className={(needBoldFont ? "font-semibold" : "font-default") + (" animate-appear-smooth")}>
          ■ Activity
        </h2>
        {loading ? <div className="mt-14 animate-pulse">
          Loading recent
          <br />
          GitHub activity...
        </div> :
          activity.length > 0 && <div className={(needBoldFont ? "font-semibold" : "") + (" flex flex-col items-end gap-8 md:gap-12 lg:gap-16 mt-14 animate-appear-smooth")}>
            {activity.map((item) => (
              <a key={item.id} className="text-btn text-[2.2vw] md:text-[1.5vw] xl:flex xl:gap-3 xl:items-end" href={item.url} target="_blank" rel="noreferrer">
                <p>{item.action} · {item.date}</p>
                <p className={activityTitleClass + (" text-[4vw] lg:text-[4vw] xl:text-[5vw] uppercase")}>{item.repoName}</p>
              </a>
            ))}
          </div>
        }
      </div>
    </section>
  )
}
