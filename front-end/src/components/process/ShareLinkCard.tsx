import { AnimatePresence, motion } from "motion/react";
import { IconCheck, IconCopy, IconLink } from "@tabler/icons-react";
import { useState } from "react";

const SHARE_URL = "pollinkr.com/p/7xK2mQ";

const ShareLinkCard = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${SHARE_URL}`);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  };

  return (
    <div
      className="mb-2 h-full w-full select-none rounded-2xl bg-muted/90 px-4 py-2 flex justify-center  border-border items-center shadow-m shadow-black/5 ring-1 ring-black/5"
      // style={{
      //   maskImage:
      //     "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
      //   WebkitMaskImage:
      //     "linear-gradient(to left, transparent, black 90%), linear-gradient(to top, transparent, black 20%)",
      //   maskComposite: "intersect",
      //   WebkitMaskComposite: "source-in",
      // }}
    >
      <div className="w-full rounded-2xl bg-card p-1.5 shadow-m">
        <div className="w-full flex items-center rounded-[10px] bg-background p-1 shadow-m shadow-black/5 ring-1 ring-black/5">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-primary-light-1/20"
          >
            <IconLink size={15} className="text-primary-light-2" />
          </motion.div>

          <input
            type="text"
            readOnly
            placeholder={SHARE_URL}
            aria-label="Poll share link"
            className="min-w-0 flex-1 bg-transparent px-2 text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
          />

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Link copied" : "Copy link"}
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-primary-light-1/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(2px)",
                  }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="flex"
                >
                  <IconCheck size={15} className="text-primary-light-2" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    filter: "blur(2px)",
                  }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="flex"
                >
                  <IconCopy size={15} className="text-primary-light-2" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkCard;
