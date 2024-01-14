import useProjects from "../hooks/useProjects";

export default function Projects() {

  const {projects, loading} = useProjects();

  return (
    <section className="w-full fixed h-full overflow-y-scroll scrollbar-hide">
      <div className="px-14 py-36 text-right whitespace-nowrap">
        <h2 className="font-default animate-appear-smooth">
          ■ Projects (Design & Develop)
        </h2>
        {loading ? <div className="mt-14 animate-pulse">
          Fetching the stars from 
          <br/>
          the GitHub universe...       
        </div> : 
        projects.length > 0 && <div className="flex flex-col items-end gap-8 md:gap-12 lg:gap-16 mt-14 animate-appear-smooth">
          {projects.map((project) => (
            <a key={project.id} className="text-btn text-[2.2vw] md:text-[1.5vw] xl:flex xl:gap-3 xl:items-end" href={project.liveUrl || project.repoUrl} target="_blank" rel="noreferrer">
              <p>{project.created_at}</p>
              <p className="project_title text-[4vw] lg:text-[4vw] xl:text-[5vw] uppercase">{project.name}</p>
            </a>
          ))}
        </div>
        }
      </div>
    </section>
  )
}