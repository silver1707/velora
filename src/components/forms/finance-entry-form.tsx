"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { paymentMethods } from "@/lib/constants";
import {
  initialActionState,
  type ActionState,
  type Client,
  type ServiceRecord,
} from "@/lib/types";
import { createFinanceEntryAction } from "@/server/actions/finance";

export function FinanceEntryForm({
  clients,
  services,
}: {
  clients: Client[];
  services: ServiceRecord[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createFinanceEntryAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cliente">
          <Select name="client_id" defaultValue="">
            <option value="">Sem cliente vinculada</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Atendimento">
          <Select name="service_record_id" defaultValue="">
            <option value="">Lançamento avulso</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.service_type} • {service.clients?.name ?? "Cliente"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Valor recebido" error={state.errors?.amount?.[0]}>
          <Input name="amount" type="number" min={0} step="0.01" required />
        </Field>
        <Field label="Forma de pagamento">
          <Select name="payment_method" defaultValue="">
            <option value="">Selecionar</option>
            {paymentMethods.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </Select>
        </Field>
        <Field label="Recebido em" error={state.errors?.received_at?.[0]}>
          <Input name="received_at" type="datetime-local" required />
        </Field>
      </div>
      <Field label="Observações">
        <Textarea name="notes" />
      </Field>
      <ActionMessage state={state} />
      <SubmitButton>Registrar recebimento</SubmitButton>
    </form>
  );
}
