import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { ChartData } from "~/lib/interfaces";
import { WorkoutAnalysis } from "@prisma/client";
const chartConfig = {
  value: {
    label: "Fatigue Index",
  },
  mobile: {
    label: "Fatigue Index",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Props = {
  pastAnalyses: WorkoutAnalysis[];
};

export default function FatigueIndex({ pastAnalyses }: Props) {
  const chartData: ChartData[] = pastAnalyses.map((analysis) => {
    const weightDetails = {
      value: analysis.fatigueIndex as number,
      recordedAt: analysis.createdAt.toDateString(),
    };
    return weightDetails;
  });
  chartData.reverse();
  return (
    <Card className="h-full">
      <CardContent className="w-full sm:w-auto h-full sm:h-auto px-0 py-4 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="sm:mx-auto mt-2 sm:mt-8 w-full sm:w-auto sm:h-auto h-full"
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
              label="Fatigue Index"
              content={
                <ChartTooltipContent className="w-36" labelKey="value" />
              }
            />
            <defs className="p-3">
              <linearGradient id="fillFatigue" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#fillFatigue)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
