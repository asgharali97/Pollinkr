import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconChartBar,
  IconClock,
  IconShare2,
  IconBolt,
  IconCircleCheck,
} from "@tabler/icons-react";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";

const MOCK_ANALYTICS = {
  poll: {
    id: "1",
    title: "Q3 Product Feedback — Feature Prioritization",
    status: "active" as const,
    expiresAt: "2025-08-20T23:59:00Z",
    totalResponses: 142,
    isAnonymous: true,
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

export default function Analytics() {
  const { id } = useParams();
  const data = MOCK_ANALYTICS;

  const [liveCount, setLiveCount] = useState(data.poll.totalResponses);
  const [liveIndicator, setLiveIndicator] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + Math.floor(Math.random() * 3));
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timeLeft = (() => {
    const diff = new Date(data.poll.expiresAt).getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Closed";
    if (days === 0) return "Closes today";
    return `${days}d remaining`;
  })();

  const participationRate = Math.round(
    (data.questions.reduce((a, q) => a + q.totalAnswers, 0) /
      (data.questions.length * liveCount)) *
      100
  );

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
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-start justify-between mb-10">
          <div>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <IconArrowLeft size={13} />
              Dashboard
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
              {data.poll.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <StatusBadge status={data.poll.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconClock size={11} />
                {timeLeft}
              </span>
              {data.poll.isAnonymous && (
                <span className="text-xs text-muted-foreground">Anonymous</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.origin}/p/${id}`)
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-m text-sm text-muted-foreground hover:text-foreground hover:shadow-black/5 hover:ring-1 ring-black/10  transition-colors cursor-pointer"
            >
              <IconShare2 size={13} />
              Share link
            </button>
            {data.poll.status === "expired" && (
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity">
                <IconCircleCheck size={13} />
                Publish results
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl bg-card shadow-m sadow-black/5 ring-1 ring-black/5 py-4 px-5">
            <p
              className={`text-2xl font-semibold tracking-tight flex items-center gap-2 transition-colors ${
                liveIndicator ? "text-emerald-600" : "text-foreground"
              }`}
            >
              {liveCount}
              <span
                className={`text-xs font-normal flex items-center gap-1 ${
                  liveIndicator ? "text-emerald-500" : "text-muted-foreground"
                }`}
              >
                <IconBolt size={11} />
                Live
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Total responses</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {participationRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Participation rate</p>
          </div>
          <div className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {data.questions.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Questions</p>
          </div>
        </div>

        {/* Question breakdowns */}
        <div className="space-y-6">
          <p className="text-sm font-medium text-foreground">Question breakdown</p>

          {data.questions.map((q, i) => {
            const topOption = [...q.options].sort((a, b) => b.count - a.count)[0];

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
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Q{i + 1} · {q.mandatory ? "Required" : "Optional"}
                    </p>
                    <p className="text-sm font-medium text-foreground">{q.text}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-foreground">{q.totalAnswers}</p>
                    <p className="text-xs text-muted-foreground">responses</p>
                  </div>
                </div>

                <div className="h-48 mb-6">
                  <EvilBarChart
                    className="h-full w-full"
                    xDataKey="question"
                    barVariant="default"
                    data={barData}
                    chartConfig={barConfig}
                  />
                </div>

                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    const pct = Math.round((opt.count / q.totalAnswers) * 100);
                    return (
                      <div key={opt.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-foreground">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {opt.count} · {pct}%
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
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

                <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                  <IconChartBar size={13} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Leading answer:{" "}
                    <span className="text-foreground font-medium">{topOption.label}</span>
                    {" "}with {Math.round((topOption.count / q.totalAnswers) * 100)}% of votes
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie chart */}
        <div className="mt-6 rounded-xl shadow-m sadow-black/5 ring-1 ring-black/5 bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">Response distribution</p>
          <p className="text-xs text-muted-foreground mb-4">
            Responses spread across all questions
          </p>
          <div className="h-56">
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

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "expired" | "published" | "draft" }) {
  const config = {
    active: "bg-emerald-50 text-emerald-700",
    expired: "bg-amber-50 text-amber-700",
    published: "bg-blue-50 text-blue-700",
    draft: "bg-neutral-100 text-neutral-500",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}