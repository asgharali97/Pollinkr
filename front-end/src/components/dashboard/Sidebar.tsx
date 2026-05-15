import React from "react";
import { Link } from "react-router-dom";
import { IconChartBar } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth.store";

function SidebarLink({
  label,
  icon,
  to,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors hover:bg-muted hover:text-foreground/80  text-muted-foreground ${active ? "text-black/80 bg-muted" : ""}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function Sidebar() {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="fixed left-0 top-0 h-full w-60 border-r border-border bg-card flex flex-col py-6 px-4">
      <Link
        to="/"
        className="text-sm font-semibold tracking-tight text-foreground px-2 mb-8 block"
      >
        Pollinkr
      </Link>

      <nav className="flex flex-col gap-0.5 flex-1">
        <SidebarLink
          active
          label="Dashboard"
          icon={<IconChartBar size={15} />}
          to="/dashboard"
        />
      </nav>
      <div className="flex flex-col gap-3 px-2 mt-auto pt-6 -mx-4 border-t border-border border-dashed mask-x-from-90%">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
            {user?.name.slice(0,1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
