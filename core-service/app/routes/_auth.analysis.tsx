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
import { useToast } from "~/hooks/use-toast";
import { WorkoutLogForAnalysis } from "~/lib/interfaces";
import { SuccessToast } from "~/lib/SuccessToast";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Analysis" },
    {
      name: "Analysis",
      content: "Analysis of your selected workout.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId: clerkId } = await getAuth(args);
  const user = await getUser(clerkId!);
  const workoutLogId = new URL(args.request.url).searchParams.get("log");
  if (!workoutLogId) return redirect("/workouts");
  const workoutLog = await getWorkoutLogsById(workoutLogId);
  if (!workoutLog) return redirect("/workouts");
  const images = await getImagesByWorkoutLog(workoutLogId, user!.id);
  return { workoutLog, images };
};

export const action: ActionFunction = async (args) => {
  const { request } = args;
  const { userId: clerkId } = await getAuth(args);
  const user = await getUser(clerkId!);

  const formData = await request.formData();
  const formType = formData.get("formType");
  if (formType === "UPLOAD_IMAGE") {
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageString = buffer.toString("base64");
    const workoutLogId = formData.get("workoutLogId");
    const userId = user!.id;
    const imageDetails = {
      imageString,
      workoutLogId,
      userId,
    };
    await sendImage(JSON.stringify(imageDetails));
    return { message: "Image upload started successfully." };
  }
  if (formType === "DELETE_IMAGE") {
    const imageId = formData.get("imageId") as string;
    await deleteImage(imageId);
    return { message: "Image deleted successfully." };
  }
  return null;
};

export default function WorkoutAnalysis() {
  const loaderData: { workoutLog: WorkoutLogForAnalysis; images: Image[] } =
    useLoaderData<typeof loader>();
  const { workoutLog, images } = loaderData;
  const [file, setFile] = useState<File>();
  const [isPolling, setIsPolling] = useState(false);
  const fetcher = useFetcher();
  const { toast } = useToast();
  const message =
    fetcher.data && fetcher.data.message ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }
  const revalidator = useRevalidator();
  const interval = 5000;
  useEffect(() => {
    if (!isPolling) return;
    if (revalidator.state === "idle") {
      revalidator.revalidate();
    }
  }, [interval, revalidator, isPolling]);
  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("workoutLogId", workoutLog.id);
    formData.append("formType", "UPLOAD_IMAGE");
    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
    setFile(undefined);
    setIsPolling(true);
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
              <Button className="rounded-full" onClick={handleImageUpload}>
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
        to={"/ai-analysis/select"}
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
      <WorkoutLogImages images={images} />
    </div>
  );
}
