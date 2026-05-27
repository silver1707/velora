"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import type { ActionState } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ActionMessage({ state }: { state: ActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        state.ok
          ? "border-mint/30 bg-mint/10 text-mint"
          : "border-danger/30 bg-danger/10 text-danger",
      )}
    >
      {state.ok ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}
      <span>{state.message}</span>
    </div>
  );
}
