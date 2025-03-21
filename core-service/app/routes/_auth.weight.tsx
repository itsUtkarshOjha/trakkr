import { getAuth } from "@clerk/remix/ssr.server";
import { Weight } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { CalendarIcon, Edit, PlusCircle, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import HeadingSubheading from "~/components/heading-subheading";
import PaginationComponent from "~/components/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import WeightChart from "~/components/weight-chart";
import { getUser } from "~/controllers/user.controller";
import {
  deleteWeights,
  getTargetWeight,
  getWeights,
  logWeight,
  setDate,
  setTargetWeight,
} from "~/controllers/weight.controller";
import { InputError } from "~/lib/Error";
import { useToast } from "~/hooks/use-toast";
import DeletionConfirmation from "~/components/delete-confirm-dialog";
import { SuccessToast } from "~/lib/SuccessToast";

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Weight Tracker" },
    {
      name: "Weight tracker",
      content: "Track your weight and compare it with your set target weight.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) return redirect("/");
  const user = await getUser(userId);
  const targetWeight = await getTargetWeight(user!.id);
  const url = new URL(args.request.url);
  const queryLogPage = url.searchParams.get("logPage") || 1;
  const skip = (Number(queryLogPage) - 1) * 10;
  const { weights, weightCount } = await getWeights(user!.id, skip);
  return { targetWeight, userId: user!.id, weights, weightCount };
};

export const action: ActionFunction = async (args) => {
  const { userId: clerkUserId } = await getAuth(args);
  const user = await getUser(clerkUserId!);
  const { request } = args;
  const formData = await request.formData();
  const userId = formData.get("userId");
  if (user!.id !== userId) return redirect("/");
  let inputError: string = "";
  if (formData.get("formType") === "LOG_WEIGHT") {
    const weight = Number(formData.get("weight"));
    if (!weight) {
      inputError = "Weight not provided.";
      return { inputError };
    }
    if (weight > 500) {
      inputError = "Weight cannot be more than 500 kgs.";
      return { inputError };
    }
    if (weight < 1) {
      inputError = "Weight cannot be less than 1.";
      return { inputError };
    }

    const createdWeight = await logWeight(userId as string, weight);
    return { createdWeight, message: "Weight logged successfully." };
  }
  if (formData.get("formType") === "SET_TARGET_WEIGHT") {
    const weight = Number(formData.get("weight"));
    if (!weight) {
      inputError = "Weight not provided.";
      return { inputError };
    }
    if (weight < 1) {
      inputError = "Weight cannot be less than 1 kg.";
      return { inputError };
    }
    if (weight > 500) {
      inputError = "Weight cannot be more than 500 kgs.";
      return { inputError };
    }
    const targetWeight = setTargetWeight(userId as string, weight);
    return { targetWeight, message: "Target weight set successfully." };
  }
  if (formData.get("formType") === "DELETE_LOGGED_WEIGHT") {
    const weightId = formData.get("weightId");
    await deleteWeights(userId, weightId as string);
    return { message: "Logged weight deleted successfully." };
  }
  if (formData.get("formType") === "SET_DATE") {
    await setDate(
      formData.get("date") as string,
      formData.get("weightId") as string
    );
    return { message: "Date updated successfully." };
  }
};

export default function TrackWeight() {
  const loaderData: {
    targetWeight: number;
    userId: string;
    weights: Weight[];
    weightCount: number;
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { targetWeight, userId, weights, weightCount } = loaderData;
  const [currentField, setCurrentField] = useState<string>("");
  const [targetField, setTargetField] = useState<string>("");
  const [targetEditing, setTargetEditing] = useState(false);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const message: string =
    fetcher.data && fetcher.data.message ? fetcher.data.message : "";
  if (message.length > 0) {
    new SuccessToast(message, toast);
    fetcher.data.message = "";
  }

  const isSubmitting = fetcher.state === "submitting";
  const totalPages = Math.ceil(weightCount / 10);

  if (fetcher.data) {
    const inputError = fetcher.data.inputError;
    if (inputError?.length > 0) {
      new InputError(inputError, toast);
      fetcher.data.inputError = "";
    }
  }

  const handleLogWeight = () => {
    fetcher.submit(
      { formType: "LOG_WEIGHT", weight: currentField, userId },
      { method: "POST" }
    );
    setCurrentField("");
  };

  const handleUpdateTargetWeight = () => {
    fetcher.submit(
      {
        formType: "SET_TARGET_WEIGHT",
        weight: targetField,
        userId,
      },
      { method: "POST" }
    );
    setTargetField("");
    setTargetEditing(false);
  };

  const handleDeleteLoggedWeight = (weightId: string) => {
    fetcher.submit(
      {
        formType: "DELETE_LOGGED_WEIGHT",
        weightId,
        userId,
      },
      {
        method: "DELETE",
      }
    );
  };

  const handleSetDate = (date: Date | undefined, weightId: string) => {
    if (!date) {
      return new InputError("Date not selected", toast);
    }
    if (date.getTime() > Date.now()) {
      return new InputError("Date cannot be of future.", toast);
    }
    fetcher.submit(
      {
        formType: "SET_DATE",
        weightId,
        date: date.toISOString(),
        userId,
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
            <BreadcrumbLink href="/weight">Weight Tracker</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="Track your weight"
        subheading="You came here empty handed, you'll leave with motivation."
      />
      <div className="mt-8 lg:mt-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 xl:gap-x-6 gap-y-2 items-center">
          <div className="flex items-center justify-center gap-6 rounded-xl border bg-primary-foreground px-4 py-4">
            <p className="text-nowrap text-[14px] sm:text-lg font-light">
              Log your weight (kgs)
            </p>
            <div
              className={`px-2 lg:px-4 border-[1px] py-1 border-primary rounded-xl xl:rounded-full flex items-center`}
            >
              <Input
                type="number"
                value={currentField}
                disabled={isSubmitting}
                onChange={(e) => {
                  setCurrentField(e.target.value);
                }}
                className="focus-visible:ring-0 lg:w-24 lg:text-xl lg:focus-visible:text-xl focus-visible:border-0 border-0"
              />
              <Button
                onClick={handleLogWeight}
                disabled={isSubmitting || currentField.length === 0}
                className={`text-sm h-4/5 rounded-full bg-success transition-all duration-300 ${
                  currentField.length === 0 && "opacity-0 disabled:opacity-0"
                }`}
              >
                <PlusCircle className="lg:scale-125" />
              </Button>
            </div>
          </div>
          <div className="rounded-xl border bg-primary-foreground px-3 py-4">
            {targetWeight !== -1 && !targetEditing ? (
              <div className="flex items-center justify-center gap-6">
                <Target size={48} />
                <p className="sm:text-xl">
                  Your target weight is {targetWeight} kgs.
                </p>
                <Edit
                  size={24}
                  className="border-2 cursor-pointer"
                  onClick={() => setTargetEditing(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                <p className="text-nowrap sm:text-lg font-light">
                  Set your target weight (kgs)
                </p>
                <div
                  className={`px-4 border-[1px] py-1 border-primary rounded-full flex items-center`}
                >
                  <Input
                    type="number"
                    value={targetField}
                    disabled={isSubmitting}
                    onChange={(e) => setTargetField(e.target.value)}
                    className="focus-visible:ring-0 w-24 text-xl focus-visible:text-xl focus-visible:border-0 border-0"
                  />
                  <Button
                    onClick={handleUpdateTargetWeight}
                    disabled={isSubmitting}
                    className={`mx-2 px-3 rounded-full bg-success transition-all duration-300 ${
                      targetField.length === 0 && "opacity-0"
                    }`}
                  >
                    <PlusCircle className="ml-auto scale-125" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="mt-12 mb-4 lg:text-xl font-medium">Logged Weights</h3>
          <div className="min-h-48 lg:min-h-64">
            {weights.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="px-4 xl:px-8 h-64 lg:h-96 overflow-y-scroll flex flex-col bg-primary-foreground rounded-xl py-4">
                  <div className="flex flex-col gap-3 lg:gap-5 items-center">
                    {weights.map((weight) => (
                      <div
                        key={weight.id}
                        className="flex w-full items-center justify-between"
                      >
                        <p className="text-xl sm:text-2xl w-16 sm:w-24 font-semibold justify-self-start">
                          {weight.value}{" "}
                          <span className="text-[10px] sm:text-sm font-light">
                            kgs
                          </span>
                        </p>
                        <div className="col-span-2 block sm:ml-auto text-[12px] sm:text-base">
                          <p>{weight.recordedAt.toDateString().slice(4)}</p>
                        </div>
                        <div className="flex items-center gap-1 lg:gap-3 col-span-1 ml-auto">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="secondary"
                                className="rounded-full"
                              >
                                <CalendarIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-col items-center">
                                <p className="my-2 text-sm font-light">
                                  Click set once you are done
                                </p>
                                <Calendar
                                  mode="single"
                                  initialFocus
                                  selected={date}
                                  onSelect={setDate}
                                />
                                <Button
                                  variant="secondary"
                                  onClick={() => handleSetDate(date, weight.id)}
                                >
                                  Set
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <DeletionConfirmation
                            id={weight.id}
                            handleDelete={handleDeleteLoggedWeight}
                            isSubmitting={isSubmitting}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {weights.length > 0 && (
                    <PaginationComponent totalPages={totalPages} />
                  )}
                </div>
                <div className="bg-primary-foreground h-auto rounded-xl overflow-y-scroll">
                  <WeightChart
                    weightLogs={weights}
                    targetWeight={targetWeight}
                  />
                </div>
              </div>
            ) : (
              <div className="h-96 w-full flex flex-col items-center bg-primary-foreground rounded-xl justify-center">
                <p className="text-muted-foreground">
                  You have&apos;t logged your weight yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
