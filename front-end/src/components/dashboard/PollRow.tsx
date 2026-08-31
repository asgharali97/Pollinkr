import { useState } from "react";
import { toast } from "sonner";
import { useDeletePoll, useClosePoll } from "@/hooks/hooks-polls";
import type { Poll } from "@/types/index";
import { STATUS_CONFIG } from "@/lib/constants";
import {
  IconUsers,
  IconPencil,
  IconTrash,
  IconClipboardCheck,
  IconClock,
  IconChartBar,
  IconShare2,
  IconDots
} from "@tabler/icons-react";
import { ActionBtn } from "./ActionBtn";
import { MenuItem } from "./MenuItem";

export function PollRow({
  poll,
  index,
  onDeleted,
}: {
  poll: Poll;
  index: number;
  onDeleted: () => void;
}) {
  function formatExpiry(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now();
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `Expires in ${days}d`;
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const deleteMutation = useDeletePoll(poll.id);
  const closeMutation = useClosePoll(poll.id);
  const status = STATUS_CONFIG[poll.status];

  const expiryLabel = poll.expiresAt
    ? formatExpiry(poll.expiresAt)
    : "No expiry";

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      onDeleted();
      toast.success("Poll deleted");
      setMenuOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not delete poll");
    }
  };

  const handleClose = async () => {
    try {
      await closeMutation.mutateAsync();
      onDeleted();
      toast.success("Poll closed");
      setMenuOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not close poll");
    }
  };

  const deleteAction =
    poll.status === "draft"
      ? {
          label: "Delete poll",
          action: handleDelete,
          loading: deleteMutation.isPending,
        }
      : poll.status === "active"
        ? {
            label: "Close poll",
            action: handleClose,
            loading: closeMutation.isPending,
          }
        : null;

  return (
    <div
      className="group flex items-center justify-between px-5 py-4 rounded-xl bg-card transition-all duration-150 shadow-s hover:shadow-m"
      style={{
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div className="flex-1 min-w-0 mr-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}
          >
            {status.label}
          </span>
          {poll.isAnonymous && (
            <span className="text-xs text-muted-foreground/60">Anonymous</span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground truncate">
          {poll.title}
        </p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconUsers size={11} />
            {poll.responseCount} responses
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconClipboardCheck size={11} />
            {poll.questionCount} questions
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconClock size={11} />
            {expiryLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {poll.status !== "draft" && (
          <ActionBtn
            icon={<IconChartBar size={14} />}
            label="Analytics"
            to={`/polls/${poll.id}/analytics`}
          />
        )}
        {poll.status === "active" && (
          <ActionBtn
            icon={<IconShare2 size={14} />}
            label="Share"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/p/${poll.shareId}`,
              );
              toast.success("Share link copied");
            }}
          />
        )}
        {(poll.status === "draft" || poll.status === "active") && (
          <ActionBtn
            icon={<IconPencil size={14} />}
            label="Edit"
            to={`/polls/${poll.id}/edit`}
          />
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {poll.status !== "published" ? <IconDots size={15} /> : null}
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-card shadow-lg z-10 py-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              {poll.status === "expired" && (
                <MenuItem
                  label="Publish results"
                  onClick={() => setMenuOpen(false)}
                />
              )}
              {deleteAction && (
                <MenuItem
                  label={deleteAction.label}
                  onClick={deleteAction.action}
                  danger
                  icon={<IconTrash size={13} />}
                  disabled={deleteAction.loading}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
