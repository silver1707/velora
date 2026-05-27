"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  appointmentStatuses,
  paymentMethods,
  serviceTypes,
} from "@/lib/constants";
import {
  initialActionState,
  type ActionState,
  type Client,
  type Product,
  type ServiceRecord,
} from "@/lib/types";
import { inputDateTimeValue } from "@/lib/utils";
import {
  createServiceAction,
  updateServiceAction,
} from "@/server/actions/services";

export function ServiceForm({
  service,
  clients,
  products,
  defaultClientId,
}: {
  service?: ServiceRecord;
  clients: Client[];
  products: Product[];
  defaultClientId?: string;
}) {
  const action = service ? updateServiceAction : createServiceAction;
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    initialActionState,
  );
  const selectedProducts = new Map(
    service?.service_products?.map((item) => [item.product_id, item]) ?? [],
  );

  return (
    <form action={formAction} className="grid gap-4">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cliente" error={state.errors?.client_id?.[0]}>
          <Select
            name="client_id"
            required
            defaultValue={service?.client_id ?? defaultClientId ?? ""}
          >
            <option value="">Selecionar cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Serviço" error={state.errors?.service_type?.[0]}>
          <Select name="service_type" required defaultValue={service?.service_type ?? ""}>
            <option value="">Selecionar serviço</option>
            {serviceTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </Select>
        </Field>
        <Field label="Data e horário" error={state.errors?.scheduled_at?.[0]}>
          <Input
            name="scheduled_at"
            type="datetime-local"
            required
            defaultValue={inputDateTimeValue(service?.scheduled_at)}
          />
        </Field>
        <Field label="Duração aproximada">
          <Input
            name="duration_minutes"
            type="number"
            min={5}
            max={720}
            defaultValue={service?.duration_minutes ?? 60}
          />
        </Field>
        <Field label="Valor cobrado">
          <Input
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={service?.price ?? 0}
          />
        </Field>
        <Field label="Pagamento">
          <Select name="payment_method" defaultValue={service?.payment_method ?? ""}>
            <option value="">Selecionar</option>
            {paymentMethods.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={service?.status ?? "agendado"}>
            {appointmentStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="surface-row rounded-lg p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground">Produtos usados</h3>
          <p className="mt-1 text-xs text-muted">
            Relacione os produtos ao atendimento para manter o histórico técnico.
          </p>
        </div>
        <div className="grid gap-3">
          {products.length ? (
            products.map((product) => {
              const selected = selectedProducts.get(product.id);
              return (
                <label
                  key={product.id}
                  className="grid gap-3 rounded-lg border border-border/65 bg-background/35 p-3 sm:grid-cols-[1fr_90px]"
                >
                  <span className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      name="product_ids"
                      value={product.id}
                      defaultChecked={Boolean(selected)}
                      className="mt-1 h-4 w-4 accent-lilac-strong"
                    />
                    <span>
                      <span className="block font-medium text-foreground">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted">
                        {product.brand ?? "Sem marca"} • estoque {product.stock_quantity}
                      </span>
                    </span>
                  </span>
                  <Input
                    name={`quantity_${product.id}`}
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={selected?.quantity_used ?? 1}
                    aria-label={`Quantidade de ${product.name}`}
                  />
                </label>
              );
            })
          ) : (
            <p className="text-sm text-muted">
              Cadastre produtos para relacionar ao atendimento.
            </p>
          )}
        </div>
      </div>

      <Field label="Observações">
        <Textarea
          name="notes"
          defaultValue={service?.notes ?? ""}
          placeholder="Fórmula, tempo de pausa, resultado, próximos cuidados..."
        />
      </Field>

      <ActionMessage state={state} />
      <SubmitButton>{service ? "Salvar atendimento" : "Criar atendimento"}</SubmitButton>
    </form>
  );
}
