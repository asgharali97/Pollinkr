import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconChartBar } from "@tabler/icons-react";
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
      className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors hover:bg-card hover:text-foreground/80 ${active ? "text-foreground bg-muted hover:bg-muted" : ""}`}
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSignout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-60 border-r border-border flex flex-col py-6 px-4">
      <Link
        to="/"
        className="text-sm font-semibold tracking-tight text-foreground px-2 mb-8 block"
      >
        Pollinkr
      </Link>

      <nav className="flex flex-col gap-4 flex-1 ">
        <SidebarLink
          active={true}
          label="Dashboard"
          icon={<IconChartBar size={15} />}
          to="/dashboard"
        />
      </nav>

      <div className="flex flex-col gap-3 px-2 mt-auto pt-6 -mx-4 border-t border-border border-dashed">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                {user?.name.slice(0, 1)}
              </div>
              <div className="flex-1 flex flex-col items-start">
                <p className="text-xs font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="w-46 py-2 rounded-lg">
            <button
              onClick={handleSignout}
              className="w-full flex items-center gap-2 px-3 py-1 rounded text-sm text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
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