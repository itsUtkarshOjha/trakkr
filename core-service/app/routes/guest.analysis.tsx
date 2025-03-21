import { getAuth } from "@clerk/remix/ssr.server";
import { Image } from "@prisma/client";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { Trash2, Upload } from "lucide-react";
import { sendImage } from "rabbitmq/sendImage";
import { useEffect, useState } from "react";
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
import { Label } from "~/components/ui/label";
import WorkoutLogImages from "~/components/workoutlog-images";
import {
  deleteImage,
  getImagesByWorkoutLog,
} from "~/controllers/image.controller";
import { getUser } from "~/controllers/user.controller";
import { getWorkoutLogsById } from "~/controllers/workoutLog.controller";
import { WorkoutLogForAnalysis } from "~/lib/interfaces";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Analysis" },
    {
      name: "Analysis",
      content: "Analysis of your selected workout.",
    },
  ];
};

const workoutLog: WorkoutLogForAnalysis = {
  id: "wl-001",
  createdAt: new Date("2024-03-10T08:30:00.000Z"),
  workout: {
    workoutName: "Upper Body Strength",
  },
  ExerciseLog: [
    {
      id: "el-001",
      oneRepMax: 120,
      sets: [
        {
          id: "set-001",
          createdAt: new Date("2024-03-10T08:35:00.000Z"),
          updatedAt: new Date("2024-03-10T08:40:00.000Z"),
          exerciseId: "e1",
          weightLifted: 100,
          reps: 8,
          exerciseLogId: "el-001",
        },
        {
          id: "set-002",
          createdAt: new Date("2024-03-10T08:41:00.000Z"),
          updatedAt: new Date("2024-03-10T08:45:00.000Z"),
          exerciseId: "e1",
          weightLifted: 105,
          reps: 6,
          exerciseLogId: "el-001",
        },
      ],
      exercise: {
        name: "Bench Press",
        tags: ["chest", "strength", "barbell"],
      },
    },
    {
      id: "el-002",
      oneRepMax: 140,
      sets: [
        {
          id: "set-003",
          createdAt: new Date("2024-03-10T08:50:00.000Z"),
          updatedAt: new Date("2024-03-10T08:55:00.000Z"),
          exerciseId: "e2",
          weightLifted: 120,
          reps: 5,
          exerciseLogId: "el-002",
        },
        {
          id: "set-004",
          createdAt: new Date("2024-03-10T08:56:00.000Z"),
          updatedAt: new Date("2024-03-10T09:00:00.000Z"),
          exerciseId: "e2",
          weightLifted: 125,
          reps: 4,
          exerciseLogId: "el-002",
        },
      ],
      exercise: {
        name: "Deadlift",
        tags: ["back", "strength", "barbell"],
      },
    },
    {
      id: "el-003",
      oneRepMax: 95,
      sets: [
        {
          id: "set-005",
          createdAt: new Date("2024-03-10T09:05:00.000Z"),
          updatedAt: new Date("2024-03-10T09:10:00.000Z"),
          exerciseId: "e3",
          weightLifted: 85,
          reps: 10,
          exerciseLogId: "el-003",
        },
        {
          id: "set-006",
          createdAt: new Date("2024-03-10T09:11:00.000Z"),
          updatedAt: new Date("2024-03-10T09:15:00.000Z"),
          exerciseId: "e3",
          weightLifted: 90,
          reps: 8,
          exerciseLogId: "el-003",
        },
      ],
      exercise: {
        name: "Overhead Press",
        tags: ["shoulders", "strength", "barbell"],
      },
    },
  ],
};

export default function WorkoutAnalysis() {
  const [file, setFile] = useState<File>();
  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workouts">Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/analysis?log=${workoutLog.id}`}>
              Analysis
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="You did great!"
        subheading={`${
          workoutLog.workout.workoutName
        } logged on ${workoutLog.createdAt.toDateString()}`}
      />
      <div className="flex items-center gap-3">
        {file === undefined ? (
          <div className="my-8 flex items-center gap-4 border-2 w-full sm:w-48 rounded-xl">
            <Label
              className="flex w-full px-8 py-2 sm:py-4 items-center justify-center gap-4 sm:justify-between cursor-pointer"
              htmlFor="uploadBtn"
            >
              <Upload />
              Upload Image
            </Label>
            <Input
              type="file"
              accept="image/*"
              value={file}
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
              id="uploadBtn"
              className="file:w-36 items-center !text-sm file:cursor-pointer cursor-pointer hidden border-none"
            />
          </div>
        ) : (
          <div className="flex items-center my-8 gap-8">
            <p className="text-sm font-extralight">{file.name}</p>
            <div className="flex items-center gap-2">
              <Button className="rounded-full" onClick={() => {}}>
                <Upload />
              </Button>
              <Button
                variant="destructive"
                className="rounded-full"
                onClick={() => setFile(undefined)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Link
        to={"/guest/ai-analysis/select"}
        className="text-sm sm:text-base w-full block transition-all duration-300 py-3 px-4 sm:px-12 bg-gradient-to-tr from-chart-4 to-accent rounded-xl text-center font-light"
      >
        Get your progression rate, fatigue index and a few AI driven insights
        based on this workout and past analyses.
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        {workoutLog.ExerciseLog.map((exerciseLog) => (
          <div
            key={exerciseLog.id}
            className="bg-primary-foreground flex flex-col gap-8 items-center justify-between rounded-xl py-8"
          >
            <div className="flex flex-col gap-2 sm:gap-4 items-center">
              <p className="text-lg sm:text-xl xl:text-2xl font-semibold text-center">
                {exerciseLog.exercise.name}
              </p>
              <div className="flex items-center gap-3 sm:gap-5">
                {exerciseLog.exercise.tags.map((tag) => (
                  <Badge className="rounded-full bg-primary" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm sm:text-base font-light">
              <div className="flex items-center gap-4 tracking-wider">
                {exerciseLog.sets.map((set, index) => (
                  <>
                    <div key={set.id}>
                      {set.reps}x{set.weightLifted}kgs{" "}
                    </div>
                    {index !== exerciseLog.sets.length - 1 ? "|" : ""}
                  </>
                ))}
              </div>
              {exerciseLog.oneRepMax && (
                <p>
                  Estimated one rep max: {Math.round(exerciseLog.oneRepMax)} kgs
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <h3 className="md:text-xl font-semibold mb-3">Images</h3>
      <hr className="opacity-50" />
    </div>
  );
}
