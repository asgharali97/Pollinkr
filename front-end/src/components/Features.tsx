import React, { useEffect, useRef, useState } from "react";
import {
  IconChartBar,
  IconLink,
  IconLock,
  IconClock,
  IconUsers,
  IconEye,
} from "@tabler/icons-react";

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null!);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const FEATURES = [
  {
    icon: IconLink,
    title: "One link, open to anyone",
    desc: "Create a poll and share a single link. No installs, no accounts required for respondents.",
  },
  {
    icon: IconLock,
    title: "Anonymous or authenticated",
    desc: "Decide if responses should be tied to identities or kept fully anonymous — per poll.",
  },
  {
    icon: IconClock,
    title: "Expiry built in",
    desc: "Set a deadline. Once it passes, the poll closes automatically. No manual intervention.",
  },
  {
    icon: IconChartBar,
    title: "Live analytics",
    desc: "Watch responses arrive in real time. Option counts, participation rates, summaries — always current.",
  },
  {
    icon: IconUsers,
    title: "Mandatory & optional questions",
    desc: "Not every question needs an answer. Mark what's required and let respondents skip the rest.",
  },
  {
    icon: IconEye,
    title: "Publish final results",
    desc: "When you're done, publish. Anyone with the link can now see the outcome — transparently.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Features
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything a poll actually needs.
          </h2>
          <p className="text-muted-foreground text-base mb-16 max-w-lg">
            Not a form builder. Not a survey tool with 40 features you won't
            use. Just what you need to ask, collect, and understand.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div
                className="p-5 rounded-xl border h-full"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "hsl(var(--muted))" }}
                >
                  <f.icon size={16} className="text-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1.5">
                  {f.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
