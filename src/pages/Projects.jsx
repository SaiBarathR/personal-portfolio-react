// // import { useEffect, useState } from "react";
// // import GitService from "../service/gitService";

// // export default function Projects() {

// //   const [projects, setProjects] = useState([]);

// //   const getProjects = async () => {
// //     try {
// //       let resp = await GitService.getRepos();
// //       if (!resp || resp.message === "Not Found" || (resp.length !== undefined && resp.length < 1)) {
// //         return console.log("No repos found");
// //       }
// //       resp = resp.reduce((acc, repo) => ([...acc, {
// //         id: repo.id,
// //         name: repo.name,
// //         repoUrl: repo.html_url,
// //         updated_at: repo.updated_at,
// //         created_at: repo.created_at,
// //         liveUrl: repo.homepage,
// //         language: repo.language,
// //         topics: repo.topics,
// //       }]), []);

// //       console.log("repos", resp)
// //       setProjects(resp.sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at)));
// //     }
// //     catch (error) {
// //       console.log(error);
// //     }
// //   }

// //   useEffect(() => {
// //     getProjects();
// //   }, []);

// //   return (
// //     <div className="flex flex-col items-center justify-center w-full h-full">
// //       <h1 className="text-3xl font-bold">Projects</h1>
// //       <div className="flex flex-wrap justify-center w-full mt-10">
// //         {
// //           projects.map((project, index) => (
// //             <div className="flex flex-col items-center justify-center w-full h-full p-5 m-5 bg-gray-900 rounded-lg shadow-lg md:w-2/5 lg:w-1/4" key={index}>
// //               <h1 className="text-2xl font-bold uppercase">{project.name}</h1>
// //               <div className="flex flex-wrap justify-center w-full mt-5">
// //                 {
// //                   project.topics.map((topic, index) => (
// //                     <p className="px-2 py-1 m-1 text-sm bg-gray-800 rounded-lg" key={index}>{topic}</p>
// //                   ))
// //                 }
// //               </div>
// //               <div className="flex flex-wrap justify-center w-full mt-5">
// //                 <a href={project.repoUrl} target="_blank" rel="noreferrer" className="px-2 py-1 m-1 text-sm bg-gray-800 rounded-lg">Repo</a>
// //                 {
// //                   project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-2 py-1 m-1 text-sm bg-gray-800 rounded-lg">{project.liveUrl}</a>
// //                 }
// //               </div>
// //             </div>
// //           ))
// //         }
// //       </div>
// //     </div>
// //   )
// // }

// import { useEffect, useState } from "react";
// import GitService from "../service/gitService";

// export default function Projects() {
//   const [projects, setProjects] = useState([]);

//   const getProjects = async () => {
//     try {
//       let resp = await GitService.getRepos();
//       if (!resp || resp.message === "Not Found" || (resp.length !== undefined && resp.length < 1)) {
//         return console.log("No repos found");
//       }
//       resp = resp.reduce((acc, repo) => ([...acc, {
//         id: repo.id,
//         name: repo.name,
//         repoUrl: repo.html_url,
//         updated_at: repo.updated_at,
//         created_at: repo.created_at,
//         liveUrl: repo.homepage,
//         language: repo.language,
//         topics: repo.topics,
//       }]), []);

//       setProjects(resp.sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at)));
//     }
//     catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     getProjects();
//   }, []);

//   return (
//     <div className="flex fixed right-0 flex-col items-start justify-start w-full h-full overflow-hidden">
//       <h1 className="text-3xl font-bold">■ Projects (Design & Develop)</h1>
//       <div className="flex flex-col items-start justify-start w-full h-full overflow-y-scroll scrollbar-hide mt-10">
//         {
//           projects.map((project, index) => (
//             <a href={project.repoUrl} target="_blank" rel="noreferrer" className="project_item xl:flex-row-reverse text-btn mb-5" key={index}>
//               <div className="project_title text-2xl font-bold uppercase">{project.name}</div>
//               <div className="project_info text-sm">{new Date(project.updated_at).getFullYear()} / Commission / Special</div>
//             </a>
//           ))
//         }
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from "react";
import GitService from "../service/gitService";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    try {
      let resp = await GitService.getRepos();
      if (!resp || resp.message === "Not Found" || (resp.length !== undefined && resp.length < 1)) {
        return console.log("No repos found");
      }
      resp = resp.reduce((acc, repo) => ([...acc, {
        id: repo.id,
        name: repo.name ? repo.name.replace(/-/g, " ") : "",
        repoUrl: repo.html_url,
        updated_at: repo.updated_at,
        created_at: repo.created_at ? new Date(repo.created_at).getFullYear() : "",
        liveUrl: repo.homepage,
        language: repo.language,
        topics: repo.topics,
      }]), []);

      setProjects(resp.sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at)));
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <section className="w-full fixed h-full overflow-y-scroll scrollbar-hide">
      <div className="px-14 py-36 text-right whitespace-nowrap">
        <div className="">
          <h2 className="font-default animate-appear-smooth">
            ■ Projects (Design & Develop)
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4 mt-14">
          {projects.map((project) => (
            <a key={project.id} className="text-btn animate-appear-smooth" href={project.repoUrl} target="_blank" rel="noreferrer">
              <div className="project_title uppercase">{project.name}</div>
              <div className="mt-1">{project.created_at}</div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}