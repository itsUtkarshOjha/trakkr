import { SignInButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Linkedin, Mail, MoonIcon, MoveDownIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { createUser, findUser } from "~/controllers/user.controller";
import { features } from "~/lib/constants";
import { getClerkUser } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr" },
    {
      name: "An app to track your workouts and fitness goals.",
      content: "Welcome to Trakkr!",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (userId) {
    const clerkUser = await getClerkUser(userId);
    if (clerkUser) {
      const dbUser = await findUser(userId);
      if (!dbUser) {
        await createUser(clerkUser);
      }
    }
    return redirect(`/dashboard`);
  }
  return {};
};

export default function Index() {
  const [appTheme, setAppTheme] = useState<string>("dark");
  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    if (!theme) {
      setAppTheme("dark");
      window.localStorage.setItem("theme", "dark");
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
      }
    } else {
      if (theme === "dark") {
        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
          setAppTheme("dark");
        }
      } else {
        document.documentElement.classList.remove("dark");
        setAppTheme("light");
      }
    }
  }, [appTheme]);
  return (
    <main className="bg-card h-screen w-full">
      <div className="flex flex-col fixed w-full backdrop-blur-lg z-20">
        <div className="text-foreground font-light top-0 text-[8px] md:text-[10px] lg:text-sm mx-auto w-full text-center py-1 bg-transparent px-4">
          This app is fresh out of development. If you encounter any bugs or
          have any suggestions,{" "}
          <Dialog>
            <DialogTrigger className="font-bold underline">
              contact us.
            </DialogTrigger>
            <DialogContent>
              <div className="flex mx-auto gap-5">
                <Link to="mailto:utkarsho.dev@gmail.com">
                  <img
                    src={`${
                      appTheme === "dark"
                        ? "/gmail-icon-dark.svg"
                        : "/gmail-icon.svg"
                    }`}
                    alt="Gmail logo"
                    width={30}
                  />
                </Link>
                <Link to="https://www.linkedin.com/in/utkarsh-ojha-05734426a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
                  <img
                    src={`${
                      appTheme === "dark"
                        ? "/logo-linkedin-dark.svg"
                        : "/logo-linkedin.svg"
                    }`}
                    alt="LinkedIn logo"
                    width={30}
                  />
                </Link>
                <Link to="https://x.com/utkarsh_js?t=jsC7ZwFVajCPfCq4CgicOQ&s=09">
                  <img
                    src={`${
                      appTheme === "dark" ? "/logo-x-dark.svg" : "/logo-x.svg"
                    }`}
                    alt="X logo"
                    width={30}
                  />
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <header className="flex justify-between items-center w-full px-4 md:px-12 py-3 md:py-5 z-10">
          <Link to="/" className="">
            <img
              src={`${
                appTheme === "dark"
                  ? "/logo-icon-dark-01.png"
                  : "/logo-icon-light-01.png"
              }`}
              className="w-10 md:w-14"
              alt="Logo of Trakkr"
            />
          </Link>
          <nav className="text-sm md:text-base flex justify-end gap-4 md:gap-6 items-center">
            <Link to="/engineering" className="underline hover:no-underline">
              Engineering
            </Link>
            <SignInButton>
              <Button className="bg-foreground px-2 md:px-4 py-1 md:py-2 rounded-xl text-background">
                Sign in
              </Button>
            </SignInButton>
            <Button
              variant="ghost"
              className="bg-muted hover:bg-background px-3 md:px-4 rounded-full "
              onClick={() => {
                setAppTheme(appTheme === "dark" ? "light" : "dark");
                window.localStorage.setItem(
                  "theme",
                  appTheme === "dark" ? "light" : "dark"
                );
              }}
            >
              {appTheme === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
          </nav>
        </header>
      </div>
      <section className="bg-gradient-to-b from-card to-muted w-full py-48 md:py-72 flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 px-6">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-center">
            A simple, yet{" "}
            <span className="bg-gradient-to-t from-primary to-accent-foreground text-transparent bg-clip-text">
              powerful{" "}
            </span>{" "}
            workout trakkr.
          </h1>
          <div className="flex flex-col items-center gap-6 md:gap-12">
            <h3 className="font-light text-secondary-foreground text-center text-[12px] md:text-base">
              Effortlessly log your workouts, track progress with AI insights,
              and stay on top of your fitness journey—anytime, anywhere.
            </h3>
            <div className="flex gap-3 items-center">
              <SignInButton>
                <Button className="bg-gradient-to-r text-foreground from-chart-4 to-accent rounded-xl text-sm md:text-md py-2 font-semibold px-4">
                  Start Now
                </Button>
              </SignInButton>
              <Link
                to="/guest/dashboard"
                className="bg-muted hover:bg-primary-foreground px-4 py-2 rounded-xl text-[12px] md:text-base font-light"
              >
                Guest mode
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted px-4 md:px-16 lg:px-32 py-4">
        <MoveDownIcon className="mx-auto opacity-25" />
        <h2 className="uppercase text-lg mt-6 mb-8 md:mb-16 tracking-widest text-center font-semibold opacity-50">
          Features
        </h2>
        <div className="flex flex-col gap-6 items-center">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="bg-gradient-to-tr from-chart-4 to-accent p-[1.5px] rounded-2xl"
            >
              <div className="bg-muted rounded-2xl w-full h-full flex flex-col lg:flex-row justify-between gap-4 md:gap-6 lg:gap-12 items-center px-6 md:px-12 py-4 md:py-6">
                <div className="flex flex-col gap-1 w-3/4 text-center lg:text-left">
                  <span className="text-6xl md:text-[80px] font-black text-sidebar-foreground opacity-55">
                    {feature.number}
                  </span>
                  <p className="font-light text-[12px] md:text-base">
                    {feature.feature}
                  </p>
                </div>
                <div className="bg-secondary w-2 h-full"></div>
                <div>
                  <img src={feature.image} className="w-full rounded-xl"></img>
                </div>
              </div>
            </div>
          ))}

          <SignInButton>
            <Button className="bg-gradient-to-r text-foreground from-chart-4 to-accent rounded-xl text-sm md:text-md py-2 font-semibold px-4">
              Start Now
            </Button>
          </SignInButton>
        </div>
      </section>
      <section className="bg-muted px-12 py-4 md:py-12">
        <div className="flex flex-col font-extralight items-center text-[12px] md:text-base">
          <h3>Designed and built with ❤️ by</h3>
          <p className="mb-3">Utkarsh Ojha</p>
          <div className="flex mx-auto gap-5">
            <Link to="mailto:utkarsho.dev@gmail.com">
              <img
                src={`${
                  appTheme === "dark"
                    ? "/gmail-icon-dark.svg"
                    : "/gmail-icon.svg"
                }`}
                alt="Gmail logo"
                width={24}
              />
            </Link>
            <Link to="https://www.linkedin.com/in/utkarsh-ojha-05734426a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
              <img
                src={`${
                  appTheme === "dark"
                    ? "/logo-linkedin-dark.svg"
                    : "/logo-linkedin.svg"
                }`}
                alt="LinkedIn logo"
                width={24}
              />
            </Link>
            <Link to="https://x.com/utkarsh_js?t=jsC7ZwFVajCPfCq4CgicOQ&s=09">
              <img
                src={`${
                  appTheme === "dark" ? "/logo-x-dark.svg" : "/logo-x.svg"
                }`}
                alt="X logo"
                width={24}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

///sdfas
