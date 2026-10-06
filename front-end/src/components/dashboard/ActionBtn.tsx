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
    "flex items-center gap-2.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted hover:shadow-card transition-colors font-medium";

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