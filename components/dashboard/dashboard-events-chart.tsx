"use client";

import { FC } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { getEventsStats } from "@/actions/dashboard";

interface DashboardEventsChartProps {
  data: Awaited<ReturnType<typeof getEventsStats>>;
}

const DashboardEventsChart: FC<DashboardEventsChartProps> = ({ data }) => {
  const chartConfig: ChartConfig = {
    success: {
      label: "Success",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
      <AreaChart
        data={data}
        height={200}
        accessibilityLayer
        margin={{ top: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={"date"}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <ChartTooltip content={<ChartTooltipContent className="w-[250px]" />} />
        <Area
          dataKey="success"
          min={0}
          type="bump"
          fill="var(--color-success)"
          fillOpacity={0.6}
          stroke="var(--color-success)"
          stackId="a"
        />
        <Area
          dataKey="failed"
          min={0}
          type="bump"
          fill="var(--color-failed)"
          fillOpacity={0.6}
          stroke="var(--color-failed)"
          stackId="b"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default DashboardEventsChart;
