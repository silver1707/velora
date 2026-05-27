"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input } from "@/components/ui/field";
import { initialActionState, type ActionState, type ProfileSettings } from "@/lib/types";
import { updateProfileSettingsAction } from "@/server/actions/settings";

export function ProfileSettingsForm({
  profile,
  bookingUrl,
}: {
  profile: ProfileSettings;
  bookingUrl?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateProfileSettingsAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome">
          <Input name="full_name" defaultValue={profile.full_name ?? ""} />
        </Field>
        <Field label="Nome do salão">
          <Input name="business_name" defaultValue={profile.business_name ?? ""} />
        </Field>
        <Field
          label="Link público"
          hint={bookingUrl ? bookingUrl : "Exemplo: salao-da-maria"}
        >
          <Input
            name="public_slug"
            defaultValue={profile.public_slug ?? ""}
            placeholder="salao-da-maria"
          />
        </Field>
        <Field label="WhatsApp profissional">
          <Input
            name="whatsapp_phone"
            defaultValue={profile.whatsapp_phone ?? ""}
            placeholder="(11) 99999-9999"
          />
        </Field>
      </div>

      <label className="surface-row flex items-start gap-3 rounded-lg p-4 text-sm">
        <input type="hidden" name="booking_enabled" value="false" />
        <input
          type="checkbox"
          name="booking_enabled"
          defaultChecked={profile.booking_enabled}
          className="mt-1 h-4 w-4 accent-lilac-strong"
        />
        <span>
          <span className="block font-semibold text-foreground">
            Ativar agendamento online
          </span>
          <span className="mt-1 block leading-5 text-muted">
            Clientes poderão escolher horários livres pelo seu link e enviar pedidos
            para aprovação no dashboard.
          </span>
        </span>
      </label>

      <ActionMessage state={state} />
      <SubmitButton>Salvar ajustes</SubmitButton>
    </form>
  );
}
