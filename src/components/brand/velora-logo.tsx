import { cn } from "@/lib/utils";

export function VeloraSymbol({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-tile relative inline-flex items-center justify-center overflow-hidden rounded-lg",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        className="h-[85%] w-[85%] drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="left-wing" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--lilac-deep)" />
            <stop offset="100%" stopColor="var(--lilac-strong)" />
          </linearGradient>
          <linearGradient id="right-wing" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--rose)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
        <path
          d="M32 50L14 14H24L32 34L40 14H50L32 50Z"
          fill="url(#left-wing)"
        />
        <path
          d="M32 50L40 14H50L32 50Z"
          fill="url(#right-wing)"
          opacity="0.9"
        />
        <circle cx="32" cy="50" r="3" fill="var(--foreground)" />
      </svg>
    </span>
  );
}

export function VeloraLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return <VeloraSymbol className={cn("h-10 w-10 shrink-0", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <VeloraSymbol className="h-11 w-11 shrink-0" />
      <div>
        <p className="font-semibold text-foreground text-lg">Velora</p>
        <p className="text-xs text-muted">Gestão de beleza</p>
      </div>
    </div>
  );
}
