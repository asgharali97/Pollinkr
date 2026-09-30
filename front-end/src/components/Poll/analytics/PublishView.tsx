import {Link} from 'react-router-dom'
import {IconArrowLeft, IconCircleCheck} from '@tabler/icons-react'
import type { PollAnalytics } from "@/types/index";

export default function PublishedView({ poll }: { poll: PollAnalytics["poll"] }) {
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
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-foreground/5">
          <IconCircleCheck size={24} className="text-foreground" />
        </div>
        <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          Results published
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {poll.title} results are now public and locked. No further edits are
          possible.
        </p>
        <Link
          to={`/p/${poll.shareId}/results`}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View published results
        </Link>
      </div>
    </div>
  );
}
