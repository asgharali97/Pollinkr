import type { PollStatus } from "@/types/index";
import {
  IconCircleCheck,
  IconClockCancel,
  IconPencil,
  IconBrandTelegram,
} from "@tabler/icons-react";

export default function StatusBadge({ status }: { status: PollStatus }) {
  const config: {
    name: PollStatus;
    className: string;
    Icon: typeof IconClockCancel;
  }[] = [
    {
      name: "active",
      className: "bg-emerald-50 text-emerald-700",
      Icon: IconCircleCheck,
    },
    {
      name: "expired",
      className: "bg-amber-50 text-amber-700",
      Icon: IconClockCancel,
    },
    {
      name: "published",
      className: "bg-emerald-100 text-emerald-700",
      Icon: IconBrandTelegram,
    },
    {
      name: "draft",
      className: "bg-neutral-100 text-neutral-500",
      Icon: IconPencil,
    },
  ];
  const currentStatus = config.find((item) => item.name === status);

  if (!currentStatus) return null;
  const { Icon } = currentStatus;

  return (
    <span
      className={`flex items-center justify-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium shadow-card ${currentStatus.className}`}
    >
      <Icon size={12} aria-hidden="true" />
      {currentStatus.name.charAt(0).toUpperCase() + currentStatus.name.slice(1)}
    </span>
  );
}
