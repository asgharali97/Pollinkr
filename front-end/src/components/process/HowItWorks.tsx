import CreatePollCard from "./CreatePollCard";
import ShareLinkCard from "./ShareLinkCard";
import CollectResponsesCard from "./CollectResponsesCard";
import ReadResultsCard from "./ReadResultsCard";

const STEPS = [
  {
    label: "Create your poll",
    sub: "Add questions, set options, configure rules, start in seconds.",
    component: CreatePollCard,
    grid: "col-span-2 row-span-2",
  },
  {
    label: "Share the link",
    sub: "One URL. Send it anywhere email, Slack, anywhere.",
    component: ShareLinkCard,
    grid: "col-span-2 row-span-1",
  },
  {
    label: "Collect responses",
    sub: "Respondents answer in seconds, no friction.",
    component: CollectResponsesCard,
    grid: "col-span-2 row-span-1",
  },
  {
    label: "",
    sub: "",
    component: ReadResultsCard,
    grid: "col-span-4 rows-span-1",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how"
      className="h-full border-t border-dashed border-border px-6 py-12"
    >
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Process
        </p>

        <h2 className="mb-8 text-3xl font-semibold tracking-tight">
          From idea to insight in four steps.
        </h2>

        <div className="grid auto-rows-[200px] gril-cols-1 md:auto-rows-[220px] md:grid-cols-4 gap-4">
          {STEPS.map(({ label, sub, component: Component, grid }) => (
            <div
              key={label}
              className={`grid h-full grid-rows-[1fr_auto] rounded-[24px] bg-background px-6 py-4 shadow-m shadow-black/5 ring-1 ring-black/5 ${grid}`}
            >
              <div className="flex items-start min-h-0">
                <Component />
              </div>

              <div className="pt-4">
                <p className="text-lg font-medium text-balance text-foreground/90 leading-7">
                  {label}
                </p>

                <p className="text-base leading-6 text-muted-foreground md:text-pretty">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;