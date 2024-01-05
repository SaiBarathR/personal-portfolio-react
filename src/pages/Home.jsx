export default function Home() {

  const description = [
    "Born in 2000", "in Chennai, India.",
    "Web development", "has the potential", " to be more ", "varied and creative.",
    "With a goal", "to showcase", "the opportunities", "of web development,",
    "On a mission", "to unveil the", "myriad possibilities, ", "I am exploring", "through trials", "and ideas.",
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
