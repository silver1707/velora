"use client";

import { useActionState } from "react";
import { initialActionState, type ActionState } from "@/lib/types";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";

type QuickActionFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  fields: Record<string, string>;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  confirmMessage?: string;
};

export function QuickActionForm({
  action,
  fields,
  label,
  variant = "secondary",
  confirmMessage,
}: QuickActionFormProps) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form
      action={formAction}
      className="grid gap-2"
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <SubmitButton variant={variant}>{label}</SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
