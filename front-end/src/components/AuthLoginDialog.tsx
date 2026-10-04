import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useResendVerification } from "@/hooks";

type AuthLoginDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

function getApiErrorDetails(error: unknown) {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return {
      status: error.response?.status,
      message: data?.message || error.message,
    };
  }

  return {
    status: undefined,
    message: error instanceof Error ? error.message : undefined,
  };
}

export function AuthLoginDialog({
  open,
  onOpenChange,
  trigger,
}: AuthLoginDialogProps) {
  const location = useLocation();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const resendMutation = useResendVerification();

  const returnTo = encodeURIComponent(location.pathname + location.search);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      console.info("[auth] modal login request succeeded", { status: response.status });
      setAuth(response.data.data.user, "cookie-session");
      toast.success("Logged in successfully");
      setDialogOpen(false);
    } catch (error: unknown) {
      const details = getApiErrorDetails(error);
      console.warn("[auth] modal login request failed", {
        status: details.status,
        message: details.message,
      });
      if (details.status === 403) {
        setUnverifiedEmail(email);
        toast.error("Please verify your email before logging in");
      } else {
        toast.error(details.message || "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    if (!unverifiedEmail || cooldown > 0) return;

    try {
      const response = await resendMutation.mutateAsync({ email: unverifiedEmail });
      toast.success(response.message || "Verification email sent");
      setCooldown(60);
    } catch (error: unknown) {
      const details = getApiErrorDetails(error);
      toast.error(details.message || "Could not resend email");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            This poll requires an account. Sign in to submit your response.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {unverifiedEmail && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <p className="text-sm font-medium text-amber-900">
                Your email is not verified yet.
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Verify your inbox link or resend a new verification email.
              </p>
              <button
                type="button"
                disabled={cooldown > 0 || resendMutation.isPending}
                onClick={resendVerification}
                className="mt-3 text-xs font-medium text-amber-950 underline underline-offset-4 disabled:opacity-60"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : resendMutation.isPending
                    ? "Sending..."
                    : "Resend verification email"}
              </button>
            </div>
          )}
          <div className="space-y-2 flex flex-col">
            <label htmlFor="auth-email" className="text-sm font-medium">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setUnverifiedEmail("");
                setCooldown(0);
              }}
              id="auth-email"
              type="email"
              required
              placeholder="you@example.com"
              className="border py-2 px-4 rounded-lg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label htmlFor="auth-password" className="text-sm font-medium">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              className="border py-2 px-4 rounded-lg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex justify-center w-full">
            <button
              disabled={submitting}
              type="submit"
              className="py-2 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-white disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link
            to={`/signup?returnTo=${returnTo}`}
            className="font-medium hover:underline underline-offset-4 hover:text-foreground transition-colors"
            onClick={() => setDialogOpen(false)}
          >
            Create one
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
