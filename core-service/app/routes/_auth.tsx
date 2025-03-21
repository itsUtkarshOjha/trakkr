import {
  Link,
  Outlet,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
  Scripts,
  Meta,
  Links,
} from "@remix-run/react";
import AppSidebar from "~/components/app-sidebar";
import tailwindStyles from "~/tailwind.css";

import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getUser } from "~/controllers/user.controller";
import { getCurrentWorkoutLog } from "~/controllers/workoutLog.controller";
import { useState } from "react";
import { fitnessFacts } from "~/lib/constants";
// import { sendNotification } from "rabbitmq/sendNotification";

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" className="dark">
      <head>
        <Meta />
        <title>Something Went Wrong</title>
        <Links />
      </head>
      <body
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827", // Dark: gray-900, Light: gray-100
          color: "#e5e7eb", // Dark: gray-100, Light: gray-900
          padding: "0",
        }}
      >
        <div
          style={{
            maxWidth: "32rem", // max-w-lg
            width: "100%",
            background: "#1f2937", // Dark: gray-800, Light: white
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3.75rem" }}>⚠️</div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "600",
              marginTop: "1rem",
            }}
          >
            Oops! Something went wrong!
          </h1>
          <p
            style={{
              color: "#d1d5db", // Dark: gray-300, Light: gray-600
              marginTop: "0.5rem",
            }}
          >
            We're sorry for the inconvenience. Please refresh the page or try
            again later.
          </p>
          <a
            href="/"
            style={{
              marginTop: "1.5rem",
              display: "inline-block",
              background: "#0ea5e9", // Dark: cyan-500, Light: blue-600
              color: "white",
              fontWeight: "500",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              transition: "background 0.3s",
              textDecoration: "none",
            }}
          >
            Go Back
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const user = await getUser(userId);
  if (!user) return redirect("/");
  const currentWorkout = await getCurrentWorkoutLog(user.id);
  if (currentWorkout) return { currentWorkout };
  return {};
};

export default function App() {
  const { currentWorkout } = useLoaderData<typeof loader>();
  const { workoutId } = useParams();
  const [appTheme, setAppTheme] = useState("dark");
  const handleThemeChange = (theme: string) => {
    setAppTheme(theme);
  };
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <>
        <AppSidebar appTheme={appTheme} handleThemeChange={handleThemeChange} />
        <div className="h-screen w-full flex flex-col gap-5 items-center justify-center bg-background">
          <img
            src={
              appTheme === "dark"
                ? "/logo-icon-dark-01.png"
                : "/logo-icon-light-01.png"
            }
            className="w-24 animate-pulse-scale"
          />
          <p className="text-sm opacity-50">
            {fitnessFacts.at(Math.floor(Math.random() * 10))}
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      {!workoutId && currentWorkout && (
        <div className="bg-primary text-center text-sm text-background z-50 w-full fixed py-1">
          You have an{" "}
          <Link
            to={`/workout-log/active/${currentWorkout.workoutId}`}
            className="underline"
          >
            ongoing workout
          </Link>
        </div>
      )}
      <AppSidebar appTheme={appTheme} handleThemeChange={handleThemeChange} />
      <main className="w-full flex flex-col items-center py-12 px-4 sm:px-8 bg-background">
        <Outlet />
      </main>
    </>
  );
}
