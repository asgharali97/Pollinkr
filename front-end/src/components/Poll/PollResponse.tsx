import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { IconLock, IconAlertCircle } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useGetPublicPoll, useSubmitResponse } from "@/hooks/index";
import { ExpiryBadge } from "./ExpiryBadge";
import { StateCard } from "./StateCard";
import { AuthLoginDialog } from "../AuthLoginDialog";

type Answers = Record<string, string>;
type PageState = "form" | "submitted";

export default function PollResponse() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user); 

  const [answers, setAnswers] = useState<Answers>({});
  const [pageState, setPageState] = useState<PageState>("form");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [socketDisconnected] = useState(false);

  const { data: pollData, isLoading: pollLoading } = useGetPublicPoll(shareId);
  const submitMutation = useSubmitResponse(shareId!);


  if (pollLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading poll...
      </div>
    );
  }

  if (!pollData) {
    return (
      <StateCard
        state="not-available"
        title="Poll not found"
        description="This poll doesn't exist or has been deleted."
        link={{ label: "Back to Pollinkr", href: "/" }}
      />
    );
  }

  if (pollData.status === "draft") {
    return (
      <StateCard
        state="not-available"
        title="Poll not available"
        description="This poll is not yet available for responses."
      />
    );
  }

  if (pollData.status === "expired") {
    return (
      <StateCard
        state="closed"
        title="Poll closed"
        description="This poll is no longer accepting responses. The deadline has passed."
        link={{ label: "Back to Pollinkr", href: "/" }}
      />
    );
  }

  if (pollData.status === "published") {
    return (
      <StateCard
        state="published"
        title="Results published"
        description="This poll has been completed and results are now public."
        button={
          <button
            onClick={() => navigate(`/p/${shareId}/results`)}
            className="px-6 py-2.5 rounded-xl bg-primary text-background text-sm font-medium shadow-m cursor-pointer active:scale-[0.995] hover:shadow-s ring-1 ring-primary/90 "
          >
            View results
          </button>
        }
      />
    );
  }

  const requiresAuth = !pollData.isAnonymous;
  const userNotLoggedIn = !user;
  const isBlocked = requiresAuth && userNotLoggedIn;

  if (isBlocked) {
    return (
      <>
        <StateCard
          state="auth-required"
          title="Sign in required"
          description="This poll only accepts responses from signed-in users. Sign in to view the questions and submit your answers."
          pollInfo={{
            title: pollData.title,
            description: pollData.description,
            expiresAt: pollData.expiresAt,
          }}
          blurred
          button={
            <AuthLoginDialog
              trigger={
                <button className="px-6 py-2.5 rounded-xl bg-primary text-background text-sm font-medium shadow-m cursor-pointer active:scale-[0.995] hover:shadow-s ring-1 ring-primary/90 ">
                  Sign in
                </button>
              }
            />
          }
        />
      </>
    );
  }

  if (pageState === "submitted") {
    return (
      <StateCard
        state="submitted"
        title="Response submitted"
        description="Your answers for"
        pollTitle={pollData.title}
        link={{ label: "Back to Pollinkr", href: "/" }}
      />
    );
  }

  const unansweredMandatory = pollData.questions
    .filter((q) => q.mandatory && !answers[q.id])
    .map((q) => q.id);

  const handleSubmit = async () => {
    if (unansweredMandatory.length > 0) {
      setValidationError(
        `Please answer all required questions before submitting.`,
      );
      const el = document.getElementById(`question-${unansweredMandatory[0]}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    try {
      const payload = {
        responses: Object.entries(answers).map(
          ([questionId, selectedOptionId]) => ({
            questionId,
            selectedOptionId,
          }),
        ),
      };

      await submitMutation.mutateAsync(payload);
      setPageState("submitted");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Could not submit response";

      if (message.toLowerCase().includes("expired")) {
        toast.error(
          "This poll has expired and is no longer accepting responses",
        );
      } else if (message.toLowerCase().includes("published")) {
        toast.error("Results for this poll have been published");
      } else if (message.toLowerCase().includes("already submitted")) {
        toast.error("You have already submitted a response to this poll");
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = pollData.questions.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-background font-sans">
      {socketDisconnected && (
        <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-2">
          <p className="text-xs text-amber-800">
            Connection unstable. Your response is still being tracked
            locally.
          </p>
        </div>
      )}

      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Pollinkr
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{totalCount} answered
            </span>
            <div className="w-24 h-1 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <ExpiryBadge expiresAt={pollData.expiresAt} />
            {pollData.isAnonymous && (
              <span className="text-xs text-muted-foreground">
                Your response is anonymous
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            {pollData.title}
          </h1>
          {pollData.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pollData.description}
            </p>
          )}
        </div>

        <div className="space-y-5">
          {pollData.questions.map((q, i) => {
            const isUnanswered = unansweredMandatory.includes(q.id);
            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`rounded-xl border p-6 transition-colors ${
                  isUnanswered
                    ? "border-red-300 bg-red-50/30"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {q.text}
                  </p>
                  {!q.mandatory && (
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      Optional
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                          setValidationError(null);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all cursor-pointer ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:border-foreground/30"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                              selected
                                ? "border-background bg-background"
                                : "border-border"
                            }`}
                          >
                            {selected && (
                              <span className="w-2 h-2 rounded-full bg-foreground" />
                            )}
                          </span>
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isUnanswered && (
                  <p className="flex items-center gap-1.5 text-xs text-red-500 mt-3">
                    <IconAlertCircle size={12} />
                    This question is required
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {validationError && (
          <div className="mt-6 flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <IconAlertCircle size={15} />
            {validationError}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {pollData.isAnonymous ? (
              <span className="flex items-center gap-1">
                <IconLock size={11} />
                Anonymous · not linked to your identity
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <IconLock size={11} />
                Authenticated · your identity will be recorded
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || submitMutation.isPending}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              submitting || submitMutation.isPending
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {submitting || submitMutation.isPending
              ? "Submitting..."
              : "Submit response"}
          </button>
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
