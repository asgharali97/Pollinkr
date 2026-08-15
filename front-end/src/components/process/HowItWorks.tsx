import CreatePollCard from "./CreatePollCard";

const STEPS = [
  {
    label: "Create your poll",
    sub: "Add questions, set options, configure rules, Start in seconds.",
  },
  {
    label: "Share the link",
    sub: "One URL. Send it anywhere — email, Slack, anywhere.",
  },
  {
    label: "Collect responses",
    sub: "Respondents answer in seconds, no friction.",
  },
  {
    label: "Read the results",
    sub: "Analytics update live. Publish when you're ready.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how"
      className="h-full py-12 px-6 border-t border-dashed border-border"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
          Process
        </p>
        <h2 className="text-3xl sm:text-3xl font-semibold tracking-tight mb-8">
          From idea to insight in four steps.
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 overflow- p-4">
          <div className="bg-background shadow-m shadow-black/5 ring-1 ring-black/5 py-4 px-6 transition-colors rounded-[24px]">
            <CreatePollCard />
            <p className="text-base font-medium text-foreground mb-1">
              Create Your Poll
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Add questions, set options, configure rules, start in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
