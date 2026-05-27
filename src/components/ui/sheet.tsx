"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetProps = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  widthClassName?: string;
};

export function Sheet({
  title,
  description,
  trigger,
  children,
  widthClassName,
}: SheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Fechar painel"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className={cn(
              "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-border bg-surface shadow-2xl",
              widthClassName,
            )}
          >
            <header className="soft-divider flex items-start justify-between gap-4 border-b p-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </Button>
            </header>
            <div className="scrollbar-soft flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
