import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import { IconMenu2, IconPlus, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { FilterTab, Poll } from "@/types/index";
import { PollRow } from "./PollRow";
import { EmptyState } from "./EmptyState";
import type { PollUpdatePayload } from "@/types/index";
import Analytics from "../Poll/analytics/Analytics";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "polls";
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const analyticsId = searchParams.get("pollId");


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

    const socket = io(
      import.meta.env.VITE_SOCKET_URL ||
        (import.meta.env.PROD
          ? window.location.origin
          : "http://localhost:4000"),
      { withCredentials: true },
    );

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
            : poll,
        ),
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

  const handleViewAnalytics = (pollId: string) => {
    setSearchParams({ tab: "analytics", pollId });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="min-h-screen min-w-0 flex-1 md:pl-40 lg:pl-60">
          <div className="px-4 pt-4 md:hidden">
            <button
              type="button"
              aria-label="Open dashboard navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-lg text-foreground hover:bg-muted"
            >
              <IconMenu2 size={20} aria-hidden="true" />
            </button>
          </div>
          {currentTab === "polls" && (
            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-5xl lg:px-8 lg:py-10">
              <div className="mb-8 flex items-start justify-between gap-3 sm:mb-10">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-medium">
                    Dashboard
                  </p>
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Good morning, {user?.name?.split(" ")[0] || "there"}.
                  </h1>
                </div>
                <button
                  onClick={() => navigate("/polls/create")}
                  className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-opacity hover:opacity-90 sm:px-4 sm:text-sm"
                  style={{
                    background: "hsl(var(--foreground))",
                    color: "hsl(var(--background))",
                  }}
                >
                  <IconPlus size={15} />
                  New poll
                </button>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mb-10 lg:grid-cols-3 lg:gap-4">
                {[
                  { label: "Total polls", value: counts.total },
                  { label: "Active now", value: counts.active },
                  { label: "Total responses", value: counts.responses },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="min-w-0 rounded-xl bg-card px-4 py-4 shadow-card ring-1 ring-black/5 sm:px-5"
                  >
                    <p className="text-2xl font-semibold tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-md bg-card p-0.5 shadow-card ring-1 ring-black/5">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`shrink-0 rounded-sm px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground/80 ${
                        filter === tab.key
                          ? "bg-accent text-foreground hover:bg-accent"
                          : ""
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-48 sm:shrink-0">
                  <IconSearch
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/90"
                  />
                  <input
                    type="text"
                    placeholder="Search polls..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg bg-card py-1.5 pl-8 pr-3 text-sm text-foreground outline-none ring-1 ring-muted-foreground/40 placeholder:text-muted-foreground/50 focus:ring-muted-foreground"
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
                <div className="flex flex-col gap-3">
                  {filtered.map((poll, i) => (
                    <PollRow
                      key={poll.id}
                      poll={poll}
                      index={i}
                      onViewAnalytics={handleViewAnalytics}
                      onDeleted={() =>
                        setPolls((current) =>
                          current.filter((item) => item.id !== poll.id),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentTab === "analytics" && (
            <Analytics pollId={analyticsId} />
          )}
        </main>
      </div>
    </div>
  );
}
