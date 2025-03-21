import { getAuth } from "@clerk/remix/ssr.server";
import { Exercise, User } from "@prisma/client";
import { AccordionItem } from "@radix-ui/react-accordion";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { Check, Pause, Play, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import HeadingSubheading from "~/components/heading-subheading";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { getUser } from "~/controllers/user.controller";
import { getAllExercises } from "~/controllers/workout.controller";
import {
  addSetsAndReps,
  deleteSet,
  deleteWorkoutLog,
  finishWorkout,
  getCurrentWorkoutLog,
  pauseWorkoutLog,
  resumeWorkoutLog,
} from "~/controllers/workoutLog.controller";
import { useToast } from "~/hooks/use-toast";
import { InputError, InvalidActionError } from "~/lib/Error";
import { CurrentWorkout } from "~/lib/interfaces";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Ongoing Workout" },
    {
      name: "Ongoing Workout",
      content: "Log your sets and get an analysis later on.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  const user = await getUser(userId!);
  const currentWorkout = await getCurrentWorkoutLog(user!.id);
  if (!currentWorkout.workoutId) {
    return redirect("/workouts");
  }
  const allExercises = await getAllExercises(currentWorkout.workoutId);
  return { user, currentWorkout, allExercises };
};

export const action: ActionFunction = async (args) => {
  const { request } = args;
  const { userId: clerkId } = await getAuth(args);
  const user = await getUser(clerkId!);
  const formData = await request.formData();
  let inputError = "";
  let invalidAction = "";
  const formType = formData.get("formType");
  const currentWorkout = await getCurrentWorkoutLog(user!.id);
  if (formType === "PAUSE_WORKOUT") {
    if (currentWorkout.pausedAt) {
      invalidAction = "Workout already paused.";
      return { invalidAction };
    }
    const pausedWorkout = await pauseWorkoutLog(user!.id);
    return pausedWorkout;
  }
  if (formType === "SUBMIT_REPS_WEIGHTS") {
    if (currentWorkout.pausedAt) {
      invalidAction = "Workout is currently paused.";
      return { invalidAction };
    }
    const reps = formData.get("reps") as string;
    const weights = formData.get("weights") as string;
    if (!reps) {
      inputError = "Reps not provided.";
      return { inputError };
    }
    if (!weights) {
      inputError = "Weight not provided.";
      return { inputError };
    }
    if (Number(reps) < 1) {
      inputError = "Reps can't be less than 1.";
      return { inputError };
    }
    if (Number(weights) < 0) {
      inputError = "Weight can't be less than 0.";
      return { inputError };
    }
    const { updatedCurrentWorkout, exerciseLog } = await addSetsAndReps(
      user!.id,
      formData.get("exerciseId") as string,
      parseInt(formData.get("reps") as string),
      parseFloat(formData.get("weights") as string)
    );
    return { updatedCurrentWorkout, exerciseLog };
  }
  if (formType === "RESUME_WORKOUT") {
    if (!currentWorkout.pausedAt) {
      invalidAction = "Workout is already running.";
      return { invalidAction };
    }
    const resumedWorkout = await resumeWorkoutLog(user!.id);
    return resumedWorkout;
  }
  if (formType === "FINISH_WORKOUT") {
    const currentWorkout: CurrentWorkout = await getCurrentWorkoutLog(user!.id);
    if (!currentWorkout.workoutLogId) {
      return null;
    }
    await finishWorkout(user!.id);
    //TODO: Redirect to a congrats page and show basic analysis
    return redirect("/workouts");
  }
  if (formType === "DISCARD_WORKOUTLOG") {
    await deleteWorkoutLog(user!.id);
    return redirect("/workouts");
  }
  if (formType === "DELETE_SET") {
    const setId = formData.get("setId") as string;
    console.log(setId);
    await deleteSet(user!.id, setId);
  }
  return null;
};

export default function WorkoutSchedule() {
  const { workoutId } = useParams();
  const loaderData: {
    user: User;
    currentWorkout: CurrentWorkout;
    allExercises: Exercise[];
  } = useLoaderData<typeof loader>();
  const { user, currentWorkout, allExercises } = loaderData;
  const [reps, setReps] = useState("");
  const [weights, setWeights] = useState("");
  const { toast } = useToast();
  const fetcher = useFetcher();
  if (fetcher.data?.inputError?.length > 0) {
    new InputError(fetcher.data.inputError, toast);
    fetcher.data.inputError = "";
  }
  const savedExercises = currentWorkout.exercise;
  const numberOfSets = (exerciseId: string): number => {
    const targetExercise = savedExercises.filter(
      (exercise) => exercise.exerciseId === exerciseId
    );
    if (targetExercise.length === 0) return 0;
    return targetExercise[0].details.length;
  };
  const [time, setTime] = useState(() =>
    Math.trunc(
      (Date.now() -
        currentWorkout.startTime -
        (currentWorkout.pauseTime || 0) -
        (currentWorkout.pausedAt ? Date.now() - currentWorkout.pausedAt : 0)) /
        1000
    )
  );
  const [timerRunning, setTimerRunning] = useState(() =>
    currentWorkout.pausedAt ? false : true
  );
  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);
  let totalNumberOfSets = 0;
  let totalNumberOfReps = 0;
  for (const exercise of currentWorkout.exercise) {
    totalNumberOfSets += exercise.details.length;
    for (const set of exercise.details) {
      totalNumberOfReps += set.reps;
    }
  }
  const getAllSetDetails = (exerciseId: string) => {
    const targetExercise = savedExercises.filter(
      (exercise) => exercise.exerciseId === exerciseId
    );
    if (targetExercise.length === 0) return [];
    return targetExercise[0].details;
  };

  const handlePauseWorkout = (userId: string) => {
    fetcher.submit({ userId, formType: "PAUSE_WORKOUT" }, { method: "POST" });
    setTimerRunning(false);
  };
  const handleResumeWorkout = (userId: string) => {
    fetcher.submit({ userId, formType: "RESUME_WORKOUT" }, { method: "POST" });
    setTimerRunning(true);
  };
  const handleFinishWorkout = (userId: string) => {
    fetcher.submit({ userId, formType: "FINISH_WORKOUT" }, { method: "POST" });
  };
  const handleSetRepsWeights = (
    userId: string,
    reps: number | undefined,
    weights: number | undefined,
    exerciseId: string
  ) => {
    if (currentWorkout.pausedAt) return;
    if (!reps) {
      new InputError("Reps not provided", toast);
      return;
    }
    if (!weights) {
      new InputError("Weight not provided", toast);
      return;
    }
    if (reps < 1) {
      new InputError("Reps can't be less than 1", toast);
      return;
    }
    if (weights < 1) {
      new InputError("Weight can't be less than 1", toast);
      return;
    }
    fetcher.submit(
      {
        userId,
        reps,
        weights,
        exerciseId,
        formType: "SUBMIT_REPS_WEIGHTS",
      },
      { method: "POST" }
    );

    setReps("");
    setWeights("");
  };
  const handleDiscardWorkoutLog = () => {
    fetcher.submit(
      {
        formType: "DISCARD_WORKOUTLOG",
      },
      {
        method: "DELETE",
      }
    );
  };
  const handleDeleteSet = (setId: string) => {
    fetcher.submit(
      {
        formType: "DELETE_SET",
        setId,
      },
      {
        method: "DELETE",
      }
    );
  };
  return (
    <>
      <div className="w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/workouts">Workouts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/workout-log/${workoutId}`}>
                Ongoing workout
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end">
            <HeadingSubheading
              heading="Good going champ!"
              subheading="Don't stop when you are tired, stop when you are done!"
            />
            <div className="flex items-center text-sm lg:text-lg gap-4">
              <div className="flex items-center gap-1">
                <p className="w-6 text-center">
                  {"0"}
                  {Math.floor(time / (60 * 60))}{" "}
                </p>
                <p className="w-2 text-center">: </p>
                <p className="w-6 text-center">
                  {Math.floor(time / 60) < 10
                    ? `0${Math.floor(time / 60)}`
                    : Math.floor(time / 60)}{" "}
                </p>
                <p className="w-2 text-center">: </p>
                <p className="w-6 text-center">
                  {Math.floor(time % 60) < 10
                    ? `0${Math.floor(time % 60)}`
                    : Math.floor(time % 60)}
                </p>
              </div>
              {currentWorkout.pausedAt ? (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleResumeWorkout(user.id)}
                >
                  <Play />
                  Resume
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handlePauseWorkout(user.id)}
                >
                  <Pause />
                  Pause
                </Button>
              )}
              {currentWorkout.exercise.length > 0 && (
                <Dialog>
                  <DialogTrigger>
                    <Button
                      className="rounded-full"
                      disabled={currentWorkout.exercise.length === 0}
                    >
                      <Check />
                      Finish
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="text-lg font-semibold">
                      Are you sure you want to finish?
                    </DialogHeader>
                    <p className="font-light">
                      You won&apos;t be able to edit the workout log once you
                      finish it.
                    </p>
                    <DialogFooter>
                      <Button
                        className="rounded-full"
                        onClick={() => handleFinishWorkout(user.id)}
                        disabled={currentWorkout.exercise.length === 0}
                      >
                        Finish
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <div className="mt-12 grid xl:grid-cols-[1fr_350px] gap-8">
            <Accordion
              type="single"
              collapsible
              className="col-span-1 space-y-6"
            >
              {allExercises.map((exercise: Exercise) => (
                <AccordionItem
                  key={exercise.id}
                  value={exercise.name}
                  className="bg-primary-foreground px-3 lg:px-6 py-2 lg:py-4 rounded-xl"
                >
                  <AccordionTrigger className="lg:text-lg flex items-center gap-2 lg:gap-8">
                    {exercise.name}
                    <div className="flex items-center gap-2 lg:gap-4">
                      {exercise.tags.map((tag) => (
                        <Badge key={tag} className="rounded-full bg-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6 px-3 lg:px-6">
                    <div className="flex flex-col">
                      {getAllSetDetails(exercise.id)?.map((detail, index) => (
                        <div className="" key={detail.reps}>
                          <div className="flex items-center justify-between gap-2 lg:gap-6 w-full lg:w-60">
                            <p className="">Set {index + 1}:</p>
                            <div>
                              {detail.reps} x {detail.weight} kgs
                            </div>
                            <Button
                              variant="ghost"
                              className="rounded-full"
                              onClick={() => handleDeleteSet(detail.detailId)}
                            >
                              <Trash2 scale={75} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center mt-4 gap-2 lg:gap-8">
                        <p className="text-nowrap">
                          Set {numberOfSets(exercise.id) + 1}:
                        </p>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            readOnly={currentWorkout.pausedAt ? true : false}
                            onClick={() => {
                              if (currentWorkout.pausedAt) {
                                new InvalidActionError(
                                  "Workout is currently paused.",
                                  toast
                                );
                              }
                            }}
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className={`${
                              currentWorkout.pausedAt ? "opacity-50" : ""
                            } w-20 lg:w-28 !text-sm placeholder:text-sm placeholder:font-semibold focus-visible:text-sm focus-visible:font-semibold rounded-xl lg:rounded-full px-3 lg:px-6`}
                            placeholder="Reps"
                          />
                          <Input
                            type="number"
                            value={weights}
                            readOnly={currentWorkout.pausedAt ? true : false}
                            onClick={() => {
                              if (currentWorkout.pausedAt) {
                                new InvalidActionError(
                                  "Workout is currently paused.",
                                  toast
                                );
                              }
                            }}
                            onChange={(e) => setWeights(e.target.value)}
                            className={`${
                              currentWorkout.pausedAt ? "opacity-50" : ""
                            } w-24 lg:w-36 !text-sm placeholder:text-sm placeholder:font-semibold focus-visible:text-sm focus-visible:font-semibold rounded-xl lg:rounded-full px-3 lg:px-6`}
                            placeholder="Weight (kgs)"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          className={`${
                            currentWorkout.pausedAt ? "opacity-40" : ""
                          } p-3 rounded-full`}
                          onClick={() => {
                            currentWorkout.pausedAt &&
                              new InvalidActionError(
                                "Workout is currently paused.",
                                toast
                              );
                            handleSetRepsWeights(
                              user.id,
                              Number(reps),
                              Number(weights),
                              exercise.id
                            );
                          }}
                        >
                          <PlusCircle className="scale-125" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="bg-primary-foreground sticky rounded-xl py-8 h-auto">
              <div className="flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-center justify-center gap-3">
                  <h2 className="text-base lg:text-lg uppercase tracking-wider text-muted-foreground">
                    Exercises Done
                  </h2>
                  <hr className="w-8 border-muted-foreground" />
                  <p className="text-4xl lg:text-6xl font-black">
                    {currentWorkout.exercise.length}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <h2 className="text-base lg:text-lg uppercase tracking-wider text-muted-foreground">
                    Total Sets
                  </h2>
                  <hr className="w-8 border-muted-foreground" />
                  <p className="text-4xl lg:text-6xl font-black">
                    {totalNumberOfSets}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <h2 className="text-base lg:text-lg uppercase tracking-wider text-muted-foreground">
                    Total Reps
                  </h2>
                  <hr className="w-8 border-muted-foreground" />
                  <p className="text-4xl lg:text-6xl font-black">
                    {totalNumberOfReps}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger>
                    <Button
                      variant="ghost"
                      className="border-2 border-destructive hover:bg-destructive hover:text-primary rounded-full px-6 py-2"
                    >
                      Discard
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Discard workout</DialogTitle>
                    </DialogHeader>
                    <h3 className="font-light text-sm">
                      Are you sure you want to discard the current workout?
                    </h3>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        className="rounded-full"
                        onClick={handleDiscardWorkoutLog}
                      >
                        Discard
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
