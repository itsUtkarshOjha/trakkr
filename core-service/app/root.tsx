import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import { rootAuthLoader } from "@clerk/remix/ssr.server";

import "./tailwind.css";
import { ClerkApp } from "@clerk/remix";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toaster";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  },
];

export async function loader(args: LoaderFunctionArgs) {
  return rootAuthLoader(args, async ({ request }) => {
    const { userId } = request.auth;
    return { userId };
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

function App() {
  return (
    <SidebarProvider className="">
      <Outlet />
    </SidebarProvider>
  );
}

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

export default ClerkApp(App);
