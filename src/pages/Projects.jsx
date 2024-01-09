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
        projects.length > 0 && <div className="flex flex-col items-end gap-4 mt-14 animate-appear-smooth">
          {projects.map((project) => (
            <a key={project.id} className="text-btn" href={project.repoUrl} target="_blank" rel="noreferrer">
              <div className="project_title uppercase">{project.name}</div>
              <div className="mt-1">{project.created_at}</div>
            </a>
          ))}
        </div>
        }

      </div>
    </section>
  )
}