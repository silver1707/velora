"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState, BookingRequest } from "@/lib/types";
import {
  formObject,
  idSchema,
  publicBookingRequestSchema,
  validationError,
} from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

function dateInSaoPaulo(value: string) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function sameInstant(left: string, right: string) {
  return new Date(left).getTime() === new Date(right).getTime();
}

export async function createBookingRequestAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = publicBookingRequestSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const supabase = await createSupabaseServerClient();
  const { data: service, error: serviceError } = await supabase
    .from("service_catalog")
    .select("id, user_id, name, price, duration_minutes, is_active")
    .eq("id", parsed.data.service_catalog_id)
    .eq("user_id", parsed.data.professional_id)
    .eq("is_active", true)
    .single();

  if (serviceError || !service) {
    return actionFailure("Serviço indisponível para agendamento online.");
  }

  const requestedDate = dateInSaoPaulo(parsed.data.requested_start_at);
  const { data: slots, error: slotsError } = await supabase.rpc(
    "get_public_available_slots",
    {
      p_slug: parsed.data.slug,
      p_date: requestedDate,
      p_duration_minutes: service.duration_minutes,
    },
  );

  if (slotsError) {
    return actionFailure(slotsError.message);
  }

  const slotStillAvailable = ((slots ?? []) as { starts_at: string }[]).some((slot) =>
    sameInstant(slot.starts_at, parsed.data.requested_start_at),
  );

  if (!slotStillAvailable) {
    return actionFailure("Esse horário acabou de ficar indisponível. Escolha outro.");
  }

  const { error } = await supabase.from("booking_requests").insert({
    professional_id: parsed.data.professional_id,
    service_catalog_id: service.id,
    client_name: parsed.data.client_name,
    client_phone: parsed.data.client_phone,
    client_notes: parsed.data.client_notes,
    service_name: service.name,
    requested_start_at: new Date(parsed.data.requested_start_at).toISOString(),
    requested_duration_minutes: service.duration_minutes,
    estimated_price: service.price,
    status: "pendente",
  });

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath(`/${parsed.data.slug}`);
  return actionSuccess("Pedido enviado. A profissional vai confirmar pelo Velora.");
}

export async function acceptBookingRequestAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = idSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const { data: request, error: requestError } = await supabase
    .from("booking_requests")
    .select("*")
    .eq("id", parsed.data.id)
    .eq("professional_id", userId)
    .single();

  if (requestError || !request) {
    return actionFailure("Pedido não encontrado.");
  }

  const booking = request as BookingRequest;
  if (booking.status !== "pendente") {
    return actionFailure("Esse pedido já foi respondido.");
  }

  const requestedStart = new Date(booking.requested_start_at);
  const requestedEnd = new Date(
    requestedStart.getTime() + booking.requested_duration_minutes * 60_000,
  );
  const windowStart = new Date(requestedStart.getTime() - 12 * 60 * 60_000);
  const { data: possibleConflicts, error: conflictError } = await supabase
    .from("service_records")
    .select("id, scheduled_at, duration_minutes")
    .neq("status", "cancelado")
    .gte("scheduled_at", windowStart.toISOString())
    .lt("scheduled_at", requestedEnd.toISOString());

  if (conflictError) {
    return actionFailure(conflictError.message);
  }

  const hasConflict = (possibleConflicts ?? []).some((service) => {
    const serviceStart = new Date(service.scheduled_at);
    const serviceEnd = new Date(
      serviceStart.getTime() + Number(service.duration_minutes ?? 60) * 60_000,
    );

    return serviceStart < requestedEnd && serviceEnd > requestedStart;
  });

  if (hasConflict) {
    return actionFailure("Esse horário já foi ocupado na agenda.");
  }

  const { data: existingClients, error: clientLookupError } = await supabase
    .from("clients")
    .select("id")
    .eq("phone", booking.client_phone)
    .limit(1);

  if (clientLookupError) {
    return actionFailure(clientLookupError.message);
  }

  let clientId = existingClients?.[0]?.id as string | undefined;
  if (!clientId) {
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: userId,
        name: booking.client_name,
        phone: booking.client_phone,
        notes: "Cliente criada a partir de um pedido de agendamento online.",
      })
      .select("id")
      .single();

    if (clientError || !client) {
      return actionFailure(clientError?.message ?? "Não foi possível criar a cliente.");
    }

    clientId = client.id;
  }

  const notes = [
    "Agendamento solicitado pelo link online.",
    booking.client_notes ? `Observações da cliente: ${booking.client_notes}` : null,
    `WhatsApp informado: ${booking.client_phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { data: service, error: serviceError } = await supabase
    .from("service_records")
    .insert({
      user_id: userId,
      client_id: clientId,
      service_type: booking.service_name,
      scheduled_at: booking.requested_start_at,
      price: booking.estimated_price,
      duration_minutes: booking.requested_duration_minutes,
      payment_method: null,
      notes,
      status: "agendado",
    })
    .select("id")
    .single();

  if (serviceError || !service) {
    return actionFailure(serviceError?.message ?? "Não foi possível criar o agendamento.");
  }

  const { error: updateError } = await supabase
    .from("booking_requests")
    .update({
      status: "aceito",
      service_record_id: service.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking.id);

  if (updateError) {
    return actionFailure(updateError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/agenda");
  revalidatePath("/atendimentos");
  revalidatePath("/clientes");
  return actionSuccess("Pedido aceito e agendamento criado.");
}

export async function rejectBookingRequestAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = idSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase } = context;
  const { error } = await supabase
    .from("booking_requests")
    .update({
      status: "recusado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("status", "pendente");

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/dashboard");
  return actionSuccess("Pedido recusado.");
}
