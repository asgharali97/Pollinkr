import { IconAlertCircle } from "@tabler/icons-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <IconAlertCircle size={12} />
      {message}
    </p>
  );
}
