import { Link, NavLink } from "@remix-run/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { workouts, sections, smartFeatures, weight } from "~/lib/constants";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { SignedOut, SignInButton } from "@clerk/remix";

const extraClasses = "flex gap-3 items-center pl-5 py-3 rounded-xl ";

type Props = {
  appTheme: string;
  handleThemeChange: (theme: string) => void;
};

export default function GuestSidebar({ appTheme, handleThemeChange }: Props) {
  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    if (!theme) {
      handleThemeChange("dark");
      window.localStorage.setItem("theme", "dark");
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
      }
    } else {
      if (theme === "dark") {
        if (!document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.add("dark");
          handleThemeChange("dark");
        }
      } else {
        document.documentElement.classList.remove("dark");
        handleThemeChange("light");
      }
    }
  }, [appTheme]);
  return (
    <>
      <SidebarTrigger className="fixed top-6 left-2 z-100" />
      <Sidebar className="z-30">
        <SidebarHeader className="m-4 mt-16 flex flex-col items-center">
          <Link to="/">
            <img
              src={`${
                appTheme === "dark"
                  ? "/logo-icon-dark-01.png"
                  : "/logo-icon-light-01.png"
              }`}
              className="w-24"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent className="">
          <SidebarMenu className="mt-3">
            {sections.map((item) => (
              <SidebarMenuItem className="my-1 mx-1" key={item.title}>
                <NavLink
                  to={"/guest" + item.link}
                  className={({ isActive }) => {
                    return isActive
                      ? `${extraClasses} bg-gradient-to-r from-chart-3 to-primary text-primary-foreground flex gap-2`
                      : `${extraClasses} hover:bg-secondary`;
                  }}
                >
                  <item.icon size={20} />
                  {item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarGroup className="">
            <SidebarGroupLabel>Workouts</SidebarGroupLabel>
            {workouts.map((workout) => (
              <SidebarGroupContent key={workout.link} className="my-1 mx-1">
                <NavLink
                  to={"/guest" + workout.link}
                  className={({ isActive }) =>
                    isActive
                      ? `${extraClasses} bg-gradient-to-r from-chart-3 to-primary text-primary-foreground flex gap-2`
                      : `${extraClasses} hover:bg-secondary`
                  }
                >
                  {<workout.icon />}
                  {workout.title}
                </NavLink>
              </SidebarGroupContent>
            ))}
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>Weight Management</SidebarGroupLabel>
            {weight.map((weight) => (
              <SidebarGroupContent key={weight.link} className="my-1 mx-1">
                <NavLink
                  to={"/guest" + weight.link}
                  className={({ isActive }) =>
                    isActive
                      ? `${extraClasses} bg-gradient-to-r from-chart-3 to-primary text-primary-foreground flex gap-2`
                      : `${extraClasses} hover:bg-secondary`
                  }
                >
                  {<weight.icon />}
                  {weight.title}
                </NavLink>
              </SidebarGroupContent>
            ))}
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>AI Trainer</SidebarGroupLabel>
            {smartFeatures.map((feature) => (
              <SidebarGroupContent key={feature.link} className="my-1 mx-1">
                <NavLink
                  to={"/guest" + feature.link}
                  className={({ isActive }) =>
                    isActive
                      ? `${extraClasses} bg-gradient-to-r from-chart-4 to-accent text-foreground flex gap-2`
                      : `${extraClasses} hover:bg-secondary`
                  }
                >
                  {<feature.icon />}
                  {feature.title}
                </NavLink>
              </SidebarGroupContent>
            ))}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="my-4 flex flex-col items-start justify-between gap-6 mx-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/">Home</Link>
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </div>
          <Button
            variant="ghost"
            className="bg-muted hover:bg-background px-4 rounded-full "
            onClick={() => {
              handleThemeChange(appTheme === "dark" ? "light" : "dark");
              window.localStorage.setItem(
                "theme",
                appTheme === "dark" ? "light" : "dark"
              );
            }}
          >
            {appTheme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
