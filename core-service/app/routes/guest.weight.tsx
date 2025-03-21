import { Weight } from "@prisma/client";
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
import { InputError } from "~/lib/Error";
import { useToast } from "~/hooks/use-toast";
import DeletionConfirmation from "~/components/delete-confirm-dialog";
import { MetaFunction } from "@remix-run/node";

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

export const meta: MetaFunction = () => {
  return [
    { title: "Trakkr | Weight Tracker" },
    {
      name: "Weight tracker",
      content: "Track your weight and compare it with your set target weight.",
    },
  ];
};

export default function TrackWeight() {
  const weightCount = weights.length;
  const targetWeight = 75;
  const [date, setDate] = useState<Date>();

  const totalPages = Math.ceil(weightCount / 10);

  return (
    <div className="w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guest/weight">Weight Tracker</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <HeadingSubheading
        heading="Track your weight"
        subheading="You came here empty handed, you'll leave with motivation."
      />
      <div className="mt-8 lg:mt-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 xl:gap-x-12 gap-y-2 items-center">
          <div className="flex items-center justify-center gap-6 rounded-xl bg-primary-foreground px-4 py-4">
            <p className="text-nowrap text-[14px] sm:text-lg font-light">
              Log your weight (kgs)
            </p>
            <div
              className={`px-2 lg:px-4 border-[1px] py-1 border-primary rounded-xl xl:rounded-full flex items-center`}
            >
              <Input
                type="number"
                disabled
                className="focus-visible:ring-0 lg:w-24 lg:text-xl lg:focus-visible:text-xl focus-visible:border-0 border-0"
              />
              <Button
                disabled
                className={`text-sm h-4/5 rounded-full bg-success transition-all duration-300 ${"opacity-0 disabled:opacity-0"}`}
              >
                <PlusCircle className="lg:scale-125" />
              </Button>
            </div>
          </div>
          <div className="rounded-xl bg-primary-foreground px-3 py-4">
            {
              <div className="flex items-center justify-center gap-6">
                <Target size={48} />
                <p className="sm:text-xl">
                  Your target weight is {targetWeight} kgs.
                </p>
                <Edit size={24} className="border-2 cursor-not-allowed" />
              </div>
            }
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
                                <Button variant="secondary" disabled>
                                  Set
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
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
