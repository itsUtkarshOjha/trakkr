import { Weight } from "@prisma/client";
import { MetaFunction } from "@remix-run/node";
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
import { ExerciseWithOneRepMax, WorkoutLogShort } from "~/lib/interfaces";

const weights: Weight[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    userId: "user-123",
    value: 75,
    recordedAt: new Date("2024-03-10T08:30:00.000Z"),
    updatedAt: new Date("2024-03-10T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    userId: "user-123",
    value: 75.5,
    recordedAt: new Date("2024-03-09T08:30:00.000Z"),
    updatedAt: new Date("2024-03-09T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    userId: "user-123",
    value: 72,
    recordedAt: new Date("2024-03-08T08:30:00.000Z"),
    updatedAt: new Date("2024-03-08T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    userId: "user-123",
    value: 71.5,
    recordedAt: new Date("2024-03-07T08:30:00.000Z"),
    updatedAt: new Date("2024-03-07T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    userId: "user-123",
    value: 70,
    recordedAt: new Date("2024-03-06T08:30:00.000Z"),
    updatedAt: new Date("2024-03-06T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    userId: "user-123",
    value: 68,
    recordedAt: new Date("2024-03-05T08:30:00.000Z"),
    updatedAt: new Date("2024-03-05T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    userId: "user-123",
    value: 65,
    recordedAt: new Date("2024-03-04T08:30:00.000Z"),
    updatedAt: new Date("2024-03-04T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    userId: "user-123",
    value: 65,
    recordedAt: new Date("2024-03-03T08:30:00.000Z"),
    updatedAt: new Date("2024-03-03T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    userId: "user-123",
    value: 67,
    recordedAt: new Date("2024-03-02T08:30:00.000Z"),
    updatedAt: new Date("2024-03-02T08:30:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    userId: "user-123",
    value: 64,
    recordedAt: new Date("2024-03-01T08:30:00.000Z"),
    updatedAt: new Date("2024-03-01T08:30:00.000Z"),
  },
];

const exercisesWithOneRepMaxes: ExerciseWithOneRepMax[] = [
  {
    exerciseId: "e1",
    exerciseName: "Barbell Bench Press",
    oneRepMaxes: [
      { oneRepMax: 100, recordedAt: new Date("2024-03-01") },
      { oneRepMax: 102, recordedAt: new Date("2024-03-05") },
      { oneRepMax: 110, recordedAt: new Date("2024-03-10") },
      { oneRepMax: 107.5, recordedAt: new Date("2024-03-15") },
      { oneRepMax: 117.5, recordedAt: new Date("2024-03-20") },
      { oneRepMax: 115, recordedAt: new Date("2024-03-25") },
    ],
  },
  {
    exerciseId: "e2",
    exerciseName: "Deadlift",
    oneRepMaxes: [
      { oneRepMax: 180, recordedAt: new Date("2024-03-02") },
      { oneRepMax: 192.5, recordedAt: new Date("2024-03-06") },
      { oneRepMax: 190, recordedAt: new Date("2024-03-11") },
      { oneRepMax: 187.5, recordedAt: new Date("2024-03-16") },
      { oneRepMax: 197.5, recordedAt: new Date("2024-03-21") },
      { oneRepMax: 200, recordedAt: new Date("2024-03-26") },
    ],
  },
  {
    exerciseId: "e3",
    exerciseName: "Barbell Squat",
    oneRepMaxes: [
      { oneRepMax: 140, recordedAt: new Date("2024-03-03") },
      { oneRepMax: 152.5, recordedAt: new Date("2024-03-07") },
      { oneRepMax: 155, recordedAt: new Date("2024-03-12") },
      { oneRepMax: 155, recordedAt: new Date("2024-03-17") },
      { oneRepMax: 160, recordedAt: new Date("2024-03-22") },
      { oneRepMax: 162.5, recordedAt: new Date("2024-03-27") },
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

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Dashboard" },
    {
      name: "Dashboard",
      content: "One rep max chart and body weight progression.",
    },
  ];
};

export default function GuestDashboard() {
  return (
    <div className="w-full">
      <HeadingSubheading heading={`Hello Guest !`} />
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
                    to={`/guest/analysis`}
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
                  117.50
                  <span className="text-xl tracking-normal font-normal text-muted-foreground ml-1">
                    kgs
                  </span>
                </p>
                <p className="text-sm font-light">in Barbell Bench Press</p>
              </div>
            </div>
            <hr className="border-primary-foreground" />
            <div className="h-[200px]">
              <h2 className="sm:text-lg lg:text-xl mb-4">Total Sets Logged</h2>
              <div className="h-3/4 bg-primary-foreground rounded-xl flex flex-col gap-3 items-center justify-center">
                <p className="text-5xl lg:text-6xl font-black tracking-wider text-muted-foreground">
                  864
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
              <WeightChart weightLogs={weights} targetWeight={75} />
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
