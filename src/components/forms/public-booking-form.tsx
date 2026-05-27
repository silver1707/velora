"use client";

import { CalendarDays, Clock3, Send } from "lucide-react";
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function slotDayLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
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
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          {profile.booking_intro || "Escolha seu horário"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Selecione o serviço, escolha uma data disponível e envie seu pedido para
          confirmação.
        </p>
      </div>

      <form
        method="get"
        className="toolbar-panel grid gap-3 rounded-lg p-3 md:grid-cols-[minmax(0,1fr)_180px_auto]"
      >
        <Field label="Serviço">
          <Select name="servico" defaultValue={selectedService?.id ?? ""}>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {currency(service.price)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Data">
          <Input name="data" type="date" defaultValue={selectedDate} />
        </Field>
        <Button type="submit" variant="secondary" className="self-end">
          <CalendarDays size={16} />
          Ver horários
        </Button>
      </form>

      {selectedService ? (
        <form action={formAction} className="grid gap-5">
          <input type="hidden" name="professional_id" value={profile.id} />
          <input type="hidden" name="slug" value={profile.public_slug} />
          <input type="hidden" name="service_catalog_id" value={selectedService.id} />

          <div className="surface-row rounded-lg p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedService.name}
                </h3>
                {selectedService.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {selectedService.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
                <span className="inline-flex items-center gap-1 rounded-lg border border-lilac/20 bg-lilac/10 px-2.5 py-1 text-lilac">
                  <Clock3 size={13} />
                  {selectedService.duration_minutes} min
                </span>
                <span className="inline-flex rounded-lg border border-border-soft bg-background/35 px-2.5 py-1 text-foreground">
                  {currency(selectedService.price)}
                </span>
              </div>
            </div>

            {slots.length ? (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase text-muted-strong">
                  Horários em {slotDayLabel(slots[0].starts_at)}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {slots.map((slot, index) => (
                    <label
                      key={slot.starts_at}
                      className="group cursor-pointer rounded-lg border border-border-soft bg-background/35 p-3 text-center transition hover:border-lilac/35 hover:bg-surface-glow has-[:checked]:border-lilac/70 has-[:checked]:bg-lilac/15"
                    >
                      <input
                        type="radio"
                        name="requested_start_at"
                        value={slot.starts_at}
                        required
                        defaultChecked={index === 0}
                        className="sr-only"
                      />
                      <span className="block text-base font-semibold text-foreground">
                        {slotLabel(slot.starts_at)}
                      </span>
                      <span className="mt-1 block text-[11px] font-medium text-muted group-has-[:checked]:text-lilac">
                        Disponível
                      </span>
                    </label>
                  ))}
                </div>
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
              <Input name="client_name" required autoComplete="name" />
            </Field>
            <Field label="WhatsApp" error={state.errors?.client_phone?.[0]}>
              <Input
                name="client_phone"
                required
                placeholder="(11) 99999-9999"
                autoComplete="tel"
              />
            </Field>
          </div>
          <Field label="Observações">
            <Textarea
              name="client_notes"
              placeholder="Conte se prefere alguma técnica, cuidado ou detalhe específico."
            />
          </Field>
          {profile.booking_policy ? (
            <p className="surface-row rounded-lg p-3 text-xs leading-5 text-muted">
              {profile.booking_policy}
            </p>
          ) : null}
          <ActionMessage state={state} />
          <SubmitButton disabled={!slots.length} className="w-full">
            <Send size={16} />
            Pedir agendamento
          </SubmitButton>
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
