import type { PublicPoll } from "@/types/index";
import { Link } from "react-router-dom";
import { AuthLoginDialog } from "@/components/AuthLoginDialog";
import { ExpiryBadge } from "./ExpiryBadge";
import { Button } from "@/components/ui/button";
import { IconLock } from "@tabler/icons-react";
type GatePoll = Pick<PublicPoll, "title" | "description" | "expiresAt">;

export function AuthRequiredGate({ poll }: { poll: GatePoll }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10 opacity-80 pointer-events-none select-none">
          <ExpiryBadge expiresAt={poll.expiresAt} />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground/80 mt-2 mb-2">
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-sm text-foreground/60 leading-relaxed">
              {poll.description}
            </p>
          )}
        </div>

        <div className="rounded-xl shadow-m shadow-black/5 ring-1 ring-black/5 bg-card p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-light-2/70 shadow-chart ring-1 ring-primary-light-2 flex items-center justify-center mx-auto mb-4">
            <IconLock size={24} className="text-foreground/80" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-2">
            Sign in required
          </h2>
          <p className="text-sm text-foreground/70 leading-relaxed mb-4 max-w-sm mx-auto text-pretty">
            This poll only accepts responses from signed-in users. Sign in to
            view the questions and submit your answers.
          </p>
          <AuthLoginDialog
            trigger={
              <Button
                className="px-6 py-2.5 rounded-xl bg-primary text-background text-sm font-medium shadow-m cursor-pointer active:scale-[0.995] hover:shadow-s"
                size="lg"
              >
                Sign in to respond
              </Button>
            }
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Powered by{" "}
          <Link to="/" className="hover:text-foreground transition-colors">
            Pollinkr
          </Link>
        </p>
      </div>
    </div>
  );
}
