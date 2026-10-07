import { IconShieldCheck, IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section
      id="cta"
      className="max-w-xl sm:max-w-4xl mx-auto py-12 px-6"
    >
      <div className="text-center bg-card py-8 px-4 rounded-2xl shadow-m shadow-black/5 ring-1 ring-black/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6  bg-primary-light-1/50 text-foreground/70 shadow-chart ring-1 ring-primary-light-1/80">
          <IconShieldCheck size={12} />
          No credit card. No setup.
        </div>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold tracking-tight leading-[1.08] mb-4">
          Start collecting responses today.
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
          Create an account, build your first poll in under a minute, and share
          it the rest takes care of itself.
        </p>
        <Link to="/Signup" className="inline-flex items-center">
          <button className="flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-lg bg-primary text-background text-sm font-medium shadow-l cursor-pointer active:scale-[0.995] shadow-black/5 ring-1 ring-primary/90">
            Create free account
            <IconArrowRight size={15} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;
