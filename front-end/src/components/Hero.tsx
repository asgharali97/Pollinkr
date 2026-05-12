import React from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import PollPreview from "./PollPreview";

const Hero = () => {
  return (
    <section className="mt-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border"
          style={{
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <IconBolt size={12} />
          Real-time responses with WebSocket sync
        </div> */}

        <h1
          className="text-xl sm:text-2xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          Feedback that
          <span className="text-muted-foreground"> actually closes.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
          Create polls, share one link, and collect structured responses — with
          expiry, anonymous modes, live analytics, and publishable results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
          >
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-foreground/90 text-background text-sm font-medium shadow-l cursor-pointer">
              Create your first poll
              <IconArrowRight size={15} />
            </button>
          </Link>
          <button
            className="px-6 py-2.5 rounded-lg shadow-m shadow-black/5 ring-1 ring-black/5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors cursor-pointer"
          >
            See how it works
          </button>
        </div>

        <PollPreview />
      </div>
    </section>
  );
};

export default Hero;
