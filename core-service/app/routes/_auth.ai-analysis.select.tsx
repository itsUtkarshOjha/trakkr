import { getAuth } from "@clerk/remix/ssr.server";
import { User, Workout } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { BrainCircuit } from "lucide-react";
import { useState } from "react";
import HeadingSubheading from "~/components/heading-subheading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getUser } from "~/controllers/user.controller";
import { getAllWorkouts } from "~/controllers/workout.controller";
import { getLatestWorkoutLogId } from "~/controllers/workoutLog.controller";
import analysisAgent from "~/langgraph/analysisAgent";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | AI Analysis" },
    {
      name: "AI Analysis",
      content: "AI analysis of your selected workout.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId: clerkId } = await getAuth(args);
  if (!clerkId) return redirect("/");
  const user = await getUser(clerkId);
  const allWorkouts = await getAllWorkouts(user!.id);
  return { allWorkouts, user };
};

export const action: ActionFunction = async (args) => {
  const { request } = args;
  const { userId: clerkId } = await getAuth(args);
  const user = await getUser(clerkId!);
  const formData = await request.formData();
  const workoutId = formData.get("workoutId") as string;
  const formType = formData.get("formType");
  if (formType === "SHOW_ANALYSIS") {
    const latestLog = await getLatestWorkoutLogId(user!.id, workoutId);
    if (latestLog.analysed) {
      return redirect(`/ai-analysis/${workoutId}`);
    }
    await analysisAgent.invoke({
      userId: user!.id,
      workoutId,
    });
    return redirect(`/ai-analysis/${workoutId}`);
  }
  return null;
};

export default function AIAnalysisSelection() {
  const loaderData: { allWorkouts: Workout[]; user: User } =
    useLoaderData<typeof loader>();
  const [workoutId, setWorkoutId] = useState("");
  const { allWorkouts } = loaderData;
  const fetcher = useFetcher();
  const handleShowAnalysis = () => {
    fetcher.submit(
      {
        formType: "SHOW_ANALYSIS",
        workoutId,
      },
      {
        method: "POST",
      }
    );
  };
  return (
    <div className="w-full h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="">AI Analysis</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="AI Analysis"
        subheading="Select a workout which you have logged and click on 'Analyse'"
      />
      {fetcher.state === "submitting" ? (
        <div className="w-full h-3/4 flex flex-col items-center justify-center">
          <p>Analysing...</p>
        </div>
      ) : (
        <div className="mx-auto w-full h-3/4 flex flex-col items-center justify-center gap-4 md:gap-8 xl:gap-12">
          <Select value={workoutId} onValueChange={setWorkoutId}>
            <SelectTrigger className="w-[250px] md:w-[350px] xl:w-[500px] text-sm md:text-lg rounded-full text-muted-foreground px-3 md:px-8 xl:px-12 py-6 xl:py-8">
              <SelectValue placeholder="Select a workout to analyse" />
            </SelectTrigger>
            <SelectContent className="rounded-xl px-3 border-none">
              <SelectGroup className="space-y-3 py-3 bg-transparent hover:bg-transparent">
                {allWorkouts.map(
                  ({ id, workoutName, WorkoutLog }: Workout) =>
                    WorkoutLog.length > 0 && (
                      <SelectItem
                        className="px-4 py-2 cursor-pointer rounded-xl !bg-transparent !hover:bg-transparent"
                        value={id}
                        key={id}
                      >
                        {workoutName}
                      </SelectItem>
                    )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {workoutId !== "" && (
            <Link
              className="flex items-center gap-3 rounded-full font-semibold px-4 md:px-8 lg:px-16 py-2 sm:py-3 bg-gradient-to-r from-chart-4 text-sm lg:text-base to-accent text-foreground"
              to={"/ai-analysis/123"}
            >
              <BrainCircuit />
              Run Analysis
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
