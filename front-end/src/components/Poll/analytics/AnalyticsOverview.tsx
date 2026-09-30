import { IconBolt } from "@tabler/icons-react";

type OverviewStat = {
  label: string;
  value: string | number;
};

type AnalyticsOverviewProps = {
  totalResponses: number;
  completionRate: number;
  questionCount: number;
  live?: boolean;
};

export function AnalyticsOverview({
  totalResponses,
  completionRate,
  questionCount,
  live = false,
}: AnalyticsOverviewProps) {
  const stats: OverviewStat[] = [
    { label: "Total responses", value: totalResponses },
    { label: "Completion rate", value: `${completionRate}%` },
    { label: "Questions", value: questionCount },
  ];

  return (
    <section aria-labelledby="analytics-overview-heading">
      <h2 id="analytics-overview-heading" className="sr-only">
        Overview
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card px-5 py-4 shadow-card"
          >
            <p
              className={`flex items-center gap-2 text-2xl font-semibold tracking-tight transition-colors ${
                live && index === 0 ? "text-emerald-600" : "text-foreground"
              }`}
            >
              <span className="tabular-nums">{stat.value}</span>
              {live && index === 0 && (
                <span className="flex items-center gap-1 text-xs font-normal text-emerald-500">
                  <IconBolt size={11} aria-hidden />
                  Live
                </span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
