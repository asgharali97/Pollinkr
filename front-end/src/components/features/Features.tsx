import ShareLinkCard from "../process/ShareLinkCard";
import CollectResponsesCard from "../process/CollectResponsesCard";
import AuthBtn from "./AuthBtn";
import ExpireDate from "./ExpireDate";

const FEATURES = [
  {
    label: "One link, open to anyone",
    sub: "Create a poll and share a single link. No installs, no accounts required for respondents.",
    component: ShareLinkCard,
    grid: "col-span-2 row-span-1",
  },
  {
    label: "Expiry built in",
    sub: "Set a deadline. Once it passes, the poll closes automatically. No manual intervention.",
    component: ExpireDate,
    grid: "col-span-2 row-span-2",
  },
   {
    label: "Anonymous or authenticated",
    sub: "Decide if responses should be tied to identities or kept fully anonymous — per poll.",
    component: AuthBtn ,
    grid: "col-span-2 row-span-1",
  },
  {
    label: "Live analytics",
    sub: "Watch responses arrive in real time.",
    component: CollectResponsesCard,
    grid: "col-span-2 row-span-1",
  },
  {
    label: "Mandatory & optional questions",
    sub: "Not every question needs an answer. Mark what's required and let respondents skip the rest.",
    component: RequiredQuestions,
    grid: "col-span-2 row-span-2",
  },
  {
    label: "Publish final results",
    sub: "When you're done, publish. Anyone with the link can now see the outcome — transparently.",
    component: PublishResults,
    grid: "col-span-2 row-span-2",
  },
];

const Features = () => {
  return (
    <section id="features" className="px-6 py-12 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
          Features
        </p>
        <h2
          className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance"
          style={{ letterSpacing: "-0.02em" }}
        >
          Everything a poll actually needs.
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-lg md:text-pretty">
          Not a form builder. Not a survey tool with 40 features you won't use.
          Just what you need to ask, collect, and understand.
        </p>

        <div className="grid auto-rows-[220px] grid-cols-4 gap-4">
          {FEATURES.map(({ label, sub, component: Component, grid }) => (
            <div
              key={label}
              className={`grid  grid-rows-[1fr_auto] rounded-[24px] bg-background px-6 py-4 shadow-m shadow-black/5 ring-1 ring-black/5 ${grid}`}
            >
              <div className="flex items-start">
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

export default Features;
