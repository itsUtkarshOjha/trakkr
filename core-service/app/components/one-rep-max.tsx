import { useSearchParams } from "@remix-run/react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { ChartData, ExerciseWithOneRepMax } from "~/lib/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
const chartConfig = {
  value: {
    label: "One Rep Max",
  },
  mobile: {
    label: "One Rep Max",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  exercisesWithOneRepMaxes: ExerciseWithOneRepMax[];
};

export default function OneRepMaxChart({ exercisesWithOneRepMaxes }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const exercise =
    searchParams.get("exercise") || exercisesWithOneRepMaxes[0].exerciseName;
  const [targetExercise] = exercisesWithOneRepMaxes.filter(
    (listedExercise) => listedExercise.exerciseName === exercise
  );
  const chartData: ChartData[] = targetExercise.oneRepMaxes.map((detail) => {
    const oneRepMaxDetails = {
      value: detail.oneRepMax,
      recordedAt: detail.recordedAt.toDateString(),
    };
    return oneRepMaxDetails;
  });

  const chartWidth = Math.max(chartData.length * 80, 400);

  const handleSetExercise = (value: string) => {
    setSearchParams((prev) => {
      prev.set("exercise", value);
      return prev;
    });
  };

  return (
    <Card className="h-[350px] lg:min-h-[450px] lg:max-h-[450px] overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-sm lg:text-base flex items-center gap-3 font-medium text-nowrap">
          Progression of{" "}
          <Select
            name="exercise"
            onValueChange={(value) => handleSetExercise(value)}
            defaultValue={exercise}
          >
            <SelectTrigger className="w-[150px] lg:w-[250px]">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent className="space-x-3">
              {exercisesWithOneRepMaxes.map((exercise) => (
                <SelectItem
                  key={exercise.exerciseId}
                  value={exercise.exerciseName}
                  className="cursor-pointer"
                >
                  {exercise.exerciseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="w-auto">
        <CardContent style={{ width: chartWidth }}>
          <ChartContainer
            config={chartConfig}
            className="h-[200px] lg:h-[300px] mx-auto my-4 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 8,
                top: 5,
              }}
              width={1000}
            >
              <CartesianGrid vertical={false} horizontal={false} className="" />
              <XAxis
                dataKey="recordedAt"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(4, 10)}
                minTickGap={16}
              />
              <YAxis
                dataKey="value"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                label="One Rep Max"
                content={
                  <ChartTooltipContent className="w-36" labelKey="value" />
                }
              />
              <defs className="p-3">
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
                label="One Rep Max"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
}
