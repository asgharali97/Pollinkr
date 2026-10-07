import {Link} from 'react-router-dom'

export function ActionBtn({
  icon,
  label,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  const cls =
    "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:shadow-card sm:gap-2.5";

  if (to) {
    return (
      <Link to={to} className={cls}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {icon}
      {label}
    </button>
  );
}