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
    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium";

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