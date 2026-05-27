import { CalendarPlus, Clock3, MessageCircle } from "lucide-react";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { BookingRequest } from "@/lib/types";
import { currency, dateTimeLabel } from "@/lib/utils";
import {
  acceptBookingRequestAction,
  rejectBookingRequestAction,
} from "@/server/actions/bookings";

function whatsappNumber(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits.length > 11 ? digits : "";
}

function whatsappRequestLink(request: BookingRequest) {
  const phone = whatsappNumber(request.client_phone);
  const message = `Olá ${request.client_name}, recebi seu pedido para ${request.service_name} no Velora. Vou confirmar seu horário por aqui.`;

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function BookingRequestsList({
  requests,
  emptyTitle = "Nenhum pedido pendente",
  emptyDescription = "Quando alguém pedir um horário pelo seu link público, o pedido aparecerá aqui para aceitar ou recusar.",
  compact = false,
}: {
  requests: BookingRequest[];
  emptyTitle?: string;
  emptyDescription?: string;
  compact?: boolean;
}) {
  if (!requests.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={compact ? "grid gap-3" : "grid gap-3 lg:grid-cols-2"}>
      {requests.map((request) => (
        <article key={request.id} className="surface-row rounded-lg p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{request.client_name}</p>
                <Badge className="border-gold/30 bg-gold/10 text-gold">
                  Pendente
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted">
                {request.service_name} · {dateTimeLabel(request.requested_start_at)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                <span className="inline-flex items-center gap-1 rounded-lg border border-lilac/20 bg-lilac/10 px-2 py-1 text-lilac">
                  <Clock3 size={12} />
                  {request.requested_duration_minutes} min
                </span>
                <span className="inline-flex rounded-lg border border-border-soft bg-background/35 px-2 py-1 text-foreground">
                  {currency(request.estimated_price)}
                </span>
              </div>
              {request.client_phone ? (
                <p className="mt-2 text-sm text-muted">
                  WhatsApp: {request.client_phone}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted">
                {request.client_hair_type ? (
                  <span className="rounded-lg border border-border-soft bg-background/35 px-2 py-1">
                    {request.client_hair_type}
                  </span>
                ) : null}
                {request.client_service_frequency ? (
                  <span className="rounded-lg border border-border-soft bg-background/35 px-2 py-1">
                    {request.client_service_frequency}
                  </span>
                ) : null}
                {request.client_birth_date ? (
                  <span className="rounded-lg border border-border-soft bg-background/35 px-2 py-1">
                    Nasc. {new Date(request.client_birth_date).toLocaleDateString("pt-BR")}
                  </span>
                ) : null}
              </div>
              {request.client_preferences ? (
                <p className="mt-2 text-sm text-muted">
                  Preferencias: {request.client_preferences}
                </p>
              ) : null}
              {request.client_allergies ? (
                <p className="mt-2 text-sm text-muted">
                  Alergias: {request.client_allergies}
                </p>
              ) : null}
              {request.client_chemical_history ? (
                <p className="mt-2 text-sm text-muted">
                  Historico quimico: {request.client_chemical_history}
                </p>
              ) : null}
              {request.client_notes ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {request.client_notes}
                </p>
              ) : null}
            </div>
            <div className="brand-tile hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lilac sm:flex">
              <CalendarPlus size={18} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border-soft pt-4 sm:flex-row sm:flex-wrap">
            <QuickActionForm
              action={acceptBookingRequestAction}
              fields={{ id: request.id }}
              label="Aceitar e agendar"
              variant="primary"
            />
            <QuickActionForm
              action={rejectBookingRequestAction}
              fields={{ id: request.id }}
              label="Recusar"
              variant="danger"
              confirmMessage="Recusar este pedido de agendamento?"
            />
            <LinkButton
              href={whatsappRequestLink(request)}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              <MessageCircle size={16} />
              Chamar
            </LinkButton>
          </div>
        </article>
      ))}
    </div>
  );
}
