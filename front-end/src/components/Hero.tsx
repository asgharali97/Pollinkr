import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PollPreview from "./PollPreview";

const Hero = () => {
  return (
    <section className="mt-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1
          className="text-xl sm:text-2xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          Feedback that actually closes.
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
          Create polls, share one link, and collect structured responses — with
          expiry, anonymous modes, live analytics, and publishable results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/Signup">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary/90 text-background text-sm font-medium shadow-l cursor-pointer active:scale-[0.995]">
              Create your first poll
              <IconArrowRight size={15} />
            </button>
          </Link>
          <a href="#how">
            <button className="p-0.5 rounded-[12px] bg-linear-to-b from-white to-stone-200/40 shadow-m active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] cursor-pointer">
              <div className="bg-linear-to-b  from-stone-200/40 to-white/80 rounded-[10px] p-2 flex items-center">
                  <span className="font-medium text-sm text-neutral-950">
                    Get Started
                  </span>
              </div>
            </button>
          </a>
        </div>

        <PollPreview />
      </div>
    </section>
  );
};

export default Hero;
