import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { FilterTab, Poll } from "@/types/index";
import { PollRow } from "./PollRow";
import { EmptyState } from "./EmptyState";
import type { PollUpdatePayload } from "@/types/index";

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
                style={{
                  background: "hsl(var(--foreground))",
                  color: "hsl(var(--background))",
                }}
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
                  <p className="text-2xl font-semibold tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="flex items-center gap-1 rounded-[6px] p-0.5 bg-muted shadow-m">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-1 rounded-[4px] text-xs font-medium transition-all text-muted-foreground hover:text-foreground/80 hover:bg-accent-foreground ${
                      filter === tab.key
                        ? "bg-background text-foreground hover:bg-background"
                        : ""
                    }`}
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
                  <PollRow
                    key={poll.id}
                    poll={poll}
                    index={i}
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
        </main>
      </div>
    </div>
  );
}
