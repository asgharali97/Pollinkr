import React, { useState, useEffect, useRef } from "react";

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

const STEPS = [
  { label: "Create your poll", sub: "Add questions, set options, configure rules." },
  { label: "Share the link", sub: "One URL. Send it anywhere — email, Slack, anywhere." },
  { label: "Collect responses", sub: "Respondents answer in seconds, no friction." },
  { label: "Read the results", sub: "Analytics update live. Publish when you're ready." },
];

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const visible = useInView(ref);

  return (
    <section id="how" className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Process
          </p>
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-16"
            style={{ letterSpacing: "-0.02em" }}
          >
            From idea to insight in four steps.
          </h2>
        </FadeIn>

        <div
          ref={ref}
          className="grid sm:grid-cols-2 gap-px border border-border rounded-xl overflow-hidden"
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="p-8 transition-colors"
              style={{
                background: "hsl(var(--card))",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.45s ease ${i * 80}ms, transform 0.45s ease ${i * 80}ms`,
              }}
            >
              <span
                className="text-xs font-semibold tabular-nums mb-4 block"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                0{i + 1}
              </span>
              <p className="text-base font-medium text-foreground mb-1">
                {step.label}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
