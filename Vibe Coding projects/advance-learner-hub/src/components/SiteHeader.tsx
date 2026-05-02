import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Advance AI</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Learner Directory
            </div>
          </div>
        </Link>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="h-2 w-2 rounded-full bg-success" />
          Internal Admin View
        </div>
      </div>
    </header>
  );
}
