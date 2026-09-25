import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IconChartBar, IconLayoutDashboard } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-card hover:text-foreground/80 ${
        active ? "bg-muted text-foreground hover:bg-muted" : ""
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "polls";
  const isDashboard = currentTab === "polls" || !searchParams.get("tab");
  const isAnalytics = currentTab === "analytics";

  const handleSignout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 flex h-full w-60 flex-col border-r border-border px-4 py-6">
      <Link
        to="/"
        className="mb-8 block px-2 text-sm font-semibold tracking-tight text-foreground"
      >
        Pollinkr
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        <SidebarLink
          active={isDashboard}
          label="Dashboard"
          icon={<IconLayoutDashboard size={15} aria-hidden />}
          to="/dashboard"
        />
        <SidebarLink
          active={isAnalytics}
          label="Analytics"
          icon={<IconChartBar size={15} aria-hidden />}
          to="/dashboard?tab=analytics"
        />
      </nav>

      <div className="-mx-4 mt-auto flex flex-col gap-3 border-t border-dashed border-border px-2 pt-6">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {user?.name.slice(0, 1)}
              </div>
              <div className="flex flex-1 flex-col items-start">
                <p className="truncate text-xs font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-46 rounded-lg py-2">
            <button
              type="button"
              onClick={handleSignout}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-red-400"
            >
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}

export default Sidebar;
