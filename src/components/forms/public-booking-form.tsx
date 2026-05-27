"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  initialActionState,
  type ActionState,
  type PublicBookingProfile,
  type ServiceCatalogItem,
} from "@/lib/types";
import { currency } from "@/lib/utils";
import { createBookingRequestAction } from "@/server/actions/bookings";

function slotLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PublicBookingForm({
  profile,
  services,
  selectedService,
  selectedDate,
  slots,
}: {
  profile: PublicBookingProfile;
  services: ServiceCatalogItem[];
  selectedService: ServiceCatalogItem | null;
  selectedDate: string;
  slots: { starts_at: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createBookingRequestAction,
    initialActionState,
  );

  return (
    <div className="grid gap-5">
      <form method="get" className="toolbar-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_180px_auto]">
        <Select name="servico" defaultValue={selectedService?.id ?? ""}>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} · {currency(service.price)}
            </option>
          ))}
        </Select>
        <Input name="data" type="date" defaultValue={selectedDate} />
        <Button type="submit" variant="secondary">
          Ver horários
        </Button>
      </form>

      {selectedService ? (
        <form action={formAction} className="grid gap-5">
          <input type="hidden" name="professional_id" value={profile.id} />
          <input type="hidden" name="slug" value={profile.public_slug} />
          <input type="hidden" name="service_catalog_id" value={selectedService.id} />

          <div className="surface-row rounded-lg p-4">
            <div className="mb-3">
              <h2 className="text-base font-semibold text-foreground">
                Horários livres
              </h2>
              <p className="text-sm text-muted">
                {selectedService.name} · {selectedService.duration_minutes} min ·{" "}
                {currency(selectedService.price)}
              </p>
            </div>
            {slots.length ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {slots.map((slot, index) => (
                  <label
                    key={slot.starts_at}
                    className="cursor-pointer rounded-lg border border-border-soft bg-background/35 p-3 text-center text-sm font-medium text-foreground transition has-[:checked]:border-lilac/60 has-[:checked]:bg-lilac/15"
                  >
                    <input
                      type="radio"
                      name="requested_start_at"
                      value={slot.starts_at}
                      required
                      defaultChecked={index === 0}
                      className="sr-only"
                    />
                    {slotLabel(slot.starts_at)}
                  </label>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sem horários livres nesse dia"
                description="Escolha outra data para ver novas opções."
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Seu nome" error={state.errors?.client_name?.[0]}>
              <Input name="client_name" required />
            </Field>
            <Field label="WhatsApp" error={state.errors?.client_phone?.[0]}>
              <Input name="client_phone" required placeholder="(11) 99999-9999" />
            </Field>
          </div>
          <Field label="Observações">
            <Textarea
              name="client_notes"
              placeholder="Conte se prefere algum horário, técnica ou cuidado específico."
            />
          </Field>
          <ActionMessage state={state} />
          <SubmitButton disabled={!slots.length}>Pedir agendamento</SubmitButton>
        </form>
      ) : (
        <EmptyState
          title="Agenda online indisponível"
          description="A profissional ainda não publicou serviços para agendamento."
        />
      )}
    </div>
  );
}
