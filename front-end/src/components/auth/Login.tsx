import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useLogin, useResendVerification } from "@/hooks/index";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const createMutation = useLogin();
  const resendMutation = useResendVerification();
  const returnTo = searchParams.get("returnTo");

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
    const payload = {
      email,
      password,
    };
    try {
      const response = await createMutation.mutateAsync(payload);
      setAuth(response.user, "cookie-session");
      toast.success("Logged in successfully");

      if (returnTo) {
        navigate(decodeURIComponent(returnTo));
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setUnverifiedEmail(email);
        toast.error("Please verify your email before logging in");
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    if (!unverifiedEmail || cooldown > 0) return;

    try {
      const response = await resendMutation.mutateAsync({
        email: unverifiedEmail,
      });
      toast.success(response.message || "Verification email sent");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not resend email");
    }
  };

  return (
    <div className="w-full px-4 flex justify-center items-center">
      <div className="w-full max-w-sm p-2 rounded-[20px] shadow-s shadow-black/5 ring-1 ring-black/5 bg-background">
        <div className="w-full h-full p-5 rounded-xl shadow-m shadow-black/10 ring-1 ring-black/10 bg-card">
          <div className="mb-6 flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm font-semibold tracking-tight text-foreground block mb-2 leading-none"
            >
              Pollinkr
            </Link>
            <div className="text-xl font-semibold tracking-tight text-foreground leading-none">
              Welcome back
            </div>
            <div className="text-sm text-neutral-600">
              Sign in to your account to continue.
            </div>
          </div>
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
              <label className="text-md font-normal">Email</label>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUnverifiedEmail("");
                  setCooldown(0);
                }}
                type="email"
                required
                placeholder="jhondoe@gmail.com"
                className="bg-background border py-2 px-4 rounded-xl shadow-s outline-none placeholder:text-muted-foreground/80 focus:ring-1 focus:ring-muted"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-md font-normal">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="*******"
                className="bg-background border py-2 px-4 rounded-xl shadow-s outline-none placeholder:text-muted-foreground/80 focus:ring-1 focus:ring-muted"
              />
            </div>
            <div className="flex justify-center w-full mt-6">
              <button
                disabled={submitting}
                type="submit"
                className="py-2 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-background disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?
            <Link
              to={
                returnTo
                  ? `/signup?returnTo=${encodeURIComponent(returnTo)}`
                  : "/signup"
              }
              className="text-muted-foreground font-medium hover:underline underline-offset-4 hover:text-foreground ml-1 transition-all"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
