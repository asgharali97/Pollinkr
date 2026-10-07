
import { useEffect, useState } from "react";

type StatusBarProps = {
  percentage: number;
  tileCount?: number;
  lgTileCount?: number;
  className?: string;
  tileClassName?: string;
  mutedTileClassName?: string;
};

const StatusBar = ({
  percentage,
  tileCount = 40,
  lgTileCount,
  className = "",
  tileClassName = "bg-primary-light-2",
  mutedTileClassName = "bg-foreground/10",
}: StatusBarProps) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 865px)");
    const updateScreenSize = () => setIsLargeScreen(mediaQuery.matches);

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  const responsiveTileCount = isLargeScreen && lgTileCount ? lgTileCount : tileCount;
  const activeTiles = Math.round((percentage / 100) * responsiveTileCount);

  return (
    <div className={`flex w-full min-w-0 items-center gap-1 sm:gap-1.5 ${className}`}>
      {Array.from({ length: responsiveTileCount }).map((_, index) => (
        <div
          key={index}
          className={`h-8 min-w-0 flex-1 rounded-[3px] ${
            index < activeTiles ? tileClassName : mutedTileClassName
          }`}
        />
      ))}
    </div>
  );
};

const RESULTS = [
  {
    label: "Option B",
    percentage: 60,
  },
  {
    label: "Option E",
    percentage: 46,
  },
  {
    label: "Option C",
    percentage: 36,
  },
];

const ReadResultsCard = () => {
  return (
    <div className="h-full min-h-0 w-full min-w-0 select-none">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-end gap-2">
              <h5 className="text-4xl font-medium tracking-tight text-foreground/90">
                546
              </h5>

              <span className="mb-1 text-[11px] text-muted-foreground">
                of responses
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-[9px] font-medium text-muted-foreground bg-muted/70 border py-0.5 px-1 rounded-md shadow-m ring-1 ring-card/80">
              Updated live
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row min-w-0 gap-4 sm:items-center">
          <h4 className="text-lg font-medium tracking-tight text-foreground/80 sm:shrink-0 sm:my-0 my-2">
            69% Chose Option 4
          </h4>

          <StatusBar
            percentage={69}
            tileCount={40}
            lgTileCount={47}
            className="sm:min-w-0 sm:flex-1"
            tileClassName="bg-primary-light-2 shadow-chart shadow-black/5 ring-1 ring-primary-light-2"
          />
        </div>

        <div className="mt-6 hidden sm:flex flex-wrap justify-between gap-y-3 sm:gap-y-4">
          {RESULTS.map((result, index) => (
            <div
              key={result.label}
              className="w-[calc(50%-0.375rem)] min-w-0 rounded-xl border border-border bg-background/50 px-3 py-2 sm:w-[calc(33.333%-0.667rem)] sm:px-4"
            >
              <div className="flex min-w-0 items-center gap-2">
                <p className="min-w-0 text-[11px] font-medium leading-tight text-foreground/80 sm:text-xs">
                  {result.percentage}% chose {result.label}
                </p>
              </div>

              <div className="mt-3">
                <StatusBar
                  percentage={result.percentage}
                  tileCount={18}
                  tileClassName={
                    index === 0 ? "bg-primary-light-2/90 shadow-chart shadow-black/5 ring-1 ring-primary-light-2/90" : "bg-primary-light-2/70 shadow-chart shadow-black/5 ring-1 ring-primary-light-2/80"
                  }
                  mutedTileClassName="bg-foreground/8"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadResultsCard;
