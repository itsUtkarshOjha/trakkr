import { getAuth } from "@clerk/remix/ssr.server";
import { Exercise } from "@prisma/client";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { Check, PlusCircle, Trash } from "lucide-react";
import { EventHandler, useState } from "react";
import HeadingSubheading from "~/components/heading-subheading";
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
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  deleteExercise,
  getAllExercises,
  getExercises,
} from "~/controllers/exercise.controller";
import { addExercise, addWorkout } from "~/controllers/workout.controller";
import { useToast } from "~/hooks/use-toast";
import { InputError, InvalidActionError } from "~/lib/Error";
import { SuccessToast } from "~/lib/SuccessToast";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Create your workout" },
    {
      name: "Create your workout.",
      content: "Page to create your workout.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId: clerkId } = await getAuth(args);
  const exercises = await getExercises(clerkId!);

  return { exercises };
};

export const action: ActionFunction = async (args) => {
  const { userId: clerkId } = await getAuth(args);
  const { request } = args;
  const formData = await request.formData();
  if (formData.get("workoutName")) {
    const workoutName = formData.get("workoutName") as string;
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(workoutName)) return;
    const createdWorkout = await addWorkout(clerkId as string, workoutName);
    return redirect("/workouts");
  }

  if (formData.get("addExercise") === "") {
    const exerciseData = {
      name: formData.get("exerciseName") as string,
    };
    await addExercise(clerkId!, exerciseData);
    return { message: "Exercise added successfully." };
  }
  if (formData.get("deleteExercise")) {
    const exerciseId = formData.get("deleteExercise");
    await deleteExercise(exerciseId as string, clerkId as string);
    return { message: "Exercise deleted successfully." };
  }
  if (formData.get("exerciseQuery")) {
    const exerciseQuery = formData.get("exerciseQuery") as string;
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(exerciseQuery)) return null;
    const allExercises = await getAllExercises(exerciseQuery);
    return { exercises: allExercises, message: "" };
  }
  return [];
};

export default function CreateWorkout() {
  const fetcher = useFetcher();
  const { exercises } = useLoaderData<typeof loader>();
  const [exerciseName, setExerciseName] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const allExercises: Exercise[] =
    fetcher.data && fetcher.data.exercises
      ? (fetcher.data.exercises as [])
      : [];
  const { toast } = useToast();
  const message: string = fetcher.data ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }
  const suggestedNames: string[] = [];
  for (const exercise of allExercises) {
    suggestedNames.push(exercise.name);
  }
  const handleCreateWorkout = (e: MouseEvent, workoutName: string) => {
    e.preventDefault();
    if (workoutName.length < 3) {
      new InputError("Workout name should be atleast 3 characters.", toast);
      return;
    }
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(workoutName)) {
      new InputError(
        "Workout name should not contain any special characters.",
        toast
      );
      return;
    }
    if (workoutName.length > 30) {
      new InputError("Workout name should be atmost 30 characters", toast);
      return;
    }
    fetcher.submit(
      {
        workoutName,
      },
      {
        method: "POST",
      }
    );
  };
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workouts">Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/create-workout">
              Create Workout
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="Let the magic begin!"
        subheading="Just add the exercises, we'll ask for details once you start logging the workout."
      />
      <div className="mt-12 mb-6 flex flex-col gap-6 xl:w-[80%]">
        {exercises &&
          exercises.map((exercise: Exercise) => (
            <div
              key={exercise.id}
              className="grid grid-cols-4 gap-y-3 sm:grid-cols-6 w-full justify-between bg-primary-foreground items-center rounded-xl py-3 px-8"
            >
              <div className="lg:text-lg col-span-4 sm:col-span-3">
                {exercise.name}
              </div>
              <div className="flex gap-4 col-span-3 sm:col-span-2 md:opacity-0 lg:opacity-100">
                {exercise.tags.map((tag) => (
                  <Badge
                    className="rounded-full bg-primary text-background font-medium"
                    key={tag}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="ml-auto">
                <Button
                  variant="destructive"
                  name="deleteExercise"
                  value={exercise.id}
                  className="rounded-full"
                  onClick={() => {
                    fetcher.submit(
                      { deleteExercise: exercise.id },
                      { method: "DELETE" }
                    );
                  }}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="relative flex xl:w-4/5 px-4 py-2 border-[1px] border-primary rounded-xl mb-12 shadow-sm">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger className="absolute left-40 lg:left-48 top-16"></PopoverTrigger>
          <Input
            name="exerciseName"
            placeholder="Incline Dumbbell Bench Press"
            value={exerciseName}
            required
            onChange={(e) => {
              setExerciseName(e.target.value);
              if (e.target.value.length > 2) {
                setIsPopoverOpen(true);
                fetcher.submit(
                  { exerciseQuery: e.target.value },
                  { method: "POST", preventScrollReset: "true" }
                );
              }
            }}
            className="border-none xl:placeholder:text-lg xl:focus-visible:text-lg !xl:text-lg md:text-base focus-visible:ring-0 drop-shadow-none shadow-none placeholder:opacity-40"
          />
          {allExercises.length > 0 && (
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="w-full min-w-80 p-0 bg-muted"
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
          type="submit"
          name="addExercise"
          variant="secondary"
          className="rounded-full px-4 py-2 mx-4 bg-success shadow-md"
          onClick={() => {
            setExerciseName("");
            if (suggestedNames.includes(exerciseName))
              fetcher.submit(
                {
                  exerciseName,
                  addExercise: "",
                },
                { method: "POST" }
              );
          }}
        >
          <PlusCircle className="text-background scale-125" />
        </Button>
      </div>
      <hr className="mb-12 opacity-50" />
      <Form method="post" className="mt-6">
        <div className="grid grid-cols-5 gap-x-20 grid-rows-1 gap-y-4 mb-6">
          {exercises && exercises.length > 0 && (
            <div className="space-y-2 col-span-5 w-full lg:w-1/2">
              <Input
                type="text"
                placeholder="Name of the workout"
                onChange={(e) => setWorkoutName(e.target.value)}
                className="py-3 sm:py-5 md:py-5 xl:py-7 md:text-base placeholder:opacity-50 rounded-xl px-4 sm:px-6 border-primary xl:text-lg xl:placeholder:text-lg w-3/4"
              />
            </div>
          )}
        </div>

        {exercises && exercises.length > 0 && (
          <Button
            className="mx-2 border-2 border-success bg-background text-primary hover:bg-success rounded-xl hover:text-background"
            onClick={(e) => handleCreateWorkout(e, workoutName)}
          >
            <Check />
            Finish
          </Button>
        )}
      </Form>
    </div>
  );
}
