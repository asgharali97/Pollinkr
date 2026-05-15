import { useParams, Link } from "react-router-dom";
import { IconChartBar, IconUsers, IconClock, IconLock } from "@tabler/icons-react";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";

const MOCK_RESULTS = {
  poll: {
    title: "Q3 Product Feedback — Feature Prioritization",
    description: "Help us understand what matters most to you.",
    publishedAt: "2025-07-15T10:00:00Z",
    totalResponses: 142,
    isAnonymous: true,
    creator: "Alex Johnson",
  },
  questions: [
    {
      id: "q1",
      text: "Which feature would have the biggest impact on your workflow?",
      mandatory: true,
      totalAnswers: 142,
      options: [
        { key: "export", label: "Bulk export to CSV", count: 48 },
        { key: "api", label: "API access", count: 39 },
        { key: "collab", label: "Team collaboration", count: 33 },
        { key: "mobile", label: "Mobile app", count: 22 },
      ],
    },
    {
      id: "q2",
      text: "How often do you currently use the product?",
      mandatory: true,
      totalAnswers: 142,
      options: [
        { key: "daily", label: "Daily", count: 61 },
        { key: "weekly", label: "Few times a week", count: 44 },
        { key: "once", label: "Once a week", count: 25 },
        { key: "rarely", label: "Rarely", count: 12 },
      ],
    },
    {
      id: "q3",
      text: "What is your primary use case?",
      mandatory: false,
      totalAnswers: 98,
      options: [
        { key: "internal", label: "Internal feedback", count: 42 },
        { key: "customer", label: "Customer research", count: 31 },
        { key: "event", label: "Event planning", count: 15 },
        { key: "other", label: "Other", count: 10 },
      ],
    },
  ],
};

const OPTION_COLORS = ["#171717", "#404040", "#737373", "#a3a3a3"];

export default function PublishedResults() {
  const { id } = useParams();
  const data = MOCK_RESULTS;

  const publishedDate = new Date(data.poll.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pieData = data.questions.map((q, i) => ({
    question: `Q${i + 1}`,
    responses: q.totalAnswers,
  }));

  const pieConfig: ChartConfig = Object.fromEntries(
    data.questions.map((_, i) => [
      `Q${i + 1}`,
      {
        label: `Q${i + 1}`,
        colors: { light: [OPTION_COLORS[i]], dark: [OPTION_COLORS[i]] },
      },
    ])
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Top bar */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
            Pollinkr
          </Link>
          <div className="text-xs h-8 w-[7.8rem] flex justify-center items-center p-1 bg-muted rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5">
            <span className="h-full w-full bg-background rounded-lg py-1 px-2 shadow-m">
            Results published
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Poll header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            {data.poll.title}
          </h1>
          {data.poll.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {data.poll.description}
            </p>
          )}
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconUsers size={12} />
              {data.poll.totalResponses} responses
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconClock size={12} />
              Published {publishedDate}
            </span>
            {data.poll.isAnonymous && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconLock size={12} />
                Anonymous
              </span>
            )}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card px-4 py-3 text-center">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {data.poll.totalResponses}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Total responses</p>
          </div>
          <div className="rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card px-4 py-3 text-center">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {data.questions.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Questions</p>
          </div>
          <div className="rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card px-4 py-3 text-center">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {data.questions.filter((q) => q.mandatory).length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Required</p>
          </div>
        </div>

        {/* Question results */}
        <div className="space-y-5">
          <p className="text-sm font-medium text-foreground">Results by question</p>

          {data.questions.map((q, i) => {
            const topOption = [...q.options].sort((a, b) => b.count - a.count)[0];
            const topPct = Math.round((topOption.count / q.totalAnswers) * 100);

            const barData = [
              Object.fromEntries([
                ["question", `Q${i + 1}`],
                ...q.options.map((o) => [o.key, o.count]),
              ]),
            ];

            const barConfig: ChartConfig = Object.fromEntries(
              q.options.map((o, idx) => [
                o.key,
                {
                  label: o.label,
                  colors: {
                    light: [OPTION_COLORS[idx]],
                    dark: [OPTION_COLORS[idx]],
                  },
                },
              ])
            );

            return (
              <div key={q.id} className="rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Q{i + 1} · {q.mandatory ? "Required" : "Optional"}
                    </p>
                    <p className="text-sm font-medium text-foreground">{q.text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-semibold text-foreground">{q.totalAnswers}</p>
                    <p className="text-xs text-muted-foreground">responses</p>
                  </div>
                </div>

                {/* Bar chart */}
                <div className="h-44 mb-5">
                  <EvilBarChart
                    className="h-full w-full"
                    xDataKey="question"
                    barVariant="default"
                    data={barData}
                    chartConfig={barConfig}
                  />
                </div>

                {/* Option rows */}
                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    const pct = Math.round((opt.count / q.totalAnswers) * 100);
                    const isWinner = opt.key === topOption.key;
                    return (
                      <div key={opt.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${isWinner ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {opt.label}
                            {isWinner && (
                              <span className="ml-2 text-xs text-muted-foreground font-normal">
                                · winner
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {opt.count} · {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: OPTION_COLORS[idx],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Winner callout */}
                <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                  <IconChartBar size={13} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">{topOption.label}</span>
                    {" "}won with {topPct}% of votes
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie chart */}
        <div className="mt-5 rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">Overall distribution</p>
          <p className="text-xs text-muted-foreground mb-4">
            How responses were spread across questions
          </p>
          <div className="h-52">
            <EvilPieChart
              isClickable
              className="h-full w-full"
              data={pieData}
              dataKey="responses"
              nameKey="question"
              chartConfig={pieConfig}
            />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Powered by{" "}
          <Link to="/" className="hover:text-foreground transition-colors">
            Pollinkr
          </Link>
        </p>
      </div>
    </div>
  );
}