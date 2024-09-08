export default function Home() {

  const description = [
    "Welcome to my ", "digital playground,", "where every line", "of code brings ", "creativity to life.",
    "I’m a developer on a ", "mission to shape", "ideas into interactive", "experiences.",
  ]

  return (
    <section className="block opacity-1 w-full min-h-[calc(100vh-4rem)] animate-appear-smooth">
      <div className="absolute right-12 bottom-12 whitespace-nowrap">
        <p className="leading-[1.5] flex flex-col font-semibold">
          {description.map((item, index) => <span key={index}>{item}</span>)}
        </p>
      </div>
    </section>
  )
}
