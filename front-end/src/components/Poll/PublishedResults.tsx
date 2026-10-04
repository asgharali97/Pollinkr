import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IconClock,
  IconLock,
  IconUsers,
  IconAlertCircle,
  IconChevronLeft,
} from "@tabler/icons-react";
import StatusBadge from "../StatusBadge";
import { AnalyticsOverview } from "./analytics/AnalyticsOverview";
import { useGetPublicPoll } from "@/hooks/index";
import { QuestionResult } from "./analytics/QuestionResult";
import { useAuthStore } from "@/store/auth.store";

export default function PublishedResults() {
  const { shareId } = useParams();
  const { data: poll, isLoading, isError } = useGetPublicPoll(shareId);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const handleBack = () => {
    if (window.history.state && typeof window.history.state.idx === "number" && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(user ? "/dashboard" : "/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading results...
      </div>
    );
  }
 
  if (isError || !poll) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
            <IconAlertCircle size={24} className="text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Results not available
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            This poll's results are not yet published or don't exist.
          </p>
          <button
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Back to Pollinkr
          </button>
        </div>
      </div>
    );
  }

  const { questions } = poll;

  const publishedDate = poll.publishedAt
    ? new Date(poll.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "recently";

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="mx-auto max-w-4xl px-6 h-12 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Pollinkr
          </Link>
          <button
            onClick={handleBack}
            className={`p-0.5 rounded-xl bg-linear-to-b from-white to-stone-200/40 shadow-card active:shadow-m active:scale-[0.995] cursor-pointer`}
          >
            <div className="bg-linear-to-b from-stone-200/40 to-white/80 rounded-[10px] py-1 px-2 flex gap-0.5 items-center">
              <IconChevronLeft className="size-4 text-foreground/90" />
              <span className={`font-normal text-sm text-foreground/80`}>
                Back
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap">
            <StatusBadge status={poll.status} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {poll.description}
            </p>
          )}
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconUsers size={12} />
              {poll.totalResponses} responses
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconClock size={12} />
              Published {publishedDate}
            </span>
            {poll.anonymous && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <IconLock size={12} />
                Anonymous
              </span>
            )}
          </div>
        </div>

        <div className="mb-10">
          <AnalyticsOverview
            totalResponses={poll.totalResponses}
            completionRate={poll.participationRate}
            questionCount={questions.length}
          />
        </div>

        <div className="space-y-5">
          <p className="text-sm font-medium text-foreground">
            Results by question
          </p>
          <div className="flex flex-col gap-4">
            {questions.map((question, index) => (
              <QuestionResult
              key={question.id}
              // @ts-expect-error TODO fix
              question={question}
                index={index}
                totalResponses={poll.totalResponses}
              />
            ))}
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
