import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { ChartData } from "~/lib/interfaces";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Weight } from "@prisma/client";
const chartConfig = {
  value: {
    label: "Weight",
  },
  mobile: {
    label: "Weight",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  weightLogs: Weight[];
  targetWeight?: number;
};

export default function WeightChart({ weightLogs, targetWeight }: Props) {
  let maxWeight = 0;
  const chartData: ChartData[] = weightLogs.map((weight) => {
    maxWeight = Math.max(maxWeight, weight.value);
    const weightDetails = {
      value: weight.value,
      recordedAt: weight.recordedAt.toDateString(),
    };
    return weightDetails;
  });
  chartData.reverse();

  const chartWidth: number | "auto" =
    chartData.length * 80 > 480 ? chartData.length * 80 : "auto";

  return (
    <Card className="h-[250px] lg:h-full pt-4 lg:pt-12">
      <ScrollArea className="h-full w-auto">
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
                domain={[
                  30,
                  targetWeight ? Math.max(maxWeight, targetWeight) : maxWeight,
                ]}
              />
              <ChartTooltip
                cursor={false}
                label="Weight"
                content={
                  <ChartTooltipContent className="w-36" labelKey="value" />
                }
              />
              {targetWeight && (
                <ReferenceLine
                  y={targetWeight}
                  label="Target Weight"
                  strokeDasharray="3 3"
                />
              )}
              <defs className="p-3">
                <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillWeight)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
}
