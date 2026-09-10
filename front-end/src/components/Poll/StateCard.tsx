import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  IconLock,
  IconCircleCheck,
  IconAlertCircle,
  IconClock,
} from "@tabler/icons-react";
import { ExpiryBadge } from "./ExpiryBadge";

interface StateCardProps {
  state:
    | "auth-required"
    | "submitted"
    | "not-available"
    | "closed"
    | "published";
  title: string;
  description: string;
  icon?: ReactNode;
  pollTitle?: string;
  shareId?: string;
  button?: React.ReactNode;
  link?: {
    label: string;
    href: string;
  };
  blurred?: boolean;
  pollInfo?: {
    title: string;
    description?: string;
    expiresAt?: string;
  };
}

export function StateCard({
  state,
  title,
  description,
  icon,
  pollTitle,
  button,
  link,
  blurred = false,
  pollInfo,
}: StateCardProps) {
  const stateConfig = {
    "auth-required": {
      icon: <IconLock size={24} className="text-foreground/80" />,
      bgColor: "bg-primary-light-2/70",
      ringColor: "ring-primary-light-2",
      showPollInfo: true,
    },
    submitted: {
      icon: <IconCircleCheck size={24} className="text-foreground/80" />,
      bgColor: "bg-foreground/5",
      ringColor: "ring-border",
      showPollInfo: false,
    },
    "not-available": {
      icon: <IconAlertCircle size={24} className="text-foreground/80" />,
      bgColor: "bg-foreground/5",
      ringColor: "ring-border",
      showPollInfo: false,
    },
    closed: {
      icon: <IconClock size={24} className="text-foreground/80" />,
      bgColor: "bg-foreground/5",
      ringColor: "ring-border",
      showPollInfo: false,
    },
    published: {
      icon: <IconCircleCheck size={24} className="text-foreground/80" />,
      bgColor: "bg-foreground/5",
      ringColor: "ring-border",
      showPollInfo: false,
    },
  };

  const config = stateConfig[state];
  const displayIcon = icon || config.icon;

  return (
    <div className="h-screen bg-background">
      <div className="h-full max-w-2xl mx-auto px-6 py-12">
        {config.showPollInfo && pollInfo && (
          <div
            className={`mb-10 ${blurred ? "opacity-60 pointer-events-none select-none" : ""}`}
          >
            {pollInfo.expiresAt && (
              <ExpiryBadge expiresAt={pollInfo.expiresAt} />
            )}
            <h1 className="text-2xl font-semibold tracking-tight text-foreground/80 mt-2 mb-2">
              {pollInfo.title}
            </h1>
            {pollInfo.description && (
              <p className="text-sm text-foreground/60 leading-relaxed">
                {pollInfo.description}
              </p>
            )}
          </div>
        )}
        <div
          className={`flex flex-col items-center justify-center ${config.showPollInfo ? "" : "max-h-screen h-full"}`}
        >
          <div className="w-full rounded-xl shadow-m shadow-black/5 ring-1 ring-black/5 bg-card py-6 px-8 text-center">
            <div
              className={`w-14 h-14 rounded-2xl bg-primary-light-2/70 shadow-chart ring-1 ring-primary-light-2 flex items-center justify-center mx-auto mb-4`}
            >
              {displayIcon}
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
              {title}
            </h1>

            <p className="text-sm text-foreground/70 leading-relaxed mb-4 max-w-sm mx-auto text-pretty">
              {description}
              {pollTitle && (
                <>
                  <span className="text-foreground font-medium">
                    "{pollTitle}"
                  </span>
                </>
              )}
            </p>

            {button && (
              button
            )}
            <div className="mt-4">
              {link && (
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 text-center text-xs text-muted-foreground pb-8 mt-12">
        Powered by{" "}
        <Link to="/" className="hover:text-foreground transition-colors">
          Pollinkr
        </Link>
      </div>
        </div>
      </div>
    </div>
  );
}
