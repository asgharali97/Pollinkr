import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { useGetAnalytics, usePublishResults } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";

type PollStatus = "active" | "expired" | "published" | "draft";

type AnalyticsData = {
  poll: {
    id: string;
    shareId: string;
    title: string;
    status: PollStatus;
    creatorId: string;
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
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, error } = useGetAnalytics(id);
  const publishMutation = usePublishResults(id!);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [liveIndicator, setLiveIndicator] = useState(false);
  const [socketDisconnected, setSocketDisconnected] = useState(false);

  // Initialize analytics data from query
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setAnalyticsData(data), 0);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Creator authentication check
  useEffect(() => {
    if (analyticsData && analyticsData.poll.creatorId !== user?.id) {
      toast.error("Access denied");
      navigate(`/p/${analyticsData.poll.shareId}`, { replace: true });
    }
  }, [analyticsData, user, navigate]);

  // Socket.io connection for live updates (only active/expired polls)
  useEffect(() => {
    if (!analyticsData?.poll.id) return;

    // Only connect socket for active and expired polls (they collect responses)
    if (analyticsData.poll.status !== "active" && analyticsData.poll.status !== "expired") {
      return;
    }

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        (import.meta.env.PROD
          ? window.location.origin
          : "http://localhost:4000"),
      { withCredentials: true },
    );

    socket.on("connect", () => {
      setSocketDisconnected(false);
    });

    socket.on("disconnect", () => {
      setSocketDisconnected(true);
    });

    socket.on("connect_error", () => {
      setSocketDisconnected(true);
    });

    socket.emit("poll:join", analyticsData.poll.id);

    socket.on("poll:update", (payload: AnalyticsData) => {
      setAnalyticsData(payload);
      setLiveIndicator(true);
      setTimeout(() => setLiveIndicator(false), 800);
    });

    return () => {
      socket.emit("poll:leave", analyticsData.poll.id);
      socket.disconnect();
    };
  }, [analyticsData?.poll.id, analyticsData?.poll.status]);

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        <div className="text-center">
          <p className="mb-4">Could not load analytics</p>
          <Link to="/dashboard" className="text-foreground hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  // Render per status
  if (analyticsData.poll.status === "draft") {
    return <DraftView poll={analyticsData.poll} />;
  }

  if (analyticsData.poll.status === "published") {
    return <PublishedView poll={analyticsData.poll} />;
  }

  // Active and Expired polls show full analytics
  const timeLeft = getTimeLeft(analyticsData.poll.expiresAt);
  const participationRate = analyticsData.poll.participationRate;
  const pieData = analyticsData.questions.map((q, i) => ({
    question: `Q${i + 1}`,
    responses: q.totalAnswers,
  }));

  const pieConfig: ChartConfig = Object.fromEntries(
    analyticsData.questions.map((_, i) => [
      `Q${i + 1}`,
      {
        label: `Q${i + 1}`,
        colors: { light: [OPTION_COLORS[i]], dark: [OPTION_COLORS[i]] },
      },
    ]),
  );

  const handlePublishResults = async () => {
    try {
      const result = await publishMutation.mutateAsync();
      // Update local state with published data
      if (result.poll) {
        setAnalyticsData((prev) =>
          prev
            ? {
                ...prev,
                poll: { ...prev.poll, status: "published" },
              }
            : null,
        );
      }
      toast.success("Results published");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not publish results");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Socket disconnect banner */}
      {socketDisconnected && (
        <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-3">
          <p className="text-xs text-amber-800">
            ⚠️ Real-time updates unavailable. Refresh the page to see the latest data.
          </p>
        </div>
      )}

      {/* Expired banner */}
      {analyticsData.poll.status === "expired" && (
        <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-3">
          <p className="text-xs text-amber-800">
            ℹ️ This poll has closed and is no longer accepting responses. You can publish results below.
          </p>
        </div>
      )}

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
              {analyticsData.poll.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <StatusBadge status={analyticsData.poll.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconClock size={11} />
                {timeLeft}
              </span>
              {analyticsData.poll.isAnonymous && (
                <span className="text-xs text-muted-foreground">Anonymous</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share link button only on active polls */}
            {analyticsData.poll.status === "active" && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/p/${analyticsData.poll.shareId}`,
                  );
                  toast.success("Share link copied");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-m text-sm text-muted-foreground hover:text-foreground hover:shadow-black/5 hover:ring-1 ring-black/10 transition-colors cursor-pointer"
              >
                <IconShare2 size={13} />
                Share link
              </button>
            )}

            {/* Publish results button only on expired polls */}
            {analyticsData.poll.status === "expired" && (
              <button
                onClick={handlePublishResults}
                disabled={publishMutation.isPending}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconCircleCheck size={13} />
                {publishMutation.isPending ? "Publishing..." : "Publish results"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Total responses"
            value={analyticsData.poll.totalResponses}
            live={liveIndicator}
          />
          <StatCard
            label="Participation rate"
            value={`${participationRate}%`}
          />
          <StatCard label="Questions" value={analyticsData.questions.length} />
        </div>

        <div className="space-y-6">
          <p className="text-sm font-medium text-foreground">
            Question breakdown
          </p>

          {analyticsData.questions.map((q, i) => {
            const topOption = [...q.options].sort(
              (a, b) => b.count - a.count,
            )[0];
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
              ]),
            );

            return (
              <div
                key={q.id}
                className="rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Q{i + 1} · {q.mandatory ? "Required" : "Optional"}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {q.text}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-foreground">
                      {q.totalAnswers}
                    </p>
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
                    const pct =
                      q.totalAnswers === 0
                        ? 0
                        : Math.round((opt.count / q.totalAnswers) * 100);
                    return (
                      <div key={opt.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-foreground">
                            {opt.label}
                          </span>
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

                {topOption && (
                  <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                    <IconChartBar size={13} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Leading answer:{" "}
                      <span className="text-foreground font-medium">
                        {topOption.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6">
          <p className="text-sm font-medium text-foreground mb-1">
            Response distribution
          </p>
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

/**
 * Draft view — no responses yet, offer edit option
 */
function DraftView({ poll }: { poll: AnalyticsData["poll"] }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors justify-center mb-8"
        >
          <IconArrowLeft size={13} />
          Back to dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {poll.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          This poll is still in draft mode. No responses yet.
        </p>
        <Link
          to={`/polls/${poll.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Edit poll
        </Link>
      </div>
    </div>
  );
}

/**
 * Published view — results are locked, read-only
 */
function PublishedView({ poll }: { poll: AnalyticsData["poll"] }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors justify-center mb-8"
        >
          <IconArrowLeft size={13} />
          Back to dashboard
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
          <IconCircleCheck size={24} className="text-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          Results published
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {poll.title} results are now public and locked. No further edits are possible.
        </p>
        <Link
          to={`/p/${poll.shareId}/results`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View published results
        </Link>
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
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${config[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}