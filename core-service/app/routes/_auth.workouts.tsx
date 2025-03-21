import { getAuth } from "@clerk/remix/ssr.server";
import { Days, Exercise, User } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { Calendar, ExternalLink, PlusCircle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { DialogAddToCalendar } from "~/components/add-to-calendar-dialog";
import HeadingSubheading from "~/components/heading-subheading";
import PaginationComponent from "~/components/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { getAllExercises } from "~/controllers/exercise.controller";
import { getUser } from "~/controllers/user.controller";
import {
  addExerciseToOldWorkout,
  deleteExerciseFromWorkout,
  getAllWorkouts,
} from "~/controllers/workout.controller";
import {
  getCurrentWorkoutLog,
  getUpcomingWorkouts,
  getWorkoutLogs,
  setScheduledAt,
  startWorkoutLog,
} from "~/controllers/workoutLog.controller";
import { useToast } from "~/hooks/use-toast";
import { InputError, InvalidActionError } from "~/lib/Error";
import {
  CurrentWorkout,
  WorkoutLogShort,
  WorkoutsWithExercises,
} from "~/lib/interfaces";
import { SuccessToast } from "~/lib/SuccessToast";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Your Workouts" },
    {
      name: "Your workouts",
      content: "See your workouts, log your workout and see upcoming workouts.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const user = await getUser(userId);
  const workouts = await getAllWorkouts(user!.id);
  const currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(user!.id);
  const url = new URL(args.request.url);
  const queryLogPage = url.searchParams.get("logPage") || 1;
  const skip = (Number(queryLogPage) - 1) * 10;
  const { workoutLogs, logCount } = await getWorkoutLogs(user!.id, skip);
  const upcomingWorkouts = await getUpcomingWorkouts(user!.id);
  return {
    user,
    workouts,
    currentWorkout,
    workoutLogs,
    logCount,
    upcomingWorkouts,
  };
};

export const action: ActionFunction = async (args) => {
  const { request } = args;
  const formData = await request.formData();
  const { userId: clerkId } = await getAuth(args);
  const user = await getUser(clerkId!);

  const userId = user!.id;

  if (formData.get("formType") === "START_WORKOUT") {
    await startWorkoutLog(formData.get("workoutId") as string, userId);
    return redirect(`/workout-log/active/${formData.get("workoutId")}`);
  }
  if (formData.get("formType") === "SCHEDULE_WORKOUT") {
    const days: string = formData.get("selectedDays") as string;
    const daysArray: Days[] = days.split(",") as Days[];
    const updatedWorkout = await setScheduledAt(
      userId,
      formData.get("workoutId") as string,
      daysArray
    );
    return { message: "Workout schedule updated successfully." };
  }
  if (formData.get("formType") === "DELETE_EXERCISE") {
    const workoutId = formData.get("workoutId") as string;
    const exerciseId = formData.get("exerciseId") as string;
    const updatedWorkout = await deleteExerciseFromWorkout(
      workoutId,
      exerciseId,
      userId
    );
    return { message: "Exercise deleted successfully." };
  }
  if (formData.get("formType") === "GET_SUGGESTED_EXERCISES") {
    const exerciseQuery = formData.get("exerciseQuery") as string;
    const allExercises = await getAllExercises(exerciseQuery);
    return { exercises: allExercises, message: "" };
  }
  if (formData.get("formType") === "ADD_EXERCISE") {
    const exerciseName = formData.get("exerciseName") as string;
    const workoutId = formData.get("workoutId") as string;
    await addExerciseToOldWorkout(workoutId, exerciseName, user!.id);
    return { message: "Exercise added successfully." };
  }
  return null;
};

export default function Workouts() {
  const loaderData: {
    user: User;
    workouts: WorkoutsWithExercises[];
    currentWorkout: CurrentWorkout;
    workoutLogs: WorkoutLogShort[];
    logCount: number;
    upcomingWorkouts: { workoutName: string; daysFromNow: number }[];
  } = useLoaderData<typeof loader>();
  const [addingExercise, setAddingExercise] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const user: User = loaderData.user;
  const workouts: WorkoutsWithExercises[] = loaderData.workouts;
  console.log(workouts);
  const currentWorkout: CurrentWorkout = loaderData.currentWorkout;
  const workoutLogs: WorkoutLogShort[] = loaderData.workoutLogs;
  const logCount: number = loaderData.logCount;
  const upcomingWorkouts = loaderData.upcomingWorkouts;
  const totalPages = Math.ceil(logCount / 10);
  const fetcher = useFetcher();
  const allExercises: Exercise[] =
    fetcher.data && fetcher.data.exercises
      ? (fetcher.data.exercises as Exercise[])
      : [];
  const suggestedNames: string[] = [];
  const { toast } = useToast();
  const message: string = fetcher.data ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }
  if (allExercises.length > 0)
    for (const exercise of allExercises) {
      suggestedNames.push(exercise.name);
    }
  const handleStartWorkout = (workoutId: string) => {
    fetcher.submit(
      {
        formType: "START_WORKOUT",
        workoutId,
        userId: user!.id,
        clerkId: user.clerkId,
      },
      {
        method: "POST",
      }
    );
  };
  const handleDeleteExercise = (
    workoutId: string,
    exerciseId: string,
    exercises: Exercise[]
  ) => {
    if (exercises.length === 1) {
      new InvalidActionError(
        "There must be atleast 1 exercise in a workout.",
        toast
      );
      return;
    }
    fetcher.submit(
      {
        formType: "DELETE_EXERCISE",
        workoutId,
        exerciseId,
      },
      {
        method: "DELETE",
      }
    );
  };
  const handleGetSuggestedExercises = (exerciseName: string) => {
    setExerciseName(exerciseName);
    if (exerciseName.length > 2) {
      setIsPopoverOpen(true);
      fetcher.submit(
        {
          exerciseQuery: exerciseName,
          formType: "GET_SUGGESTED_EXERCISES",
        },
        {
          method: "POST",
        }
      );
    }
  };
  const handleAddExercise = (workoutId: string) => {
    if (suggestedNames.includes(exerciseName)) {
      fetcher.submit(
        {
          formType: "ADD_EXERCISE",
          workoutId,
          exerciseName,
        },
        {
          method: "POST",
        }
      );
      setExerciseName("");
      setAddingExercise(false);
    } else {
      new InputError(
        "No such exercise found. Please select one from the dropdown.",
        toast
      );
    }
  };
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workouts">Workouts</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="Your workouts"
        subheading="One place to see all your workouts, add them to your calendar and log
          them!"
      />
      <h2 className="mt-12 lg:text-xl font-medium">Created Workouts</h2>
      {workouts.length === 0 && (
        <div className="mt-4 bg-primary-foreground rounded-xl w-full h-[200px] flex flex-col items-center justify-center">
          <p className="text-muted-foreground">
            You have not created any workout yet!
          </p>
        </div>
      )}
      <Accordion
        type="single"
        collapsible
        className="w-full bg-primary-foreground rounded-xl px-4 lg:px-12 mt-4"
      >
        {workouts &&
          workouts.length > 0 &&
          workouts.map((workout: WorkoutsWithExercises) => (
            <AccordionItem
              value={workout.workoutName}
              key={workout.id}
              className=" py-3"
            >
              <div className="grid grid-cols-5 grid-rows-2 sm:grid-rows-1 sm:grid-cols-7 items-center">
                <div className="col-span-5 sm:col-span-3 xl:col-span-4">
                  <AccordionTrigger className="">
                    <p className="text-sm lg:text-base font-semibold">
                      {workout.workoutName}
                    </p>
                  </AccordionTrigger>
                </div>
                <Button
                  className="rounded-full text-[12px] bg-gradient-to-r from-chart-3 to-primary md:text-base px-3 row-start-2 col-span-3 sm:col-span-2 sm:row-start-1 sm:col-start-5 md:w-full xl:w-2/3 sm:w-2/3 sm:ml-auto"
                  onClick={() => handleStartWorkout(workout.id)}
                  disabled={currentWorkout.workoutId ? true : false}
                >
                  {currentWorkout && currentWorkout.workoutId === workout.id
                    ? "Ongoing"
                    : "Start Logging"}
                </Button>
                <div className="ml-auto sm:col-span-1 sm:-col-start-1">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="secondary" className="rounded-full">
                        <Calendar />
                      </Button>
                    </DialogTrigger>
                    <DialogAddToCalendar workout={workout} />
                  </Dialog>
                </div>
              </div>
              <div className="">
                <AccordionContent className="py-4 flex flex-col gap-4 lg:w-1/2">
                  {workout.exercises.map((exercise: Exercise) => (
                    <div
                      key={exercise.id}
                      className="flex lg:gap-8 items-center justify-between"
                    >
                      <p className="text-sm col-span-3">{exercise.name}</p>
                      <div className="col-span-2 flex justify-between gap-2">
                        {exercise.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="rounded-full sm:text-[10px] text-[8px] hidden sm:block bg-chart-3"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        className="rounded-full hover:bg-destructive"
                        onClick={() =>
                          handleDeleteExercise(
                            workout.id,
                            exercise.id,
                            workout.exercises
                          )
                        }
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  {addingExercise && (
                    <div className="relative flex lg:w-4/5 px-2 py-1 mt-2 border-[1px] border-primary rounded-xl shadow-sm">
                      <Popover
                        open={isPopoverOpen}
                        onOpenChange={setIsPopoverOpen}
                      >
                        <PopoverTrigger className="absolute left-36 lg:left-48 top-12"></PopoverTrigger>
                        <Input
                          name="exerciseName"
                          placeholder="Exercise Name"
                          value={exerciseName}
                          required
                          onChange={(e) =>
                            handleGetSuggestedExercises(e.target.value)
                          }
                          className="border-none placeholder:text-sm focus-visible:text-sm !text-sm focus-visible:ring-0 drop-shadow-none shadow-none placeholder:opacity-40"
                        />
                        {allExercises.length > 0 && (
                          <PopoverContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            className="w-full min-w-80 p-0"
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {allExercises.length > 0 &&
                                    allExercises.map((exercise: Exercise) => (
                                      <CommandItem
                                        className="cursor-pointer hover:bg-background px-8 py-3"
                                        key={exercise.id}
                                        onSelect={() => {
                                          setExerciseName(exercise.name);
                                          setIsPopoverOpen(false);
                                        }}
                                      >
                                        {exercise.name}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        )}
                      </Popover>

                      <Button
                        name="addExercise"
                        variant="secondary"
                        className="rounded-full px-4 py-1 bg-success shadow-md"
                        onClick={() => handleAddExercise(workout.id)}
                      >
                        <PlusCircle className="text-background scale-110" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full hover:bg-transparent"
                        onClick={() => setAddingExercise(false)}
                      >
                        <X />
                      </Button>
                    </div>
                  )}
                  {!addingExercise && (
                    <Button
                      className="w-28 rounded-full hover:bg-muted bg-primary-foreground"
                      variant="outline"
                      onClick={() => setAddingExercise(true)}
                    >
                      <PlusCircle /> Add
                    </Button>
                  )}
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
      </Accordion>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <h2 className="lg:text-xl font-medium">Logged Workouts</h2>
          <div className="mt-6 flex flex-col bg-primary-foreground rounded-xl h-[400px] overflow-y-scroll">
            {workoutLogs.length === 0 && (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <p className="text-muted-foreground">
                  You haven&apos;t logged any workout yet!
                </p>
              </div>
            )}
            {workoutLogs.map((log) => (
              <>
                <Link
                  key={log.id}
                  className="py-6 px-3 sm:px-5 lg:px-8 flex justify-between hover:bg-background cursor-pointer transition-all duration-200"
                  to={`/analysis?log=${log.id}`}
                >
                  <div className="hover:underline text-sm lg:text-base flex gap-1 lg:gap-3">
                    {log.workout.workoutName}
                    <ExternalLink size={16} />
                  </div>
                  <p className="text-sm lg:text-base">
                    {log.createdAt.toDateString()}
                  </p>
                </Link>
                {/* <hr className="w-1/2 mx-auto" /> */}
              </>
            ))}
            {workoutLogs.length > 0 && (
              <PaginationComponent totalPages={totalPages} />
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="lg:text-xl font-medium">Upcoming Workouts</h2>
          <div className="h-[400px] mt-6 overflow-y-scroll bg-primary-foreground w-full rounded-xl">
            {upcomingWorkouts.length === 0 && (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <p className="text-muted-foreground">
                  You don&apos;t have any upcoming workouts.
                </p>
              </div>
            )}
            {upcomingWorkouts.map((upcomingWorkout) => (
              <div
                key={upcomingWorkout.daysFromNow}
                className="flex items-center justify-between px-3 sm:px-5 lg:px-6 xl:px-8 py-6"
              >
                <h3 className="text-sm lg:text-base">
                  {upcomingWorkout.workoutName}
                </h3>
                {upcomingWorkout.daysFromNow >= 2 && (
                  <p className="text-sm">
                    In {upcomingWorkout.daysFromNow} days
                  </p>
                )}
                {upcomingWorkout.daysFromNow === 1 && (
                  <p className="text-sm">Tomorrow</p>
                )}
                {upcomingWorkout.daysFromNow === 0 && (
                  <p className="text-sm">Today</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
