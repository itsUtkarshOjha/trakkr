import { Exercise } from "@prisma/client";
import { MetaFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import {
  Calendar,
  Cross,
  ExternalLink,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
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
import {
  CurrentWorkout,
  WorkoutLogShort,
  WorkoutsWithExercises,
} from "~/lib/interfaces";

const workouts: WorkoutsWithExercises[] = [
  {
    userId: "user-123",
    id: "w-001",
    workoutName: "Upper Body Strength",
    scheduledAt: ["Monday", "Thursday"],
    createdAt: new Date("2024-03-01T10:00:00.000Z"),
    updatedAt: new Date("2024-03-01T10:00:00.000Z"),
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        tags: ["chest", "strength", "barbell"],
        createdAt: new Date("2024-03-01T08:00:00.000Z"),
        updatedAt: new Date("2024-03-01T08:00:00.000Z"),
      },
      {
        id: "e2",
        name: "Overhead Press",
        tags: ["shoulders", "barbell", "strength"],
        createdAt: new Date("2024-03-02T08:00:00.000Z"),
        updatedAt: new Date("2024-03-02T08:00:00.000Z"),
      },
      {
        id: "e3",
        name: "Barbell Row",
        tags: ["back", "barbell", "pull"],
        createdAt: new Date("2024-03-03T08:00:00.000Z"),
        updatedAt: new Date("2024-03-03T08:00:00.000Z"),
      },
    ],
  },
  {
    userId: "user-123",
    id: "w-002",
    workoutName: "Leg Day",
    scheduledAt: ["Tuesday", "Friday"],
    createdAt: new Date("2024-03-02T11:15:00.000Z"),
    updatedAt: new Date("2024-03-02T11:15:00.000Z"),
    exercises: [
      {
        id: "e4",
        name: "Squat",
        tags: ["legs", "barbell", "strength"],
        createdAt: new Date("2024-03-04T08:00:00.000Z"),
        updatedAt: new Date("2024-03-04T08:00:00.000Z"),
      },
      {
        id: "e5",
        name: "Leg Press",
        tags: ["legs", "machine", "strength"],
        createdAt: new Date("2024-03-05T08:00:00.000Z"),
        updatedAt: new Date("2024-03-05T08:00:00.000Z"),
      },
      {
        id: "e6",
        name: "Calf Raises",
        tags: ["legs", "bodyweight", "endurance"],
        createdAt: new Date("2024-03-06T08:00:00.000Z"),
        updatedAt: new Date("2024-03-06T08:00:00.000Z"),
      },
    ],
  },
  {
    userId: "user-123",
    id: "w-003",
    workoutName: "Push Day",
    scheduledAt: ["Wednesday"],
    createdAt: new Date("2024-03-03T08:45:00.000Z"),
    updatedAt: new Date("2024-03-03T08:45:00.000Z"),
    exercises: [
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
        tags: ["shoulders", "dumbbell", "accessory"],
        createdAt: new Date("2024-03-09T08:00:00.000Z"),
        updatedAt: new Date("2024-03-09T08:00:00.000Z"),
      },
    ],
  },
];

const workoutLogs: WorkoutLogShort[] = [
  {
    id: "log-001",
    createdAt: new Date("2024-03-01T10:00:00.000Z"),
    workout: {
      id: "w-001",
      workoutName: "Upper Body Strength",
    },
  },
  {
    id: "log-002",
    createdAt: new Date("2024-03-02T11:15:00.000Z"),
    workout: {
      id: "w-002",
      workoutName: "Leg Day",
    },
  },
  {
    id: "log-003",
    createdAt: new Date("2024-03-03T08:45:00.000Z"),
    workout: {
      id: "w-003",
      workoutName: "Push Day",
    },
  },
  {
    id: "log-004",
    createdAt: new Date("2024-03-04T09:30:00.000Z"),
    workout: {
      id: "w-004",
      workoutName: "Pull Day",
    },
  },
  {
    id: "log-005",
    createdAt: new Date("2024-03-05T07:50:00.000Z"),
    workout: {
      id: "w-005",
      workoutName: "Full Body HIIT",
    },
  },
  {
    id: "log-006",
    createdAt: new Date("2024-03-06T10:20:00.000Z"),
    workout: {
      id: "w-006",
      workoutName: "Strength & Conditioning",
    },
  },
  {
    id: "log-007",
    createdAt: new Date("2024-03-07T12:10:00.000Z"),
    workout: {
      id: "w-007",
      workoutName: "Powerlifting Session",
    },
  },
  {
    id: "log-008",
    createdAt: new Date("2024-03-08T14:00:00.000Z"),
    workout: {
      id: "w-008",
      workoutName: "Endurance Training",
    },
  },
  {
    id: "log-009",
    createdAt: new Date("2024-03-09T16:30:00.000Z"),
    workout: {
      id: "w-009",
      workoutName: "Core & Mobility",
    },
  },
  {
    id: "log-010",
    createdAt: new Date("2024-03-10T18:45:00.000Z"),
    workout: {
      id: "w-010",
      workoutName: "Recovery & Stretching",
    },
  },
];

const upcomingWorkouts = [
  { workoutName: "Upper Body Strength", daysFromNow: 1 },
  { workoutName: "Leg Day", daysFromNow: 2 },
  { workoutName: "Push Day", daysFromNow: 3 },
  { workoutName: "Pull Day", daysFromNow: 4 },
  { workoutName: "Full Body HIIT", daysFromNow: 5 },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Your Workouts" },
    {
      name: "Your workouts",
      content: "See your workouts, log your workout and see upcoming workouts.",
    },
  ];
};

export default function GuestWorkouts() {
  const logCount: number = 10;
  const totalPages = Math.ceil(logCount / 10);
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/workouts">Workouts</BreadcrumbLink>
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
                  //   onClick={() => handleStartWorkout(workout.id)}
                  disabled={true}
                >
                  Start Logging
                </Button>
                <div className="ml-auto sm:col-span-1 sm:-col-start-1">
                  <Button variant="secondary" className="rounded-full" disabled>
                    <Calendar />
                  </Button>
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
                      <Button variant="ghost" className="rounded-full" disabled>
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  {
                    <Button
                      className="w-28 rounded-full hover:bg-muted bg-primary-foreground"
                      variant="outline"
                      disabled
                    >
                      <PlusCircle /> Add
                    </Button>
                  }
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
                  to={`/guest/analysis`}
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
