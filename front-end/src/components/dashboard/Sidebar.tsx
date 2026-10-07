import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IconChartBar, IconLayoutDashboard, IconLogout2 } from "@tabler/icons-react";
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
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  to: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      title={label}
      className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-card hover:text-foreground/80 md:max-lg:justify-center md:max-lg:px-0 ${
        active ? "bg-muted text-foreground hover:bg-muted shadow-card" : ""
      }`}
    >
      {icon}
      <span className="md:max-lg:sr-only">{label}</span>
    </Link>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  const currentTab = searchParams.get("tab") || "polls";
  const isDashboard = currentTab === "polls" || !searchParams.get("tab");
  const isAnalytics = currentTab === "analytics";

  const handleSignout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-60 flex-col border-r border-border bg-background px-4 py-6 pl-[calc(1rem+env(safe-area-inset-left))] transition-transform duration-300 md:w-40 md:translate-x-0 md:px-3 md:pl-3 lg:w-60 lg:px-4 lg:pl-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <Link
        to="/dashboard"
        onClick={onClose}
        className="mb-8 block px-2 text-sm font-semibold tracking-tight text-foreground md:max-lg:px-0 md:max-lg:text-center"
      >
        Pollinkr
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main">
        <SidebarLink
          active={isDashboard}
          label="Dashboard"
          icon={<IconLayoutDashboard size={15} aria-hidden />}
          to="/dashboard"
          onClick={onClose}
        />
        <SidebarLink
          active={isAnalytics}
          label="Analytics"
          icon={<IconChartBar size={15} aria-hidden />}
          to="/dashboard?tab=analytics"
          onClick={onClose}
        />
      </nav>

      <div className="-mx-4 mt-auto flex flex-col gap-3 border-t border-border px-2 pt-4 md:-mx-3 lg:-mx-4">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80 hover:bg-muted p-1 rounded-lg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted shadow-card text-xs font-semibold text-foreground">
                {user?.name.slice(0, 1)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start md:max-lg:hidden">
                <p className="truncate text-xs font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" className="rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={handleSignout}
              className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-red-400"
            >
              <IconLogout2 size={14} />
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
      </aside>
    </>
  );
}

export default Sidebar;
