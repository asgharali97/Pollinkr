import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IconMail } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRegister, useResendVerification } from "@/hooks/index";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const createMutation = useRegister();
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
      name,
      email,
      password,
    };

    try {
      await createMutation.mutateAsync(payload);
      setRegisteredEmail(email);
      setCooldown(60);
      toast.success("Account created. Check your inbox.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    if (!registeredEmail || cooldown > 0) return;

    try {
      const response = await resendMutation.mutateAsync({ email: registeredEmail });
      toast.success(response.message || "Verification email sent");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not resend email");
    }
  };

  if (registeredEmail) {
    const loginHref = returnTo
      ? `/login?returnTo=${encodeURIComponent(returnTo)}`
      : "/login";

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
            <IconMail size={24} className="text-foreground/80" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-foreground/70 leading-relaxed mb-5 max-w-sm mx-auto text-pretty">
            We've sent a verification link to{" "}
            <span className="text-foreground font-medium">{registeredEmail}</span>.
            Please verify your account to continue.
          </p>
          <button
            type="button"
            disabled={cooldown > 0 || resendMutation.isPending}
            onClick={resendVerification}
            className="w-full py-2.5 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-white disabled:opacity-60"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resendMutation.isPending
                ? "Sending..."
                : "Resend email"}
          </button>
          <Link
            to={loginHref}
            className="inline-flex mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm p-2 rounded-[20px] shadow-s shadow-black/5 ring-1 ring-black/5 bg-background">
      <div className="w-full h-full p-5 rounded-xl shadow-m shadow-black/10 ring-1 ring-black/10 bg-card">
        <div className="mb-6 flex flex-col gap-2">
          <Link
            to="/"
            className="text-sm font-semibold tracking-tight text-foreground block mb-2 leading-none"
          >
            Pollinkr
          </Link>
          <div className="text-xl font-semibold tracking-tight leading-none text-foreground">
            Create an account
          </div>
          <div className="text-sm text-neutral-600">
            Start collecting responses in under a minute.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <label className="text-md font-normal">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="John Doe"
              className="bg-background border py-2 px-4 rounded-xl shadow-s outline-none placeholder:text-muted-foreground/80 focus:ring-1 focus:ring-muted"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-md font-normal">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="py-2 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-white disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link
            to={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}
            className="text-muted-foreground font-medium hover:underline underline-offset-4 hover:text-foreground ml-1 transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
