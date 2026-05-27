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
  "h-11 w-full rounded-lg border border-border/75 bg-background/45 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-strong focus:border-lilac/60 focus:bg-surface/85 focus:ring-2 focus:ring-lilac/15";

export const textareaClassName =
  "min-h-24 w-full rounded-lg border border-border/75 bg-background/45 px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-strong focus:border-lilac/60 focus:bg-surface/85 focus:ring-2 focus:ring-lilac/15";

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
