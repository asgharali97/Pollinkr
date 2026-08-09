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
          <Link
            to="/Signup"
          >
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-foreground/90 text-background text-sm font-medium shadow-l cursor-pointer">
              Create your first poll
              <IconArrowRight size={15} />
            </button>
          </Link>
          <a href="#how">
          <button
            className="bg-muted px-6 py-2.5 rounded-lg shadow-m shadow-black/5 ring-1 ring-black/5 text-sm text-foreground border-l hover:bg-background transition-colors cursor-pointer"
            >
            See how it works
          </button>
        </a>
        </div>

        <PollPreview />
      </div>
    </section>
  );
};

export default Hero;
