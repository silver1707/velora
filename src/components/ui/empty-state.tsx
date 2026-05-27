import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-lilac/20 bg-surface-soft/60 p-8 text-center",
        className,
      )}
    >
      <div className="brand-tile mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
        <Sparkles size={20} />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
    </div>
  );
}
