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
    <label className="grid gap-1.5 text-sm group">
      <span className="font-semibold text-muted-strong text-[13px] tracking-wide uppercase transition-colors group-focus-within:text-lilac ml-1">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-xs font-medium text-danger mt-1 ml-1 animate-in fade-in slide-in-from-top-1">{error}</span>
      ) : hint ? (
        <span className="text-xs font-medium text-muted mt-1 ml-1">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputClassName =
  "h-12 w-full rounded-2xl border border-border-soft bg-background/50 px-4 text-sm font-medium text-foreground outline-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 placeholder:text-muted/70 hover:border-border-strong hover:bg-background/80 focus:border-lilac/60 focus:bg-background focus:ring-4 focus:ring-lilac/15 focus:shadow-[0_0_20px_-5px_var(--lilac)]";

export const textareaClassName =
  "min-h-[120px] w-full rounded-2xl border border-border-soft bg-background/50 px-4 py-4 text-sm font-medium text-foreground outline-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 placeholder:text-muted/70 hover:border-border-strong hover:bg-background/80 focus:border-lilac/60 focus:bg-background focus:ring-4 focus:ring-lilac/15 focus:shadow-[0_0_20px_-5px_var(--lilac)]";

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
        "select-chevron appearance-none pr-9 cursor-pointer",
        props.className,
      )}
      {...props}
    />
  );
}
