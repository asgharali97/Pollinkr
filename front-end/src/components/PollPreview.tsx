import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";

const PollPreview = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    "Weekly short surveys",
    "One long annual form",
    "Async Slack threads",
    "No structured process",
  ];
  return (
    <>
      <div className="mt-16 max-w-sm mx-auto text-left">
        <div
          className="rounded-3xl shadow-s p-2 bg-card "
        >
          <div className="w-full h-full bg-border/40 p-4 rounded-2xl shadow-m">

            {!submitted ? (
              <>
                <p className="text-xs text-foreground/60 mb-1 uppercase tracking-widest font-medium">
                  Q1 of 2
                </p>
                <p className="text-sm font-medium text-foreground/80 mb-4 leading-snug">
                  How does your team currently collect internal feedback?
                </p>
                <div className="flex flex-col gap-2">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className="text-left px-3 py-2.5 rounded-xl bg-card text-sm text-muted-foreground shadow-s transition-all border"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  disabled={selected === null}
                  onClick={() => setSubmitted(true)}
                  className="mt-4 w-full py-2 rounded-md text-sm text-muted-foreground font-medium transition-all"
                  style={{
                    background:
                      selected !== null
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted))",
                    color:
                      selected !== null
                       ? "hsl(var(--background))"
                        : "hsl())",
                    cursor: selected !== null ? "pointer" : "not-allowed",
                  }}
                >
                  Submit response
                </button>
              </>
            ) : (
              <div className="py-4 text-center">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-3">
                  <IconCheck size={18} className="text-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Response recorded
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Results update live for the poll creator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground my-4">
        This is what your respondents see.
      </p>
    </>
  );
};

export default PollPreview;
