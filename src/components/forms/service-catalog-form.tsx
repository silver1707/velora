"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Textarea } from "@/components/ui/field";
import {
  initialActionState,
  type ActionState,
  type ServiceCatalogItem,
} from "@/lib/types";
import {
  createServiceCatalogAction,
  updateServiceCatalogAction,
} from "@/server/actions/service-catalog";

export function ServiceCatalogForm({
  service,
}: {
  service?: ServiceCatalogItem;
}) {
  const action = service ? updateServiceCatalogAction : createServiceCatalogAction;
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Serviço" error={state.errors?.name?.[0]}>
          <Input name="name" required defaultValue={service?.name ?? ""} />
        </Field>
        <Field label="Preço">
          <Input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={service?.price ?? 0}
          />
        </Field>
        <Field label="Duração em minutos">
          <Input
            name="duration_minutes"
            type="number"
            min={5}
            max={720}
            defaultValue={service?.duration_minutes ?? 60}
          />
        </Field>
        <label className="surface-row flex min-h-12 items-center gap-3 rounded-lg px-4 py-3 text-sm">
          <input type="hidden" name="is_active" value="false" />
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={service?.is_active ?? true}
            className="h-4 w-4 accent-lilac-strong"
          />
          <span className="font-medium text-foreground">Disponível na agenda</span>
        </label>
      </div>
      <Field label="Descrição">
        <Textarea
          name="description"
          defaultValue={service?.description ?? ""}
          placeholder="Detalhes que ajudam a cliente a escolher o serviço..."
        />
      </Field>
      <ActionMessage state={state} />
      <SubmitButton>
        {service ? "Salvar serviço" : "Adicionar serviço"}
      </SubmitButton>
    </form>
  );
}
