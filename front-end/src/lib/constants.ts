import type { PollStatus } from "@/types/index";

export const STATUS_CONFIG: Record<PollStatus, { label: string; className: string }> =
  {
    draft: {
      label: "Draft",
      className:
        "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
    },
    active: {
      label: "Active",
      className:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    },
    expired: {
      label: "Expired",
      className:
        "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    },
    published: {
      label: "Published",
      className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    },
  };
