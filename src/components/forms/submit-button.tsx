"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  variant = "primary",
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      variant={variant}
      className={className}
    >
      {pending ? <Loader2 className="animate-spin" size={16} /> : null}
      {pending ? "Salvando..." : children}
    </Button>
  );
}
