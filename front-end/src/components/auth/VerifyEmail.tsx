import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconLoader2,
  IconMail,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useResendVerification, useVerifyEmail } from "@/hooks";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();
  const [state, setState] = useState<VerifyState>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token
      ? "Verifying your email..."
      : "Verification token is missing. Request a new verification email."
  );
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const attemptedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token || attemptedToken.current === token) return;
    attemptedToken.current = token;
    setState("loading");
    setMessage("Verifying your email...");

    verifyMutation
      .mutateAsync({ token })
      .then((response) => {
        if (attemptedToken.current !== token) return;
        setAlreadyVerified(false);
        setState("success");
        setMessage(response.message || "Email verified successfully");
      })
      .catch((error: any) => {
        if (attemptedToken.current !== token) return;
        const errorMessage = error.response?.data?.message;
        if (errorMessage?.toLowerCase().includes("already verified")) {
          setAlreadyVerified(true);
          setState("success");
          setMessage("Your email is already verified. You can sign in.");
          return;
        }
        setState("error");
        setMessage(
          errorMessage ||
            "This verification link has expired or is invalid"
        );
      });
  }, [token, verifyMutation.mutateAsync]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const resend = async () => {
    if (!email || cooldown > 0) return;

    try {
      const response = await resendMutation.mutateAsync({ email });
      if (response.message.toLowerCase().includes("already verified")) {
        setAlreadyVerified(true);
        setState("success");
        setMessage("Your email is already verified. You can sign in.");
        return;
      }
      toast.success(response.message || "Verification email sent");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not resend email");
    }
  };

  if (state === "loading") {
    return (
      <VerificationCard
        icon={<IconLoader2 size={24} className="animate-spin text-foreground/80" />}
        title="Verifying your email..."
        description="Please wait while we confirm your account."
      />
    );
  }

  if (state === "success") {
    return (
      <VerificationCard
        icon={<IconCircleCheck size={24} className="text-emerald-700" />}
        title="Email verified successfully"
        description={message}
        action={
          <Link
            to={alreadyVerified ? "/login" : "/dashboard"}
            className="inline-flex px-6 py-2.5 rounded-xl bg-primary text-background text-sm font-medium shadow-m cursor-pointer active:scale-[0.995] hover:shadow-s ring-1 ring-primary/90"
          >
            {alreadyVerified ? "Sign in" : "Continue"}
          </Link>
        }
      />
    );
  }

  return (
    <VerificationCard
      icon={<IconAlertCircle size={24} className="text-amber-700" />}
      title="Verification link unavailable"
      description={message}
      action={
        <div className="space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-background border py-2 px-4 rounded-xl shadow-s outline-none placeholder:text-muted-foreground/80 focus:ring-1 focus:ring-muted"
          />
          <button
            type="button"
            disabled={!email || cooldown > 0 || resendMutation.isPending}
            onClick={resend}
            className="w-full py-2.5 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-background disabled:opacity-60"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resendMutation.isPending
                ? "Sending..."
                : "Resend verification email"}
          </button>
        </div>
      }
    />
  );
}

function VerificationCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="w-full max-w-sm p-2 rounded-[20px] shadow-s shadow-black/5 ring-1 ring-black/5 bg-background">
      <div className="w-full h-full p-6 rounded-xl shadow-m shadow-black/10 ring-1 ring-black/10 bg-card text-center">
        <Link
          to="/"
          className="text-sm font-semibold tracking-tight text-foreground block mb-6 leading-none text-left"
        >
          Pollinkr
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-primary-light-2/70 shadow-chart ring-1 ring-primary-light-2 flex items-center justify-center mx-auto mb-4">
          {icon || <IconMail size={24} className="text-foreground/80" />}
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          {title}
        </h1>
        <p className="text-sm text-foreground/70 leading-relaxed mb-5 max-w-sm mx-auto text-pretty">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}
