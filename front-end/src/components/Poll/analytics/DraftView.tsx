import { Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import type { PollAnalytics } from "@/types/index";

export default function DraftView({ poll }: { poll: PollAnalytics["poll"] }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 font-sans">
      <div className="max-w-sm text-center">
        <Link
          to="/dashboard"
          className="mb-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft size={13} aria-hidden />
          Back to dashboard
        </Link>
        <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {poll.title}
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          This poll is still in draft mode. No responses yet.
        </p>
        <Link
          to={`/polls/${poll.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Edit poll
        </Link>
      </div>
    </div>
  );
}