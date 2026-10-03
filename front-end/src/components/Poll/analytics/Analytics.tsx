import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconBrandTelegram,
  IconClock,
  IconShare2,
} from "@tabler/icons-react";
import { useGetAnalytics, usePublishResults } from "@/hooks";
import { useAuthStore } from "@/store/auth.store";
import type { PollAnalytics } from "@/types/index";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { QuestionResult } from "./QuestionResult";
import { getTimeLeft } from "./analytics.utils";
import DraftView from "./DraftView";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/Button";

export default function Analytics({ pollId }: { pollId?: string | null }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, error } = useGetAnalytics(pollId ?? undefined);
  const publishMutation = usePublishResults(pollId ?? undefined);

  const [liveOverride, setLiveOverride] = useState<{
    pollId: string;
    data: PollAnalytics;
  } | null>(null);
  const [liveIndicator, setLiveIndicator] = useState(false);
  const [socketDisconnected, setSocketDisconnected] = useState(false);

  const analyticsData =
    pollId && liveOverride?.pollId === pollId
      ? liveOverride.data
      : ((data as PollAnalytics | undefined) ?? null);

  useEffect(() => {
    if (analyticsData && analyticsData.poll.creatorId !== user?.id) {
      toast.error("Access denied");
      navigate(`/p/${analyticsData.poll.shareId}`, { replace: true });
    }
  }, [analyticsData, user, navigate]);

  useEffect(() => {
    if (!analyticsData?.poll.id) return;
    if (
      analyticsData.poll.status !== "active" &&
      analyticsData.poll.status !== "expired"
    ) {
      return;
    }

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        (import.meta.env.PROD
          ? window.location.origin
          : "http://localhost:4000"),
      { withCredentials: true },
    );

    socket.on("connect", () => setSocketDisconnected(false));
    socket.on("disconnect", () => setSocketDisconnected(true));
    socket.on("connect_error", () => setSocketDisconnected(true));

    socket.emit("poll:join", analyticsData.poll.id);

    socket.on("poll:update", (payload: PollAnalytics) => {
      setLiveOverride({ pollId: payload.poll.id, data: payload });
      setLiveIndicator(true);
      window.setTimeout(() => setLiveIndicator(false), 800);
    });

    return () => {
      socket.emit("poll:leave", analyticsData.poll.id);
      socket.disconnect();
    };
  }, [analyticsData?.poll.id, analyticsData?.poll.status]);

  if (!pollId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h1 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Select a poll from the dashboard to view its analytics.
          </p>
          <Link
            to="/dashboard"
            className="text-sm text-foreground underline-offset-4 hover:underline"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-sm text-muted-foreground">
        <div className="text-center">
          <p className="mb-4">Could not load analytics</p>
          <Link
            to="/dashboard"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !analyticsData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  if (analyticsData.poll.status === "draft") {
    return <DraftView poll={analyticsData.poll} />;
  }

  const handlePublishResults = async () => {
    try {
      const result = await publishMutation.mutateAsync();
      if (result.poll && pollId) {
        const base =
          (liveOverride?.pollId === pollId ? liveOverride.data : null) ??
          (data as PollAnalytics | undefined) ??
          null;
        if (base) {
          setLiveOverride({
            pollId,
            data: {
              ...base,
              poll: { ...base.poll, status: "published" },
            },
          });
        }
      }
      toast.success("Results published");
    } catch (publishError: unknown) {
      const message =
        publishError &&
        typeof publishError === "object" &&
        "response" in publishError
          ? (publishError as { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;
      toast.error(message || "Could not publish results");
    }
  };

  const { poll, questions } = analyticsData;

  return (
    <div className="font-sans">
      {socketDisconnected && (
        <div className="border-b shadow-m bg-accent px-6 py-2">
          <p className="text-xs text-muted-foreground">
            Real-time updates unavailable. Refresh the page to see the latest
            data.
          </p>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Link
              to="/dashboard"
              className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft size={13} aria-hidden />
              Dashboard
            </Link>
            <h1 className="mb-1 text-xl font-semibold tracking-tight text-pretty text-foreground">
              {poll.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusBadge status={poll.status} />
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconClock size={11} aria-hidden />
                {getTimeLeft(poll.expiresAt)}
              </span>
              {poll.anonymous && (
                <span className="text-xs text-muted-foreground">Anonymous</span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {poll.status === "active" && (
              <Button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `${window.location.origin}/p/${poll.shareId}`,
                  );
                  toast.success("Share link copied");
                }}
                childClassName="flex items-center gap-2 text-foreground/90"
              > 
                <IconShare2 size={12} />
                Share link
              </Button>
            )}

            {poll.status === "expired" && (
              <Button
                type="button"
                onClick={() => void handlePublishResults()}
                disabled={publishMutation.isPending}
                childClassName="flex items-center gap-2 text-foreground/90"
              >
                  <IconBrandTelegram size={12} />
                  {publishMutation.isPending
                    ? "Publishing..."
                    : "Publish results"}
              </Button>
            )}

            {poll.status === "published" && (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/p/${poll.shareId}/results`,
                    );
                    toast.success("Results link copied");
                  }}
                  childClassName="flex items-center gap-2 text-foreground/90"
                >
                  <IconShare2 size={12} />
                  Share results
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(`/p/${poll.shareId}/results`)}
                  childClassName="flex items-center gap-2 text-foreground/90"
                >
                  View public results
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="space-y-8">
          <AnalyticsOverview
            totalResponses={poll.totalResponses}
            completionRate={poll.participationRate}
            questionCount={questions.length}
            live={liveIndicator}
          />


          <section
            aria-labelledby="question-results-heading"
            className="space-y-4"
          >
            <h2
              id="question-results-heading"
              className="text-sm font-medium text-foreground"
            >
              Question results
            </h2>

            <div className="flex flex-col gap-4">
              {questions.map((question, index) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  index={index}
                  totalResponses={poll.totalResponses}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
