import {
  IconToggleLeft,
  IconToggleRight,
  IconLock,
  IconLockOpen,
} from "@tabler/icons-react";
import { useState } from "react";

const AuthBtn = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="mb-2 h-full w-full select-none rounded-2xl bg-muted/90 px-4 py-2 flex justify-center border-border items-center shadow-m shadow-black/5 ring-1 ring-black/5">
      <div className="w-full rounded-2xl bg-card p-1.5 shadow-m">
        <div className="w-full flex items-center">
          <button
            className="w-full p-0.5 rounded-[10px] bg-linear-to-b from-white to-stone-200/40 shadow-m shadow-black/5 ring-1 ring-black/5 active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995] cursor-pointer"
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            <div className="bg-linear-to-b  from-stone-200/40 to-white/80 rounded-[8px] p-2 gap-2 flex items-center justify-between">
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
    </div>
  );
};

export default AuthBtn;
