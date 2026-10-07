import { useEffect, useState } from 'react';
import { IconTimeline } from '@tabler/icons-react';

const RESPONSE_ACTIVITY = [
  32, 46, 38, 58, 42, 66, 52, 48, 32, 64, 56, 28, 42, 56, 32, 58, 32, 46, 38, 58, 42, 66, 52, 48, 32, 64, 56, 28, 42,32, 46, 38, 58, 42,
];

const CollectResponsesCard = () => {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMd(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Show 1/3 on md+, full on smaller screens
 const displayData = isMd 
  ? RESPONSE_ACTIVITY.slice(0, Math.ceil(RESPONSE_ACTIVITY.length / 2))
  : RESPONSE_ACTIVITY.slice(0, 20); // Show only 20 bars on mobile instead of all 36

  return (
    <div className="h-full w-full select-none">
      <div className="flex h-full flex-col rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-end gap-2">
            <h5 className="text-3xl font-medium tracking-tight text-foreground/80 max-md:text-4xl">
              0.8s
            </h5>
            <span className="mb-1 text-[10px] text-muted-foreground max-md:text-xs">
              average
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <IconTimeline className="size-4 text-primary-light-2 max-md:size-5" />
            <span className="text-[10px] text-foreground/70 max-md:text-xs">Seamless</span>
          </div>
        </div>

        <div className="w-full mt-5 flex h-20 items-end justify-center gap-1 max-md:mt-4 overflow-hidden min-w-0">
          {displayData.map((height, index) => (
            <div
              key={index}
              className="flex h-full min-w-4.5 flex-1 items-end rounded-md bg-primary-light-1/40 p-0.5 bg-[repeating-linear-gradient(-315deg,#ffff,#ffff_1px,transparent_0,transparent_50%)] bg-size-[8px_8px] max-w-3"
            >
              <div
                className="w-full rounded-sm bg-primary-light-2 shadow-chart shadow-black/5 ring-1 ring-primary-light-2"
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