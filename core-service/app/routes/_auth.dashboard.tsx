import { getAuth } from "@clerk/remix/ssr.server";
import { User, Weight } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ExternalLink, InfoIcon } from "lucide-react";
import HeadingSubheading from "~/components/heading-subheading";
import OneRepMaxChart from "~/components/one-rep-max";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import WeightChart from "~/components/weight-chart";
import {
  getExercisesWithOneRepMaxes,
  getMaxOneRepMax,
  getNumberOfSets,
} from "~/controllers/exerciseLog.controller";
import { getUser } from "~/controllers/user.controller";
import { getWeights } from "~/controllers/weight.controller";
import { getWorkoutLogs } from "~/controllers/workoutLog.controller";
import { ExerciseWithOneRepMax, WorkoutLogShort } from "~/lib/interfaces";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Dashboard" },
    {
      name: "Dashboard",
      content: "One rep max chart and body weight progression.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const user = await getUser(userId);
  const exercisesWithOneRepMaxes: ExerciseWithOneRepMax[] =
    await getExercisesWithOneRepMaxes(user!.id);
  const { workoutLogs } = await getWorkoutLogs(user!.id);
  const { weights } = await getWeights(user!.id);
  const maxOneRepMax = await getMaxOneRepMax(user!.id);
  const numberOfSets = await getNumberOfSets(user!.id);
  return {
    user,
    exercisesWithOneRepMaxes,
    workoutLogs,
    weights,
    maxOneRepMax,
    numberOfSets,
  };
};

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  const user: User = loaderData.user;
  const weights: Weight[] = loaderData.weights;
  const exercisesWithOneRepMaxes: ExerciseWithOneRepMax[] =
    loaderData.exercisesWithOneRepMaxes;
  const workoutLogs: WorkoutLogShort[] = loaderData.workoutLogs;
  const {
    maxOneRepMax,
    exerciseName,
  }: { exerciseName: string; maxOneRepMax: number } = loaderData.maxOneRepMax;
  const numberOfSets: number = loaderData.numberOfSets;
  return (
    <div className="w-full">
      <HeadingSubheading heading={`Hello ${user.firstName} !`} />
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <div className="flex items-center mb-4 gap-2">
            <h2 className="sm:text-lg lg:text-xl">Your progress</h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon
                  size={16}
                  className="cursor-pointer hover:stroke-muted-foreground"
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="">
                  <div className="space-y-1">
                    <p className="text-sm">
                      The progress is shown on the basis of estimated one rep
                      max for the exercise and it might be inaccurate.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="h-[350px] lg:h-[450px] rounded-xl bg-primary-foreground">
            {/* WIP:: Fetch data and display a chart */}
            {exercisesWithOneRepMaxes.length > 0 ? (
              <OneRepMaxChart
                exercisesWithOneRepMaxes={exercisesWithOneRepMaxes}
              />
            ) : (
              <div className="h-[250px] text-sm lg:h-[450px] flex flex-col items-center justify-center">
                You haven&apos;t done any exercise yet!
              </div>
            )}
          </div>
        </div>
        <div className="xl:col-span-2">
          <h2 className="sm:text-lg lg:text-xl mb-4">Past workouts</h2>
          <div className="bg-primary-foreground h-[250px] lg:min-h-[450px] lg:max-h-[450px] rounded-xl overflow-y-scroll">
            {workoutLogs.length > 0 ? (
              <div className="flex flex-col gap-2">
                {workoutLogs.map((log) => (
                  <Link
                    key={log.id}
                    to={`/analysis?log=${log.id}`}
                    className="flex justify-between items-center px-3 sm:px-5 2xl:px-8 py-3 md:py-4 lg:py-6 hover:underline cursor-pointer hover:bg-background"
                  >
                    <div>
                      <h2 className="flex gap-2">
                        {log.workout.workoutName} <ExternalLink size={14} />
                      </h2>
                    </div>
                    <p className="text-sm font-light">
                      {log.createdAt.toDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-[250px] lg:h-[450px] text-sm flex flex-col items-center justify-center">
                You haven&apos;t logged any workout yet!
              </div>
            )}
          </div>
        </div>
        <hr className="xl:col-span-5 mt-6 opacity-50" />
        <div className="xl:col-span-2">
          <div className="flex flex-col gap-6">
            <div className="h-[200px]">
              <h2 className="sm:text-lg lg:text-xl mb-4">
                Highest One Rep Max
              </h2>
              <div className="h-3/4 bg-primary-foreground rounded-xl flex flex-col gap-3 items-center justify-center">
                <p className="text-4xl lg:text-6xl font-black tracking-wider text-muted-foreground">
                  {maxOneRepMax.toFixed(2)}
                  <span className="text-xl tracking-normal font-normal text-muted-foreground ml-1">
                    kgs
                  </span>
                </p>
                {exerciseName.length > 0 && (
                  <p className="text-sm font-light">in {exerciseName}</p>
                )}
              </div>
            </div>
            <hr className="border-primary-foreground" />
            <div className="h-[200px]">
              <h2 className="sm:text-lg lg:text-xl mb-4">Total Sets Logged</h2>
              <div className="h-3/4 bg-primary-foreground rounded-xl flex flex-col gap-3 items-center justify-center">
                <p className="text-5xl lg:text-6xl font-black tracking-wider text-muted-foreground">
                  {numberOfSets}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 h-full">
          <div className="h-auto">
            <h2 className="sm:text-lg lg:text-xl mb-4">
              Bodyweight Progression
            </h2>
            {weights.length > 0 ? (
              <WeightChart
                weightLogs={weights}
                targetWeight={user.targetWeight}
              />
            ) : (
              <div className="h-[250px] lg:h-[450px] bg-primary-foreground rounded-xl flex flex-col items-center justify-center">
                You haven&apos;t logged your weight yet!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
