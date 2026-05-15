import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconBolt,
  IconChartBar,
  IconCircleCheck,
  IconClock,
  IconShare2,
} from "@tabler/icons-react";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import api from "@/lib/api";

type PollStatus = "active" | "expired" | "published" | "draft";

type AnalyticsData = {
  poll: {
    id: string;
    shareId: string;
    title: string;
    status: PollStatus;
    expiresAt: string | null;
    totalResponses: number;
    isAnonymous: boolean;
    participationRate: number;
  };
  questions: {
    id: string;
    text: string;
    mandatory: boolean;
    totalAnswers: number;
    options: { key: string; label: string; count: number }[];
  }[];
};

const OPTION_COLORS = ["#171717", "#404040", "#737373", "#a3a3a3"];

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [liveIndicator, setLiveIndicator] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get(`/polls/${id}/analytics`);
        setData(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Could not load analytics");
      }
    };

    fetchAnalytics();
  }, [id]);

  useEffect(() => {
    if (!data?.poll.id) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        (import.meta.env.PROD ? window.location.origin : "http://localhost:4000"),
      { withCredentials: true }
    );

    socket.emit("poll:join", data.poll.id);
    socket.on("poll:update", (payload: AnalyticsData) => {
      setData(payload);
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 800);
    });

    return () => {
      socket.emit("poll:leave", data.poll.id);
      socket.disconnect();
    };
  }, [data?.poll.id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  const timeLeft = getTimeLeft(data.poll.expiresAt);
  const participationRate = data.poll.participationRate;
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

  const publishResults = async () => {
    try {
      const response = await api.post(`/polls/${id}/publish-results`);
      setData(response.data.data);
      toast.success("Results published");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not publish results");
    }
  };

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
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/p/${data.poll.shareId}`);
                toast.success("Share link copied");
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-m text-sm text-muted-foreground hover:text-foreground hover:shadow-black/5 hover:ring-1 ring-black/10 transition-colors cursor-pointer"
            >
              <IconShare2 size={13} />
              Share link
            </button>
            {data.poll.status !== "published" && (
              <button
                onClick={publishResults}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <IconCircleCheck size={13} />
                Publish results
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Total responses"
            value={data.poll.totalResponses}
            live={liveIndicator}
          />
          <StatCard label="Participation rate" value={`${participationRate}%`} />
          <StatCard label="Questions" value={data.questions.length} />
        </div>

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
              <div key={q.id} className="rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6">
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
                    const pct = q.totalAnswers === 0 ? 0 : Math.round((opt.count / q.totalAnswers) * 100);
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
                            style={{ width: `${pct}%`, background: OPTION_COLORS[idx] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {topOption && (
                  <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                    <IconChartBar size={13} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Leading answer:{" "}
                      <span className="text-foreground font-medium">{topOption.label}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6">
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

function StatCard({
  label,
  value,
  live,
}: {
  label: string;
  value: string | number;
  live?: boolean;
}) {
  return (
    <div className="rounded-xl bg-card shadow-m ring-1 ring-black/5 py-4 px-5">
      <p
        className={`text-2xl font-semibold tracking-tight flex items-center gap-2 transition-colors ${
          live ? "text-emerald-600" : "text-foreground"
        }`}
      >
        {value}
        {live && (
          <span className="text-xs font-normal flex items-center gap-1 text-emerald-500">
            <IconBolt size={11} />
            Live
          </span>
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function getTimeLeft(expiresAt: string | null) {
  if (!expiresAt) return "No expiry";
  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days}d remaining`;
}

function StatusBadge({ status }: { status: PollStatus }) {
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
