import { Link } from "react-router-dom";
import { IconHome, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 font-sans">
      <div className="text-center max-w-md">
        <p className="text-7xl font-semibold tracking-tighter text-foreground/10 mb-2 select-none">
          404
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <IconHome size={16} />
              Back to home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <IconArrowLeft size={16} />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
