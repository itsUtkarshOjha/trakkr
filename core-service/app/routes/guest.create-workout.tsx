import { Exercise } from "@prisma/client";
import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Check, PlusCircle, Trash } from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { Popover, PopoverTrigger } from "~/components/ui/popover";

const exercises: Exercise[] = [
  {
    id: "e7",
    name: "Dumbbell Press",
    tags: ["chest", "dumbbell", "push"],
    createdAt: new Date("2024-03-07T08:00:00.000Z"),
    updatedAt: new Date("2024-03-07T08:00:00.000Z"),
  },
  {
    id: "e8",
    name: "Incline Bench Press",

    tags: ["chest", "strength", "barbell"],
    createdAt: new Date("2024-03-08T08:00:00.000Z"),
    updatedAt: new Date("2024-03-08T08:00:00.000Z"),
  },
  {
    id: "e9",
    name: "Lateral Raises",

    tags: ["shoulders", "dumbbell"],
    createdAt: new Date("2024-03-09T08:00:00.000Z"),
    updatedAt: new Date("2024-03-09T08:00:00.000Z"),
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Create your workout" },
    {
      name: "Create your workout.",
      content: "Page to create your workout.",
    },
  ];
};

export default function CreateWorkout() {
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/workouts">Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/create-workout">
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
                  disabled
                  className="rounded-full"
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="relative flex xl:w-4/5 px-4 py-2 border-[1px] border-primary rounded-xl mb-12 shadow-sm">
        <Popover>
          <PopoverTrigger className="absolute left-40 lg:left-48 top-16"></PopoverTrigger>
          <Input
            disabled
            name="exerciseName"
            placeholder="Incline Dumbbell Bench Press"
            required
            className="border-none xl:placeholder:text-lg xl:focus-visible:text-lg !xl:text-lg md:text-base focus-visible:ring-0 drop-shadow-none shadow-none placeholder:opacity-40"
          />
        </Popover>

        <Button
          type="submit"
          name="addExercise"
          variant="secondary"
          className="rounded-full px-4 py-2 mx-4 bg-success shadow-md"
          disabled
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
                disabled
                name="workoutName"
                placeholder="Name of the workout"
                className="py-3 sm:py-5 md:py-5 xl:py-7 md:text-base placeholder:opacity-50 rounded-xl px-4 sm:px-6 border-primary xl:text-lg xl:placeholder:text-lg w-3/4"
                required
              />
            </div>
          )}
        </div>

        {exercises && exercises.length > 0 && (
          <Button
            type="submit"
            className="mx-2 border-2 border-success bg-background text-primary hover:bg-success rounded-xl hover:text-background"
            disabled
          >
            <Check />
            Finish
          </Button>
        )}
      </Form>
    </div>
  );
}
