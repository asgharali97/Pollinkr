import type { AnalyticsQuestion } from "@/types/index";
import { getSkippedCount } from "./analytics.utils";
import { AnswerDistributionChart } from "./AnswerDistributionChart";

type QuestionResultProps = {
  question: AnalyticsQuestion;
  index: number;
  totalResponses: number;
};

export function QuestionResult({
  question,
  index,
  totalResponses,
}: QuestionResultProps) {
  const skipped = getSkippedCount(totalResponses, question.totalAnswers);
  const showSkipInfo = !question.mandatory;

  return (
    <article
      className="rounded-xl bg-card p-5 shadow-card sm:p-6"
      aria-labelledby={`question-${question.id}-heading`}
    >
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs text-muted-foreground">
            Q{index + 1}
            <span className="mx-1.5 text-border" aria-hidden>
              ·
            </span>
            {question.mandatory ? "Required" : "Optional"}
          </p>
          <h3
            id={`question-${question.id}-heading`}
            className="text-sm font-medium text-pretty text-foreground"
          >
            {question.text}
          </h3>
          {showSkipInfo && (
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="tabular-nums">{question.totalAnswers}</span>{" "}
              answered
              <span className="mx-1.5 text-border" aria-hidden>
                ·
              </span>
              <span className="tabular-nums">{skipped}</span> skipped
            </p>
          )}
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {question.totalAnswers}
          </p>
          <p className="text-xs text-muted-foreground">answers</p>
        </div>
      </header>

      <AnswerDistributionChart options={question.options} />
    </article>
  );
}
