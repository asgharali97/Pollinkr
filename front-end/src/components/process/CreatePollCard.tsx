import { useState } from "react";
import {
  IconPlus,
  IconToggleLeft,
  IconToggleRight,
  IconLock,
  IconLockOpen,
  IconQuestionMark,
} from "@tabler/icons-react";

const POLL_DATA = {
  title: "Q3 Product Feedback",
  isAnonymous: false,
  questions: [
    "Which feature would have the biggest impact?",
    "How often do you use the product?",
    "What is your primary use case?",
  ],
};

const CreatePollCard = () => {
  const [isAnonymous, setIsAnonymous] = useState(POLL_DATA.isAnonymous);

  return (
    <div
      className="flex w-full min-w-0 flex-col select-none rounded-xl border border-border bg-card p-3 mb-1 md:p-3 lg:mb-2 lg:rounded-2xl lg:p-4"
      style={{
        maskImage:
          "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
        WebkitMaskImage:
          "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="mb-1 flex min-w-0 flex-col rounded-[9px] bg-background px-2.5 py-2 md:px-2.5 lg:px-3">
        <div className="mb-1">
          <p className="text-sm font-medium text-foreground truncate  py-2 bg-  border-neutral-100 rounded-lg -m">
            {POLL_DATA.title}
          </p>
        </div>
        <div className="mb-4 space-y-2 md:mb-4 lg:mb-6">
          {POLL_DATA.questions.map((q, idx) => (
            <div key={idx} className="flex min-w-0 items-start gap-2.5 lg:gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-light-1/50 flex items-center justify-center shrink-0 mt-0.5">
                <IconQuestionMark size={14} className="text-primary-light-3/90" />
              </div>
              <p className="min-w-0 truncate pt-1 text-xs leading-snug text-foreground">
                {q}
              </p>
            </div>
          ))}
        </div>
        <button className="mb-3 cursor-pointer rounded-xl bg-linear-to-b from-white to-stone-200/40 p-0.5 shadow-m shadow-black/5 ring-1 ring-black/5 active:scale-[0.995] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] lg:mb-4">
          <div className="flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-b from-stone-200/40 to-white/80 p-1.5 lg:p-2">
            <IconPlus size={14} className="text-primary-light-1" />
            <span className="text-sm text-foreground/90">Add question</span>
          </div>
        </button>
        <button
          className="mb-3 cursor-pointer rounded-xl bg-linear-to-b from-white to-stone-200/40 p-0.5 shadow-m shadow-black/5 ring-1 ring-black/5 active:scale-[0.995] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] lg:mb-4"
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <div className="flex items-center justify-between gap-2 rounded-[10px] bg-linear-to-b from-stone-200/40 to-white/80 p-1.5 lg:p-2">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <IconLockOpen size={14} className="text-primary-light-2" />
              ) : (
                <IconLock size={14} className="text-primary-light-2" />
              )}
              <span className="text-xs text-foreground/80">
                {isAnonymous ? "Anonymous" : "Authenticated"}
              </span>
            </div>
            <div>
              {isAnonymous ? (
                <IconToggleRight size={16} className="text-primary-light-2" />
              ) : (
                <IconToggleLeft size={16} className="text-primary-light-2" />
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CreatePollCard;
