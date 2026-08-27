import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setAuth(response.data.data.user, "cookie-session");
      toast.success("Account created");
      navigate(searchParams.get("returnTo") || "/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

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
            to="/login"
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
