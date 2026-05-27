import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputClassName =
  "h-12 w-full rounded-xl border border-border-soft bg-surface-raised/30 px-4 text-sm text-foreground outline-none shadow-inner backdrop-blur-sm transition-all duration-300 placeholder:text-muted focus:border-lilac/50 focus:bg-surface-raised/60 focus:ring-[3px] focus:ring-lilac/15";

export const textareaClassName =
  "min-h-[120px] w-full rounded-xl border border-border-soft bg-surface-raised/30 px-4 py-4 text-sm text-foreground outline-none shadow-inner backdrop-blur-sm transition-all duration-300 placeholder:text-muted focus:border-lilac/50 focus:bg-surface-raised/60 focus:ring-[3px] focus:ring-lilac/15";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClassName, props.className)} {...props} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea className={cn(textareaClassName, props.className)} {...props} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        inputClassName,
        "select-chevron appearance-none pr-9",
        props.className,
      )}
      {...props}
    />
  );
}
