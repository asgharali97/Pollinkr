import { IconClipboardCheck, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function EmptyState({ hasPolls }: { hasPolls: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        <IconClipboardCheck size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        {hasPolls ? "No polls match your filter" : "No polls yet"}
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        {hasPolls
          ? "Try a different filter or search term."
          : "Create your first poll and start collecting responses."}
      </p>
      {!hasPolls && (
        <Link
          to="/polls/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          style={{
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
          }}
        >
          <IconPlus size={14} />
          Create poll
        </Link>
      )}
    </div>
  );
}