
type StatusBarProps = {
  percentage: number;
  tileCount?: number;
  className?: string;
  tileClassName?: string;
  mutedTileClassName?: string;
};

const StatusBar = ({
  percentage,
  tileCount = 40,
  className = "",
  tileClassName = "bg-primary-light-2",
  mutedTileClassName = "bg-foreground/10",
}: StatusBarProps) => {
  const activeTiles = Math.round((percentage / 100) * tileCount);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: tileCount }).map((_, index) => (
        <div
          key={index}
          className={`h-8 w-2 rounded-[3px] ${
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
    <div className="h-full w-full select-none min-h-0">
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

        <div className="mt-3 flex min-w-0 items-center gap-6">
          <h4 className="shrink-0 text-lg font-medium text-foreground/80 tracking-tight">
            Chose Option 4
          </h4>

          <StatusBar
            percentage={69}
            tileCount={50}
            tileClassName="bg-primary-light-2 shadow-chart shadow-black/5 ring-1 ring-primary-light-2"
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {RESULTS.map((result, index) => (
            <div
              key={result.label}
              className="rounded-xl border border-border bg-background/50 px-4 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <p className="shrink-0 text-xs font-medium text-foreground/80">
                  {result.percentage}% chose {result.label}
                </p>
              </div>

              <div className="mt-3">
                <StatusBar
                  percentage={result.percentage}
                  tileCount={24}
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
