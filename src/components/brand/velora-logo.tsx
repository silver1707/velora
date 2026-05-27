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
        className="h-[78%] w-[78%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.4 15.5L27.4 48.5H36.3L48.5 15.5H39.2L32.2 38.3L25 15.5H15.4Z"
          fill="currentColor"
          className="text-foreground"
        />
        <path
          d="M20.2 45.9L45.6 20.5"
          stroke="var(--lilac)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="18.6" cy="47.4" r="5.2" fill="var(--mint)" />
        <circle cx="47" cy="19.1" r="5.2" fill="var(--rose)" />
        <path
          d="M43.5 43.2C47.1 43.2 50 40.3 50 36.7C50 40.3 52.9 43.2 56.5 43.2C52.9 43.2 50 46.1 50 49.7C50 46.1 47.1 43.2 43.5 43.2Z"
          fill="var(--gold)"
        />
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
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <VeloraSymbol className={compact ? "h-10 w-10" : "h-11 w-11"} />
      <div className={compact ? "leading-tight" : undefined}>
        <p className={cn("font-semibold text-foreground", compact ? "text-base" : "text-lg")}>
          Velora
        </p>
        <p className="text-xs text-muted">Gestão de beleza</p>
      </div>
    </div>
  );
}
