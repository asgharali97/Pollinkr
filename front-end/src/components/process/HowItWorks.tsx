import CreatePollCard from "./CreatePollCard";
import ShareLinkCard from "./ShareLinkCard";
import CollectResponsesCard from "./CollectResponsesCard";
import ReadResultsCard from "./ReadResultsCard";

const STEPS = [
  {
    label: "Create your poll",
    sub: "Add questions, set options, configure rules, start in seconds.",
    subClass: "pt-4",
    component: CreatePollCard,
    grid: "row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    label: "Share the link",
    sub: "One URL. Send it anywhere email, Slack, anywhere.",
    subClass: "pt-4",
    component: ShareLinkCard,
    grid: "md:col-span-2 md:row-span-1",
  },
  {
    label: "Collect responses",
    sub: "Respondents answer in seconds.",
    subClass: "pt-2",
    component: CollectResponsesCard,
    grid: "md:col-span-2 md:row-span-1",
  },
  {
    label: "",
    sub: "",
    subClass: "pt-4",
    component: ReadResultsCard,
    grid: "md:col-span-4 md:row-span-1",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how"
      className="h-full border-t border-dashed border-border py-12 px-6"
    >
      <div className="mx-auto max-w-xl sm:max-w-4xl ">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Process
        </p>

        <h2 className="mb-8 text-3xl font-semibold tracking-tight">
          From idea to insight in four steps.
        </h2>

        <div className="grid grid-cols-1 auto-rows-[220px] gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {STEPS.map(({ label, sub, component: Component, grid, subClass }) => (
            <div
              key={label}
              className={`grid h-full grid-rows-[1fr_auto] rounded-[24px] bg-background px-6 py-4 shadow-m shadow-black/5 ring-1 ring-black/5 ${grid}`}
            >
              <div className="h-full w-full select-none min-w-0">
                <Component />
              </div>
              <div className={`${subClass || "pt-4"}`}>
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
