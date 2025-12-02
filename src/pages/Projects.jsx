import { useContext } from "react";
import useProjects from "../hooks/useProjects";
import { ModeContext } from "../context/ModeContext";

export default function Projects() {

  const { theme } = useContext(ModeContext);
  const { projects, loading } = useProjects();
  const needBoldFont = theme === 'light' ? window.innerWidth < 768 : false
  const projectTitleClass = (needBoldFont ? "font-semibold" : "project_title")

  return (
    <section className="fixed inset-5 overflow-y-scroll scrollbar-hide">
      <div className="px-14 py-36 text-right whitespace-nowrap">
        <h2 className={(needBoldFont ? "font-semibold" : "font-default") + (" animate-appear-smooth")}>
          ■ Projects
        </h2>
        {loading ? <div className="mt-14 animate-pulse">
          Fetching the stars from
          <br />
          the GitHub universe...
        </div> :
          projects.length > 0 && <div className={(needBoldFont ? "font-semibold" : "") + (" flex flex-col items-end gap-8 md:gap-12 lg:gap-16 mt-14 animate-appear-smooth")}>
            {projects.map((project) => (
              <a key={project.id} className="text-btn text-[2.2vw] md:text-[1.5vw] xl:flex xl:gap-3 xl:items-end" href={project.liveUrl || project.repoUrl} target="_blank" rel="noreferrer">
                <p>{project.created_at}</p>
                <p className={projectTitleClass + (" text-[4vw] lg:text-[4vw] xl:text-[5vw] uppercase")}>{project.name}</p>
              </a>
            ))}
          </div>
        }
      </div>
    </section>
  )
}