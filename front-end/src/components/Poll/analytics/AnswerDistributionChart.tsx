import { useMemo } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/evilcharts/ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/evilcharts/ui/tooltip";
import type { AnalyticsOption } from "@/types/index";
import { rankAnswers } from "./analytics.utils";

type AnswerDistributionChartProps = {
  options: AnalyticsOption[];
};

type ChartRow = {
  key: string;
  label: string;
  count: number;
  percentage: number;
  fill: string;
};

const chartConfig = {
  count: {
    label: "Responses",
    colors: {
      light: ["var(--chart-5)"],
      dark: ["var(--chart-1)"],
    },
  },
} satisfies ChartConfig;

export function AnswerDistributionChart({
  options,
}: AnswerDistributionChartProps) {
  const ranked = useMemo(() => rankAnswers(options), [options]);

  const data: ChartRow[] = useMemo(
    () =>
      ranked.map((answer) => ({
        key: answer.key,
        label: answer.label,
        count: answer.count,
        percentage: answer.percentage,
        fill: answer.color,
      })),
    [ranked],
  );

  const chartHeight = Math.max(148, data.length * 42);

  if (data.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No options
      </p>
    );
  }
  console.log(data)
  return (
    <div className="space-y-4">
      <div
        className="w-full min-w-0"
        style={{ height: chartHeight }}
        role="img"
        aria-label="Answer distribution chart"
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-auto! h-full w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
            barCategoryGap="20%"
          >
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="label"
              width={100}
              tickLine={true}
              axisLine={true}
              tickMargin={20}
              tick={{ fontSize: 12 }}
              interval={0}
              className='border text-red-200'
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => {
                    const row = item.payload as ChartRow | undefined;
                    return (
                      <div className="flex w-full items-center justify-between gap-4 leading-none">
                        <span className="text-muted-foreground">
                          {row?.label ?? "Responses"}
                        </span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {Number(value).toLocaleString()}
                          {row ? ` · ${row.percentage}%` : ""}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="count" radius={4} maxBarSize={26}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <ul className="space-y-1" aria-label="Answer counts">
        {ranked.map((answer) => (
          <li
            key={answer.key}
            className="flex items-baseline justify-between gap-3 text-xs p-1 hover:bg-muted rounded-sm transition-all duration-100 ease-in-out"
          >
            <span className="min-w-0 truncate text-foreground">
              {answer.label}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {answer.count} · {answer.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
