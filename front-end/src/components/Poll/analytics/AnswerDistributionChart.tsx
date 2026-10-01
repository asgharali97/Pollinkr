import { useMemo } from "react";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import {
  EvilBarChart,
} from "@/components/evilcharts/charts/bar-chart";
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
      light: ["var(--primary-light-3)"],
      dark: ["var(--primary-light-1)"],
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
  return (
    <div className="space-y-4">
      <div
        className="w-full min-w-0"
        style={{ height: chartHeight }}
        role="img"
        aria-label="Answer distribution chart"
      >
        <EvilBarChart
          chartConfig={chartConfig}
          className="h-full w-full"
          data={data}
          xDataKey="label"
          layout="horizontal"
          barVariant="hatched"
        >
        </EvilBarChart>
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
