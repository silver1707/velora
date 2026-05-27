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

function phoneDigits(value?: string | null) {
  return (value ?? "").replace(/\D/g, "");
}

function mergeValue<T>(current: T | null | undefined, incoming: T | null | undefined) {
  return current ?? incoming ?? null;
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
    client_birth_date: parsed.data.client_birth_date,
    client_hair_type: parsed.data.client_hair_type,
    client_preferences: parsed.data.client_preferences,
    client_allergies: parsed.data.client_allergies,
    client_chemical_history: parsed.data.client_chemical_history,
    client_service_frequency: parsed.data.client_service_frequency,
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
  revalidatePath("/pedidos");
  revalidatePath("/dashboard");
  revalidatePath("/agenda");
  return actionSuccess("Pedido enviado para a aba Pedidos no Velora.");
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
    .eq("user_id", userId)
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

  const requestedPhoneDigits = phoneDigits(booking.client_phone);
  const { data: existingClients, error: clientLookupError } = await supabase
    .from("clients")
    .select("id, name, phone, birth_date, hair_type, preferences, allergies, chemical_history, service_frequency, notes")
    .eq("user_id", userId);

  if (clientLookupError) {
    return actionFailure(clientLookupError.message);
  }

  const normalizedName = booking.client_name.trim().toLowerCase();
  const existingClient = (existingClients ?? []).find((client) => {
    const clientDigits = phoneDigits(client.phone);
    if (requestedPhoneDigits && clientDigits) {
      return clientDigits === requestedPhoneDigits;
    }

    return client.name.trim().toLowerCase() === normalizedName;
  });

  let clientId = existingClient?.id as string | undefined;
  if (clientId && existingClient) {
    const { error: updateClientError } = await supabase
      .from("clients")
      .update({
        name: existingClient.name || booking.client_name,
        phone: existingClient.phone || booking.client_phone,
        birth_date: mergeValue(existingClient.birth_date, booking.client_birth_date),
        hair_type: mergeValue(existingClient.hair_type, booking.client_hair_type),
        preferences: mergeValue(existingClient.preferences, booking.client_preferences),
        allergies: mergeValue(existingClient.allergies, booking.client_allergies),
        chemical_history: mergeValue(
          existingClient.chemical_history,
          booking.client_chemical_history,
        ),
        service_frequency: mergeValue(
          existingClient.service_frequency,
          booking.client_service_frequency,
        ),
        notes: [
          existingClient.notes,
          booking.client_notes
            ? `Pedido online: ${booking.client_notes}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)
      .eq("user_id", userId);

    if (updateClientError) {
      return actionFailure(updateClientError.message);
    }
  } else {
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: userId,
        name: booking.client_name,
        phone: booking.client_phone,
        birth_date: booking.client_birth_date,
        hair_type: booking.client_hair_type,
        preferences: booking.client_preferences,
        allergies: booking.client_allergies,
        chemical_history: booking.client_chemical_history,
        service_frequency: booking.client_service_frequency,
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
    .eq("id", booking.id)
    .eq("professional_id", userId);

  if (updateError) {
    return actionFailure(updateError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/pedidos");
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

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("booking_requests")
    .update({
      status: "recusado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("professional_id", userId)
    .eq("status", "pendente")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return actionFailure(error?.message ?? "Pedido nÃ£o encontrado ou jÃ¡ respondido.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/pedidos");
  revalidatePath("/agenda");
  return actionSuccess("Pedido recusado.");
}
