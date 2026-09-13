import { useState } from "react";
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
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

type AuthLoginDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

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

  const returnTo = encodeURIComponent(location.pathname + location.search);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      setAuth(response.data.data.user, "cookie-session");
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
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
          <div className="space-y-2 flex flex-col">
            <label htmlFor="auth-email" className="text-sm font-medium">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
