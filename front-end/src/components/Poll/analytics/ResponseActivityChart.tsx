import { useMemo } from "react";
import { EvilLineChart } from "@/components/evilcharts/charts/recharts-line-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/recharts-chart";
import { buildResponseActivity } from "./analytics.utils";

type ResponseActivityChartProps = {
  submittedAt: string[];
};

const ACCENT = "oklch(0.671 0.17 180)";

const chartConfig = {
  responses: {
    label: "Responses",
    colors: {
      light: [ACCENT],
      dark: [ACCENT],
    },
  },
} satisfies ChartConfig;

export function ResponseActivityChart({
  submittedAt,
}: ResponseActivityChartProps) {
  const data = useMemo(
    () => buildResponseActivity(submittedAt),
    [submittedAt],
  );

  return (
    <section
      aria-labelledby="response-activity-heading"
      className="rounded-xl bg-card p-5 shadow-card sm:p-6"
    >
      <div className="mb-4">
        <h2
          id="response-activity-heading"
          className="text-sm font-medium text-foreground"
        >
          Responses over time
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          When people responded to this poll
        </p>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No responses yet
        </p>
      ) : (
        <div className="h-56 w-full sm:h-64">
          <EvilLineChart
            data={data}
            config={chartConfig}
            className="aspect-auto! h-full w-full"
            xDataKey="label"
            curveType="monotone"
            animationType="none"
          >
            <EvilLineChart.Grid />
            <EvilLineChart.XAxis dataKey="label" />
            <EvilLineChart.YAxis allowDecimals={false} width={32} />
            <EvilLineChart.Tooltip />
            <EvilLineChart.Line dataKey="responses" strokeWidth={2}>
              <EvilLineChart.Dot variant="border" />
              <EvilLineChart.ActiveDot variant="colored-border" />
            </EvilLineChart.Line>
          </EvilLineChart>
        </div>
      )}

      {data.length > 0 && (
        <p className="sr-only">
          Response activity by day:{" "}
          {data
            .map((point) => `${point.label}: ${point.responses}`)
            .join("; ")}
        </p>
      )}
    </section>
  );
}
