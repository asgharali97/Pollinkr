import { IconTimeline } from '@tabler/icons-react';
const RESPONSE_ACTIVITY = [
  32, 46, 38, 58, 42, 66, 52, 48, 32, 64, 56, 28, 42, 56, 32, 58,
];

const CollectResponsesCard = () => {
  return (
    <div className="h-full w-full select-none">
      <div className="flex h-full flex-col rounded-lg">
        <div className="flex items-center justify-between overflow-hidden">
          <div className="flex items-end gap-2">
          <h5 className="text-3xl font-medium tracking-tight text-foreground/80">
            0.8s
          </h5>

          <span className="mb-1 text-[10px] text-muted-foreground">
            average
          </span>
        </div>

          <div className="flex h-full items-center gap-1.5 mt-3">
            <IconTimeline className="size-4 text-primary-light-2" />
            <span className="text-[10px] text-foreground/70">Seamless</span>
          </div>
        </div>

        <div className="mt-3 flex h-18 items-end gap-1">
          {RESPONSE_ACTIVITY.map((height, index) => (
            <div
              key={index}
              className={`flex items-end flex-1 h-full rounded-md bg-primary-light-1/40 p-0.5 bg-[repeating-linear-gradient(-315deg,#ffff,#ffff_1px,transparent_0,transparent_50%)] bg-[size:8px_8px]`}
              
            >
              <div
                className={`w-full rounded-sm  bg-primary-light-2 shadow-chart shadow-black/5 ring-1 ring-primary-light-2`}
                style={{ height: `${height}px` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectResponsesCard;
