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
      className="rounded-2xl bg-card flex-col border border-border p-4 mb-1 select-none"
      style={{
        maskImage:
          "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
        WebkitMaskImage:
          "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="bg-background shadow-black/5 ring-1 shadow-m ring-black/5 rounded-[9px] py-2 px-3 mb-1 flex flex-col">
        <div className="mb-1">
          <p className="text-sm font-medium text-foreground truncate  py-2 bg-  border-neutral-100 rounded-lg -m">
            {POLL_DATA.title}
          </p>
        </div>
        <div className="space-y-2 mb-6">
          {POLL_DATA.questions.map((q, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconQuestionMark size={14} className="text-sky-300" />
              </div>
              <p className="text-xs text-foreground truncate leading-snug pt-1">
                {q}
              </p>
            </div>
          ))}
        </div>
        <button className="p-0.5 rounded-[12px] bg-linear-to-b from-white to-stone-200/40 shadow-m shadow-black/5 ring-1 ring-black/5 active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] cursor-pointer mb-4">
          <div className="bg-linear-to-b  from-stone-200/40 to-white/80 rounded-[10px] p-2 flex items-center justify-center gap-2">
            <IconPlus size={14} className="text-cyan-200" />
            <span className="text-sm text-foreground/90">Add question</span>
          </div>
        </button>
        <button
          className="p-0.5 rounded-[12px] bg-linear-to-b from-white to-stone-200/40 shadow-m shadow-black/5 ring-1 ring-black/5 active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] cursor-pointer mb-4"
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <div className="bg-linear-to-b  from-stone-200/40 to-white/80 rounded-[10px] p-2 gap-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <IconLockOpen size={14} className="text-emerald-300" />
              ) : (
                <IconLock size={14} className="text-emerald-400" />
              )}
              <span className="text-xs text-foreground/80">
                {isAnonymous ? "Anonymous" : "Authenticated"}
              </span>
            </div>
            <div>
              {isAnonymous ? (
                <IconToggleRight size={16} className="text-emerald-300" />
              ) : (
                <IconToggleLeft size={16} className="text-emerald-400" />
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CreatePollCard;
