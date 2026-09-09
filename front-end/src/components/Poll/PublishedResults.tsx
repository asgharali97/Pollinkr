import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IconChartBar, IconClock, IconLock, IconUsers, IconAlertCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { EvilBarChart } from "@/components/evilcharts/charts/bar-chart";
import { EvilPieChart } from "@/components/evilcharts/charts/pie-chart";
import { type ChartConfig } from "@/components/evilcharts/ui/chart";
import api from "@/lib/api";

type ResultsData = {
  poll: {
    title: string;
    description?: string;
    publishedAt: string | null;
    totalResponses: number;
    isAnonymous: boolean;
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

export default function PublishedResults() {
  // NOTE: shareId is the canonical route parameter for public URLs
  // For debugging/future: this matches /p/:shareId/results (public route)
  // If refactoring internal routes, use shareId consistently for public-facing results
  const { shareId } = useParams();

  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/public/polls/${shareId}`);

        // Verify the poll is actually published before rendering results
        if (response.data.data.mode !== "results") {
          setError("Results are not published yet");
          return;
        }

        setData(response.data.data.poll);
      } catch (error: any) {
        const message = error.response?.data?.message || "Could not load results";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading results...
      </div>
    );
  }

  if (error || !data) {
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
            {error || "This poll's results are not yet published or don't exist."}
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

  const publishedDate = data.poll.publishedAt
    ? new Date(data.poll.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "recently";

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
    ]),
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-tight text-foreground">
            Pollinkr
          </Link>
          <div className="text-xs h-8 w-[7.8rem] flex justify-center items-center p-1 bg-muted rounded-xl shadow-m ring-1 ring-black/5">
            <span className="h-full w-full bg-background rounded-lg py-1 px-2 shadow-m">
              Results published
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
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

        <div className="grid grid-cols-3 gap-3 mb-10">
          <SummaryCard label="Total responses" value={data.poll.totalResponses} />
          <SummaryCard label="Questions" value={data.questions.length} />
          <SummaryCard
            label="Required"
            value={data.questions.filter((q) => q.mandatory).length}
          />
        </div>

        <div className="space-y-5">
          <p className="text-sm font-medium text-foreground">Results by question</p>

          {data.questions.map((q, i) => {
            const topOption = [...q.options].sort((a, b) => b.count - a.count)[0];
            const topPct =
              q.totalAnswers === 0 || !topOption
                ? 0
                : Math.round((topOption.count / q.totalAnswers) * 100);

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
              <div key={q.id} className="rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6">
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

                <div className="h-44 mb-5">
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
                      q.totalAnswers === 0 ? 0 : Math.round((opt.count / q.totalAnswers) * 100);
                    const isWinner = opt.key === topOption?.key;
                    return (
                      <div key={opt.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs ${
                              isWinner ? "text-foreground font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {opt.label}
                            {isWinner && (
                              <span className="ml-2 text-xs text-muted-foreground font-normal">
                                winner
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
                      <span className="text-foreground font-medium">{topOption.label}</span>{" "}
                      won with {topPct}% of votes
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl shadow-m ring-1 ring-black/5 bg-card p-6">
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

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl shadow-m ring-1 ring-black/5 bg-card px-4 py-3 text-center">
      <p className="text-xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}