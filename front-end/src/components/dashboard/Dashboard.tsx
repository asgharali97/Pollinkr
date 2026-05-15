import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import {
  IconPlus,
  IconChartBar,
  IconShare2,
  IconPencil,
  IconTrash,
  IconClock,
  IconUsers,
  IconDots,
  IconClipboardCheck,
  IconSearch,
} from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

type PollStatus = "draft" | "active" | "expired" | "published";

interface Poll {
  id: string;
  title: string;
  status: PollStatus;
  responseCount: number;
  questionCount: number;
  expiresAt: string | null;
  createdAt: string;
  isAnonymous: boolean;
  shareId: string;
}

type PollUpdatePayload = {
  poll: {
    id: string;
    status: PollStatus;
    totalResponses: number;
  };
};

const STATUS_CONFIG: Record<PollStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  },
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  expired: {
    label: "Expired",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  published: {
    label: "Published",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
};

type FilterTab = "all" | PollStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "expired", label: "Expired" },
  { key: "published", label: "Published" },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get("/polls");
        setPolls(response.data.data.polls);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Could not load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  useEffect(() => {
    const activePollIds = polls
      .filter((poll) => poll.status === "active")
      .map((poll) => poll.id);

    if (activePollIds.length === 0) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
    });

    activePollIds.forEach((pollId) => socket.emit("poll:join", pollId));

    socket.on("poll:update", (payload: PollUpdatePayload) => {
      setPolls((current) =>
        current.map((poll) =>
          poll.id === payload.poll.id
            ? {
                ...poll,
                status: payload.poll.status,
                responseCount: payload.poll.totalResponses,
              }
            : poll
        )
      );
    });

    return () => {
      activePollIds.forEach((pollId) => socket.emit("poll:leave", pollId));
      socket.disconnect();
    };
  }, [polls.map((poll) => `${poll.id}:${poll.status}`).join("|")]);

  const filtered = polls.filter((p) => {
    const matchesTab = filter === "all" || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    total: polls.length,
    active: polls.filter((p) => p.status === "active").length,
    responses: polls.reduce((a, p) => a + p.responseCount, 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen pl-60">
          <div className="max-w-4xl mx-auto px-8 py-10">

            <div className="flex items-start justify-between mb-10">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-medium">
                  Dashboard
                </p>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Good morning, {user?.name?.split(" ")[0] || "there"}.
                </h1>
              </div>
              <button
                onClick={() => navigate("/polls/create")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              >
                <IconPlus size={15} />
                New poll
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Total polls", value: counts.total },
                { label: "Active now", value: counts.active },
                { label: "Total responses", value: counts.responses },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-card shadow-m sadow-black/5 ring-1 ring-black/5 py-4 px-5"
                >
                  <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="flex items-center gap-1 rounded-lg p-1 bg-card shadow-m">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className="px-3 py-1 rounded-sm text-xs font-medium transition-all hover:shadow-s"
                    style={{
                      background: filter === tab.key ? "hsl(var(--foreground))" : "transparent",
                      color: filter === tab.key ? "hsl(var(--background))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <IconSearch
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search polls..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border focus:border-foreground/20 transition-colors w-48 shadow-m shadow-black/5 ring-1 ring-black/5"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                Loading polls...
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState hasPolls={polls.length > 0} />
            ) : (
              <div className="flex flex-col gap-2">
                {filtered.map((poll, i) => (
                  <PollRow key={poll.id} poll={poll} index={i} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PollRow({ poll, index }: { poll: Poll; index: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[poll.status];

  const expiryLabel = poll.expiresAt
    ? formatExpiry(poll.expiresAt)
    : "No expiry";

  return (
    <div
      className="group flex items-center justify-between px-5 py-4 rounded-xl bg-card transition-all duration-150 shadow-s hover:shadow-m"
      style={{
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div className="flex-1 min-w-0 mr-6">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
            {status.label}
          </span>
          {poll.isAnonymous && (
            <span className="text-xs text-muted-foreground/60">Anonymous</span>
          )}
        </div>
        <p className="text-sm font-medium text-foreground truncate">{poll.title}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconUsers size={11} />
            {poll.responseCount} responses
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconClipboardCheck size={11} />
            {poll.questionCount} questions
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconClock size={11} />
            {expiryLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {poll.status !== "draft" && (
          <ActionBtn
            icon={<IconChartBar size={14} />}
            label="Analytics"
            to={`/polls/${poll.id}/analytics`}
          />
        )}
        {poll.status === "active" && (
          <ActionBtn
            icon={<IconShare2 size={14} />}
            label="Share"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/p/${poll.shareId}`);
              toast.success("Share link copied");
            }}
          />
        )}
        {(poll.status === "draft" || poll.status === "active") && (
          <ActionBtn
            icon={<IconPencil size={14} />}
            label="Edit"
            to={`/polls/${poll.id}/edit`}
          />
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <IconDots size={15} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-card shadow-lg z-10 py-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              {poll.status === "expired" && (
                <MenuItem label="Publish results" onClick={() => setMenuOpen(false)} />
              )}
              <MenuItem
                label="Delete poll"
                onClick={() => setMenuOpen(false)}
                danger
                icon={<IconTrash size={13} />}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
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

function MenuItem({
  label,
  onClick,
  danger,
  icon,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-muted text-left"
      style={{ color: danger ? "#ef4444" : "hsl(var(--foreground))" }}
    >
      {icon}
      {label}
    </button>
  );
}


function EmptyState({ hasPolls }: { hasPolls: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        <IconClipboardCheck size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        {hasPolls ? "No polls match your filter" : "No polls yet"}
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        {hasPolls
          ? "Try a different filter or search term."
          : "Create your first poll and start collecting responses."}
      </p>
      {!hasPolls && (
        <Link
          to="/polls/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
        >
          <IconPlus size={14} />
          Create poll
        </Link>
      )}
    </div>
  );
}

function formatExpiry(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days}d`;
}
