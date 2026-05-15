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
import { Button } from "@/components/ui/button";

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

  const returnTo = encodeURIComponent(
    location.pathname + location.search
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/login?returnTo=${returnTo}`;
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
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              className="border py-2 px-4 rounded-lg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
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
