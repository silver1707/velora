import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-lilac/35 disabled:opacity-50",
        variant === "primary" &&
          "brand-action border-lilac/40 text-foreground shadow-lg shadow-lilac-strong/15 hover:border-lilac/70 hover:brightness-110",
        variant === "secondary" &&
          "border-border/80 bg-surface-raised/80 text-foreground hover:border-lilac/35 hover:bg-surface-glow",
        variant === "ghost" &&
          "border-transparent bg-transparent text-muted hover:bg-surface-raised/70 hover:text-foreground",
        variant === "danger" &&
          "border-danger/40 bg-danger/12 text-danger hover:bg-danger/20",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-lilac/35",
        variant === "primary" &&
          "brand-action border-lilac/40 text-foreground shadow-lg shadow-lilac-strong/15 hover:border-lilac/70 hover:brightness-110",
        variant === "secondary" &&
          "border-border/80 bg-surface-raised/80 text-foreground hover:border-lilac/35 hover:bg-surface-glow",
        variant === "ghost" &&
          "border-transparent bg-transparent text-muted hover:bg-surface-raised/70 hover:text-foreground",
        variant === "danger" &&
          "border-danger/40 bg-danger/12 text-danger hover:bg-danger/20",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        className,
      )}
      {...props}
    />
  );
}
