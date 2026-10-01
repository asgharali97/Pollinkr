import { format, startOfDay } from "date-fns";
import type {
  AnalyticsOption,
  RankedAnswer,
  ResponseActivityPoint,
} from "@/types/index";

export const ANSWER_HIGHLIGHT_COLORS = [
  "var(--primary-light-1)",
  "var(--chart-1)",
] as const;

export function buildResponseActivity(
  submittedAt: string[],
): ResponseActivityPoint[] {
  if (submittedAt.length === 0) return [];

  const buckets = new Map<string, number>();

  for (const iso of submittedAt) {
    const day = startOfDay(new Date(iso)).toISOString();
    buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, responses]) => ({
      date,
      label: format(new Date(date), "MMM d"),
      responses,
    }));
}

export function rankAnswers(options: AnalyticsOption[]): RankedAnswer[] {
  const total = options.reduce((sum, option) => sum + option.count, 0);

  return [...options]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map((option, index) => ({
      key: option.key,
      label: option.label,
      count: option.count,
      percentage:
        total === 0 ? 0 : Math.round((option.count / total) * 100),
      color: ANSWER_HIGHLIGHT_COLORS[
        Math.min(index, ANSWER_HIGHLIGHT_COLORS.length - 1)
      ],
    }));
}

export function getSkippedCount(
  totalResponses: number,
  totalAnswers: number,
): number {
  return Math.max(0, totalResponses - totalAnswers);
}

export function getTimeLeft(expiresAt: string | null): string {
  if (!expiresAt) return "No expiry";
  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  return `${days}d remaining`;
}
