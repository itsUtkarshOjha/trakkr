import { UserButton } from "@clerk/remix";
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
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const extraClasses = "flex gap-3 items-center pl-5 py-3 rounded-xl ";

type Props = {
  appTheme: string;
  handleThemeChange: (theme: string) => void;
};

export default function App({ appTheme, handleThemeChange }: Props) {
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
      <SidebarTrigger className="fixed top-6 left-2 z-50" />
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
                  to={item.link}
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
                  to={workout.link}
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
                  to={weight.link}
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
                  to={feature.link}
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
        <SidebarFooter className="my-4 flex flex-col items-start justify-between gap-4 mx-4">
          <div className="flex items-center justify-start text-sm gap-2">
            <p className="">Queries? Bugs?</p>
            <Dialog>
              <DialogTrigger className="font-bold underline">
                Contact Us
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
          <div className="flex justify-start gap-3 items-center">
            <Button
              variant="ghost"
              className="bg-muted hover:bg-background px-3 rounded-full "
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
            <div className="flex items-center justify-between gap-3">
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: { pointerEvents: "initial" },
                  },
                }}
                afterSignOutUrl="/"
              />
              <p>Your account</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
