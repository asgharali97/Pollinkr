import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IconClock, IconLock, IconCircleCheck, IconAlertCircle } from "@tabler/icons-react";

// --- Mock data, replace with API call during wiring ---
const MOCK_POLL = {
  id: "1",
  title: "Q3 Product Feedback — Feature Prioritization",
  description:
    "Help us understand what matters most to you. This takes under 2 minutes.",
  anonymous: true,
  status: "active" as PollStatus,
  expiresAt: "2025-08-20T23:59:00Z",
  creator: "Alex Johnson",
  questions: [
    {
      id: "q1",
      text: "Which feature would have the biggest impact on your workflow?",
      mandatory: true,
      options: [
        { id: "o1", text: "Bulk export to CSV" },
        { id: "o2", text: "API access" },
        { id: "o3", text: "Team collaboration tools" },
        { id: "o4", text: "Mobile app" },
      ],
    },
    {
      id: "q2",
      text: "How often do you currently use the product?",
      mandatory: true,
      options: [
        { id: "o5", text: "Daily" },
        { id: "o6", text: "A few times a week" },
        { id: "o7", text: "Once a week" },
        { id: "o8", text: "Rarely" },
      ],
    },
    {
      id: "q3",
      text: "What is your primary use case?",
      mandatory: false,
      options: [
        { id: "o9", text: "Internal team feedback" },
        { id: "o10", text: "Customer research" },
        { id: "o11", text: "Event planning" },
        { id: "o12", text: "Other" },
      ],
    },
  ],
};

type PollStatus = "active" | "expired" | "published";
type Answers = Record<string, string>;
type PageState = "form" | "submitted";

export default function PollResponse() {
  const { shareId } = useParams();
  const poll = MOCK_POLL; // replace with usePoll(shareId) hook during wiring

  const [answers, setAnswers] = useState<Answers>({});
  const [pageState, setPageState] = useState<PageState>("form");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (poll.status === "expired") return <PollClosed />;
  if (poll.status === "published") return <PollPublished />;

  const unansweredMandatory = poll.questions
    .filter((q) => q.mandatory && !answers[q.id])
    .map((q) => q.id);

  const handleSubmit = async () => {
    if (unansweredMandatory.length > 0) {
      setValidationError(
        `Please answer all required questions before submitting.`
      );
      const el = document.getElementById(`question-${unansweredMandatory[0]}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setValidationError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000)); // replace with API call
    setSubmitting(false);
    setPageState("submitted");
  };

  if (pageState === "submitted") return <SubmittedState pollTitle={poll.title} />;

  const answeredCount = Object.keys(answers).length;
  const totalCount = poll.questions.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
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
            <ExpiryBadge expiresAt={poll.expiresAt} />
            {poll.anonymous && (
              <span className="text-xs text-muted-foreground">
                Your response is anonymous
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {poll.description}
            </p>
          )}
        </div>

        <div className="space-y-5">
          {poll.questions.map((q, i) => {
            const isUnanswered = unansweredMandatory.includes(q.id);
            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`rounded-xl border p-6 transition-colors ${
                  isUnanswered ? "border-red-300 bg-red-50/30" : "border-border bg-card"
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
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
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
            {poll.anonymous ? (
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
            disabled={submitting}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              submitting
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {submitting ? "Submitting..." : "Submit response"}
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

function ExpiryBadge({ expiresAt }: { expiresAt: string }) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const label =
    days === 0 ? "Closes today" : days === 1 ? "Closes tomorrow" : `Closes in ${days}d`;

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <IconClock size={11} />
      {label}
    </span>
  );
}

function SubmittedState({ pollTitle }: { pollTitle: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
          <IconCircleCheck size={24} className="text-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          Response submitted
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Your answers for <span className="text-foreground font-medium">"{pollTitle}"</span> have
          been recorded. Thank you for taking the time.
        </p>
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Pollinkr
        </Link>
      </div>
    </div>
  );
}

function PollClosed() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
          <IconClock size={24} className="text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          Poll closed
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This poll is no longer accepting responses. The deadline has passed.
        </p>
      </div>
    </div>
  );
}

function PollPublished() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto mb-6">
          <IconCircleCheck size={24} className="text-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          Results published
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          This poll has been completed and results are now public.
        </p>
        <Link
          to="results"
          className="px-5 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View results
        </Link>
      </div>
    </div>
  );
}