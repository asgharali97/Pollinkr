import React from "react";


const STEPS = [
  { label: "Create your poll", sub: "Add questions, set options, configure rules." },
  { label: "Share the link", sub: "One URL. Send it anywhere — email, Slack, anywhere." },
  { label: "Collect responses", sub: "Respondents answer in seconds, no friction." },
  { label: "Read the results", sub: "Analytics update live. Publish when you're ready." },
];

const HowItWorks = () => {

  return (
    <section id="how" className="py-12 px-6 border-t border-dashed border-border">
      <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Process
          </p>
          <h2
            className="text-3xl sm:text-3xl font-semibold tracking-tight mb-12 "
          >
            From idea to insight in four steps.
          </h2>

        <div
          className="grid sm:grid-cols-2 gap-4 overflow-hidden py-4"
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="p-8 transition-colors border"
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
