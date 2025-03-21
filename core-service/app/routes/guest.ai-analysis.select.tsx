import { User, Workout } from "@prisma/client";
import { MetaFunction } from "@remix-run/node";
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

const allWorkouts = [
  {
    id: "w-001",
    userId: "user-123",
    workoutName: "Upper Body Strength",
    isFinalised: false,
    exercises: [],
    scheduledAt: ["Monday", "Thursday"],
    workoutAnalysis: [],
    createdAt: new Date("2024-03-01T10:00:00.000Z"),
    updatedAt: new Date("2024-03-01T10:00:00.000Z"),
    WorkoutLog: [
      {
        id: "wl-001",
        startTime: new Date("2024-03-01T10:15:00.000Z"),
        endTime: new Date("2024-03-01T11:00:00.000Z"),
        pauseTime: 5,
        workoutId: "w-001",
        analysed: true,
        createdAt: new Date("2024-03-01T10:15:00.000Z"),
        updatedAt: new Date("2024-03-01T11:00:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: false,
      },
      {
        id: "wl-002",
        startTime: new Date("2024-03-04T10:20:00.000Z"),
        endTime: new Date("2024-03-04T11:10:00.000Z"),
        pauseTime: 7,
        workoutId: "w-001",
        analysed: false,
        createdAt: new Date("2024-03-04T10:20:00.000Z"),
        updatedAt: new Date("2024-03-04T11:10:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: true,
      },
    ],
    DaysWorkouts: null,
    daysWorkoutsId: null,
  },
  {
    id: "w-002",
    userId: "user-123",
    workoutName: "Leg Day",
    isFinalised: true,
    exercises: [],
    scheduledAt: ["Tuesday", "Friday"],
    workoutAnalysis: [],
    createdAt: new Date("2024-03-02T11:15:00.000Z"),
    updatedAt: new Date("2024-03-02T11:15:00.000Z"),
    WorkoutLog: [
      {
        id: "wl-003",
        startTime: new Date("2024-03-02T11:30:00.000Z"),
        endTime: new Date("2024-03-02T12:20:00.000Z"),
        pauseTime: 6,
        workoutId: "w-002",
        analysed: true,
        createdAt: new Date("2024-03-02T11:30:00.000Z"),
        updatedAt: new Date("2024-03-02T12:20:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: false,
      },
      {
        id: "wl-004",
        startTime: new Date("2024-03-05T11:40:00.000Z"),
        endTime: new Date("2024-03-05T12:30:00.000Z"),
        pauseTime: 8,
        workoutId: "w-002",
        analysed: false,
        createdAt: new Date("2024-03-05T11:40:00.000Z"),
        updatedAt: new Date("2024-03-05T12:30:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: true,
      },
    ],
    DaysWorkouts: null,
    daysWorkoutsId: null,
  },
  {
    id: "w-003",
    userId: "user-123",
    workoutName: "Push Day",
    isFinalised: false,
    exercises: [],
    scheduledAt: ["Wednesday"],
    workoutAnalysis: [],
    createdAt: new Date("2024-03-03T08:45:00.000Z"),
    updatedAt: new Date("2024-03-03T08:45:00.000Z"),
    WorkoutLog: [
      {
        id: "wl-005",
        startTime: new Date("2024-03-03T09:00:00.000Z"),
        endTime: new Date("2024-03-03T09:50:00.000Z"),
        pauseTime: 4,
        workoutId: "w-003",
        analysed: true,
        createdAt: new Date("2024-03-03T09:00:00.000Z"),
        updatedAt: new Date("2024-03-03T09:50:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: false,
      },
      {
        id: "wl-006",
        startTime: new Date("2024-03-06T09:10:00.000Z"),
        endTime: new Date("2024-03-06T10:00:00.000Z"),
        pauseTime: 5,
        workoutId: "w-003",
        analysed: false,
        createdAt: new Date("2024-03-06T09:10:00.000Z"),
        updatedAt: new Date("2024-03-06T10:00:00.000Z"),
        userId: "user-123",
        ExerciseLog: [],
        images: [],
        inProgress: true,
      },
    ],
    DaysWorkouts: null,
    daysWorkoutsId: null,
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | AI Analysis" },
    {
      name: "AI Analysis",
      content: "AI analysis of your selected workout.",
    },
  ];
};

export default function AIAnalysisSelection() {
  const [workoutId, setWorkoutId] = useState("");
  return (
    <div className="w-full h-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/ai-analysis/select">
              AI Analysis
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="AI Analysis"
        subheading="Select the workout and click on Analyse"
      />
      <div className="mx-auto w-full h-3/4 flex flex-col items-center justify-center gap-4 md:gap-8 xl:gap-12">
        <Select value={workoutId} onValueChange={setWorkoutId}>
          <SelectTrigger className="w-[250px] md:w-[350px] xl:w-[500px] text-sm md:text-lg rounded-full text-muted-foreground px-3 md:px-8 xl:px-12 py-6 xl:py-8">
            <SelectValue placeholder="Select a workout to analyse" />
          </SelectTrigger>
          <SelectContent className="rounded-xl px-3 border-none">
            <SelectGroup className="space-y-3 py-3 bg-transparent hover:bg-transparent">
              {allWorkouts.map(
                ({ id, workoutName, WorkoutLog }) =>
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
        {workoutId && (
          <Link
            to={`/guest/ai-analysis/${workoutId}`}
            className="flex items-center gap-3 rounded-full font-semibold px-4 md:px-8 lg:px-16 py-2 sm:py-3 bg-gradient-to-r from-chart-4 text-sm lg:text-base to-accent text-foreground"
          >
            <BrainCircuit />
            Run Analysis
          </Link>
        )}
      </div>
    </div>
  );
}
