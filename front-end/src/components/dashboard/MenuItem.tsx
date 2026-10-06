
export function MenuItem({
  label,
  onClick,
  danger,
  icon,
  disabled
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1 text-xs transition-colors hover:bg-muted text-left rounded-sm"
      style={{ color: danger ? "#ef4444" : "hsl(var(--foreground))" }}
      disabled={disabled}
    >
      {icon}
      {label}
    </button>
  );
}