import { IconClock } from "@tabler/icons-react";

export function ExpiryBadge({ expiresAt }: { expiresAt?: string }) {
  if (!expiresAt) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <IconClock size={11} />
        No expiry
      </span>
    );
  }

  const diff = new Date(expiresAt).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const label =
    days === 0
      ? "Closes today"
      : days === 1
        ? "Closes tomorrow"
        : `Closes in ${days}d`;

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <IconClock size={11} />
      {label}
    </span>
  );
}
