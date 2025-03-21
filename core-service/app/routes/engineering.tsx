import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Engineering" },
    {
      name: "Engineering",
      content: "Witness the engineering behind this application.",
    },
  ];
};

export default function Engineering() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    }
  });
  return (
    <main className="w-full bg-background">
      <Link
        to="/"
        className="text-sm text-nowrap sm:text-base fixed top-4 left-4 underline font-light text-sidebar-foreground backdrop-blur-lg hover:bg-muted hover:no-underline px-3 sm:px-5 py-2 rounded-xl"
      >
        Home
      </Link>
      <div className="flex flex-col items-center justify-start gap-4 md:gap-8 pb-12 pt-20 md:py-20 px-4 lg:py-36">
        <img src="/logo-icon-dark-01.png" className="w-16 md:w-20 lg:w-24" />
        <h1 className="text-4xl md:text-5xl xl:text-6xl text-center font-semibold">
          Engineering behind{" "}
          <span className="bg-gradient-to-r from-chart-4 to-accent bg-clip-text text-transparent">
            Trakkr
          </span>
        </h1>
        <p className="text-sidebar-foreground font-light text-[12px] text-center md:text-base">
          There is a reason why this page doesn't have a light mode.
        </p>
      </div>
      <div className="flex flex-col items-center text-center w-full px-8 xl:px-24 xl:w-2/3 mx-auto gap-3 md:gap-5 lg:gap-6 xl:gap-8 text-sidebar-foreground">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          Warming up: What to expect..?
        </h3>
        <div className="text-[12px] md:text-base flex flex-col items-center gap-3">
          <p>
            I get it, this seems interesting. So let me tell you what we are
            going through here. First I will tell you{" "}
            <strong className="text-foreground">
              what problem this application aims to solve
            </strong>
            , then very quickly we move on to the{" "}
            <strong className="text-foreground">high level design</strong> of
            this application.
          </p>
          <p>
            Still with me? Okay, then we will go through the{" "}
            <strong className="text-foreground">database design</strong> of this
            project. After that I will quickly share how I built some of the
            most
            <strong className="text-foreground"> interesting features </strong>
            of this project. I will conclude by mentioning the
            <strong className="text-foreground"> tech stack</strong>.
          </p>
          <strong className="text-foreground">Let's begin!</strong>
        </div>
      </div>
      <hr className="mt-8 md:mt-12 lg:mt-16 xl:mt-24 w-1/2 mx-auto border-foreground opacity-30" />
      <div className="my-6 md:my-10 lg:mt-14 xl:my-24 mx-auto text-center flex flex-col items-center gap-3 md:gap-4 lg:gap-5 xl:gap-6 text-sidebar-foreground w-full px-8 xl:px-24 xl:w-2/3">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          Once upon a time...
        </h3>
        <p className="text-[12px] md:text-base">
          Chintu, a dedicated gym-goer, wanted to improve his lifts. He knew
          progressive overload was key, so he started logging workouts—using
          Google Notes or, worse, his memory. Every Monday, he either forgot
          last week’s numbers or struggled to compare progress (because Google
          Notes wasn’t built for tracking gains).
          <br />
          No structure. No standardization. Just confusion.
        </p>
        <p className="text-[12px] md:text-base">
          That’s where Trakkr comes in. No more scattered notes or forgotten
          lifts—just a clean, structured way to log, compare, and improve.
        </p>
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <div className="w-full mx-auto text-center px-8 xl:px-24 my-6 md:my-10 lg:mt-14 xl:my-24 flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          High level diagram
        </h3>
        <img src="/hld-2.svg" loading="lazy" />
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <div className="w-full mx-auto text-center px-8 xl:px-24 my-6 md:my-10 lg:mt-14 xl:my-24 flex flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          Database Design
        </h3>
        <img src="/db-design.svg" loading="lazy" className="w-3/4 mx-auto" />
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <div className="w-full xl:w-2/3 mx-auto text-center px-8 xl:px-24 my-6 md:my-10 lg:mt-14 xl:my-24 flex flex-col gap-6">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          There are <span className="line-through opacity-35">APIs</span>{" "}
          Actions!
        </h3>
        <p className="text-sidebar-foreground text-[12px] md:text-base">
          Remix (framework of this web application) provides server actions for
          data mutations (backend). So, this way every route which has an
          'action' also becomes an API route. Sounds cool, here is an example:
        </p>
        <img
          src="/server-action-snippet.svg"
          className="rounded-xl w-3/4 mx-auto"
          loading="lazy"
        />
        <p className="text-sidebar-foreground text-[12px] md:text-base">
          Remix takes you back to the traditional way of dealing with mutations.
          <br /> Similarly, for 'GET' requests, there is a loader function like
          action which executes before the page gets loaded.
        </p>
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <div className="w-full xl:w-2/3 mx-auto text-center px-8 xl:px-24 my-6 md:my-10 lg:mt-14 xl:my-24 flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-6">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          Let's talk about features
        </h3>
        <p className="text-sidebar-foreground text-[12px] md:text-base">
          Let me discuss with you the approach with which I implemented 5 main
          features of this application in descending order of interesting-ness.
        </p>
        <div className="ml-auto text-right py-4 md:py-6 lg:py-10 xl:py-12 ">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              01{" "}
            </strong>
            AI Analysis
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            This is implemented through an AI agent (RAG) built using Langgraph.
            The agent extracts the last 10 workouts from the database, submits
            them to LLM, then saves the structured output from the LLM to the
            database. The flow is shown below:
          </p>
          <img src="/agent-flow.svg" loading="lazy" />
        </div>
        <div className="mr-auto text-left py-4 md:py-6 lg:py-10 xl:py-12">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              02{" "}
            </strong>
            Workout Logging
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            The user logs his reps and weight lifted in exercises for every set
            he does. But Utkarsh this is simple CRUD, why is it here?! <br />I
            want the user to get almost realtime updates, even if server and
            database and quite busy. So, I used Redis (in memory database) to
            achieve this. This way, the load on the primary database is reduced,
            ensuring real-time updates and an interruption-free workout. After
            the user finishes the workout, the application saves all the data to
            the database in one bulk operation.
          </p>
          <img src="/workout-logging.svg" loading="lazy" />
        </div>
        <div className="ml-auto text-right py-4 md:py-6 lg:py-10 xl:py-12">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              03{" "}
            </strong>
            Image Upload
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            This is an interesting one! I was keen on building a scalable system
            this time, so I decided to keep a separate service dedicated to
            uploading images, so that this heavy lifting job is not done by my
            cute core-service. The following flow is not perfect at all, I
            should have vertically partitioned the database and given the image
            upload service a dedicated database, but it is good to go I guess.
            <br />
            This is how it goes, have a close look:
          </p>
          <img src="/image-upload.svg" loading="lazy" />
        </div>
        <div className="mr-auto text-left py-4 md:py-6 lg:py-10 xl:py-12">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              04{" "}
            </strong>
            Sending notifications
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            Again, my aim was to implement a scalable notification sending
            system. So, I decided to make another dedicated service for this.
            Currently image upload service and notification sending system are
            unified as feature-service but they can be separated pretty easily
            when the need arises. The notifications go to the feature-service
            through a queue and that helps to absorb data spikes.
            <br />
            This feature could have been much better by using 2 queues, one for
            urgent notifications and one for low priority ones but I again think
            that this is good to go.
          </p>
          <img src="/sending-notifications.svg" loading="lazy" />
        </div>
        <div className="ml-auto text-right py-4 md:py-6 lg:py-10 xl:py-12">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              05{" "}
            </strong>
            Dark/Light mode
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            This is an easy one, I just used CSS variables and changed their
            values depending on whether there is a 'dark' class in the html tag.
            Then I simply used basic DOM manipulation to toggle this class in
            html tag and saved the theme in local storage.
          </p>
        </div>
        <div className="mr-auto text-left py-4 md:py-6 lg:py-10 xl:py-12">
          <h3 className="text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <strong className="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl opacity-40 mr-2">
              Bonus{" "}
            </strong>
            Fuzzy search
          </h3>
          <p className="my-2 md:my-4 lg:my-6 xl:my-8 text-[12px] md:text-base text-sidebar-foreground">
            While creating the workout even if you type 'Tarbell Tench Press',
            the first result would still be 'Barbell Bench Press'. I did not use
            any machine learning algorithm to do this. Just a tiny bit of
            research and I found that PostgreSQL has an extension pg-trgm which
            solves exactly this problem. It generates triagrams of the two
            strings and then computes a similarity score of between 0 and 1. I
            simply returned 10 results whose similarity score is greater than
            0.3 in descending order.
          </p>
        </div>
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <div className="w-full xl:w-2/3 mx-auto text-center px-8 xl:px-24 my-6 md:my-10 lg:mt-14 xl:my-24 flex flex-col gap-2 md:gap-3 text-[12px] md:text-base">
        <h3 className="text-2xl md:text-3xl xl:text-4xl text-primary font-medium">
          Tech Stack
        </h3>
        <p className="text-sidebar-foreground mt-3 md:mt-4 lg:mt-5 xl:mt-6">
          Built completely in{" "}
          <strong className="text-foreground">Typescript</strong>.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Remix </strong>
          as the full stack framework. Why? Amazing developer experience and
          performance.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Tailwind CSS </strong> and{" "}
          <strong className="text-foreground">Shadcn UI </strong> for styling.
          Why? Easy and quick to use.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Prisma </strong> as ORM. Why? To
          talk to SQL like NoSQL.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">PostgreSQL </strong> as primary
          database. Why? SQL because I don't like the schema flexibility which a
          NoSQL database gives. Moreover, it gives the feature of fuzzy
          searching out of the box.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Redis </strong> as a server-side
          cache. Why? To give users seamless experience while logging the
          workouts.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">RabbitMQ </strong> as the message
          queue. Why? To communicate between the services.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Langchain/Langgraph </strong>.
          Why? To build the RAG agent.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">OpenAI </strong> as the LLM. Why?
          To do the AI analysis on the retrieved data.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Docker </strong> to containerize
          the application.
        </p>
        <p className="text-sidebar-foreground">
          <strong className="text-foreground">Nginx </strong> as a reverse
          proxy.
        </p>
        <p className="text-sidebar-foreground">
          Deployed on an <strong className="text-foreground">AWS EC2 </strong>{" "}
          machine.
        </p>
      </div>
      <hr className="w-1/2 mx-auto border-foreground opacity-30" />
      <section className="px-12 py-6 md:py-8 lg:py-10 xl:py-12">
        <div className="flex flex-col font-extralight items-center text-[12px] md:text-base">
          <h3>Designed and built with ❤️ by</h3>
          <p className="mb-3">Utkarsh Ojha</p>
          <div className="flex mx-auto gap-5">
            <Link to="mailto:utkarsho.dev@gmail.com">
              <img
                src={`${"/gmail-icon-dark.svg"}`}
                alt="Gmail logo"
                width={24}
              />
            </Link>
            <Link to="https://www.linkedin.com/in/utkarsh-ojha-05734426a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
              <img
                src={`${"/logo-linkedin-dark.svg"}`}
                alt="LinkedIn logo"
                width={24}
              />
            </Link>
            <Link to="https://x.com/utkarsh_js?t=jsC7ZwFVajCPfCq4CgicOQ&s=09">
              <img src={`${"/logo-x-dark.svg"}`} alt="X logo" width={24} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
