"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionState } from "@/lib/types";
import {
  formObject,
  idSchema,
  serviceRecordSchema,
  statusUpdateSchema,
  validationError,
} from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

function productPayload(formData: FormData, serviceRecordId: string, userId: string) {
  const productIds = formData.getAll("product_ids").map(String).filter(Boolean);

  return productIds
    .map((productId) => ({
      user_id: userId,
      service_record_id: serviceRecordId,
      product_id: productId,
      quantity_used: Number(formData.get(`quantity_${productId}`) || 1),
      notes: null,
    }))
    .filter((item) => Number.isFinite(item.quantity_used) && item.quantity_used > 0);
}

async function syncServiceStock(
  supabase: SupabaseClient,
  serviceRecordId: string,
) {
  const { error } = await supabase.rpc("sync_service_stock", {
    p_service_record_id: serviceRecordId,
  });

  return error?.message;
}

async function syncFinancialEntry({
  supabase,
  userId,
  serviceRecordId,
  clientId,
  status,
  price,
  paymentMethod,
  receivedAt,
}: {
  supabase: Awaited<ReturnType<typeof getActionContext>> extends infer T
    ? T extends { supabase: infer S }
      ? S
      : never
    : never;
  userId: string;
  serviceRecordId: string;
  clientId: string;
  status: string;
  price: number;
  paymentMethod: string | null;
  receivedAt: string;
}) {
  if (status === "concluido" && price > 0) {
    await supabase.from("financial_entries").upsert(
      {
        user_id: userId,
        service_record_id: serviceRecordId,
        client_id: clientId,
        amount: price,
        payment_method: paymentMethod,
        received_at: receivedAt,
        notes: "Recebimento vinculado ao atendimento.",
      },
      { onConflict: "service_record_id" },
    );
    return;
  }

  await supabase
    .from("financial_entries")
    .delete()
    .eq("service_record_id", serviceRecordId);
}

export async function createServiceAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceRecordSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const scheduledAt = new Date(parsed.data.scheduled_at).toISOString();
  const data = { ...parsed.data };
  delete data.id;

  const { data: service, error } = await supabase
    .from("service_records")
    .insert({
      ...data,
      scheduled_at: scheduledAt,
      user_id: userId,
    })
    .select("id, client_id, status, price, payment_method, scheduled_at")
    .single();

  if (error || !service) {
    return actionFailure(error?.message ?? "Não foi possível salvar o atendimento.");
  }

  const products = productPayload(formData, service.id, userId);
  if (products.length) {
    const { error: productError } = await supabase
      .from("service_products")
      .insert(products);
    if (productError) {
      return actionFailure(productError.message);
    }
  }

  const stockError = await syncServiceStock(supabase, service.id);
  if (stockError) {
    return actionFailure(stockError);
  }

  await syncFinancialEntry({
    supabase,
    userId,
    serviceRecordId: service.id,
    clientId: service.client_id,
    status: service.status,
    price: Number(service.price),
    paymentMethod: service.payment_method,
    receivedAt: service.scheduled_at,
  });

  revalidatePath("/atendimentos");
  revalidatePath("/agenda");
  revalidatePath(`/clientes/${service.client_id}`);
  revalidatePath("/financeiro");
  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Atendimento salvo.");
}

export async function updateServiceAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceRecordSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (!parsed.data.id) {
    return actionFailure("Atendimento inválido.");
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const { id, ...data } = parsed.data;
  const scheduledAt = new Date(data.scheduled_at).toISOString();
  const { data: service, error } = await supabase
    .from("service_records")
    .update({
      ...data,
      scheduled_at: scheduledAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, client_id, status, price, payment_method, scheduled_at")
    .single();

  if (error || !service) {
    return actionFailure(error?.message ?? "Não foi possível atualizar.");
  }

  await supabase.from("service_products").delete().eq("service_record_id", id);
  const products = productPayload(formData, id, userId);
  if (products.length) {
    const { error: productError } = await supabase
      .from("service_products")
      .insert(products);
    if (productError) {
      return actionFailure(productError.message);
    }
  }

  const stockError = await syncServiceStock(supabase, service.id);
  if (stockError) {
    return actionFailure(stockError);
  }

  await syncFinancialEntry({
    supabase,
    userId,
    serviceRecordId: service.id,
    clientId: service.client_id,
    status: service.status,
    price: Number(service.price),
    paymentMethod: service.payment_method,
    receivedAt: service.scheduled_at,
  });

  revalidatePath("/atendimentos");
  revalidatePath("/agenda");
  revalidatePath(`/clientes/${service.client_id}`);
  revalidatePath("/financeiro");
  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Atendimento atualizado.");
}

export async function updateServiceStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = statusUpdateSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const { data, error } = await supabase
    .from("service_records")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .select("id, client_id, status, price, payment_method, scheduled_at")
    .single();

  if (error || !data) {
    return actionFailure(error?.message ?? "Não foi possível mudar o status.");
  }

  const stockError = await syncServiceStock(supabase, data.id);
  if (stockError) {
    return actionFailure(stockError);
  }

  await syncFinancialEntry({
    supabase,
    userId,
    serviceRecordId: data.id,
    clientId: data.client_id,
    status: data.status,
    price: Number(data.price),
    paymentMethod: data.payment_method,
    receivedAt: data.scheduled_at,
  });

  revalidatePath("/atendimentos");
  revalidatePath("/agenda");
  revalidatePath(`/clientes/${data.client_id}`);
  revalidatePath("/financeiro");
  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Status atualizado.");
}

export async function deleteServiceAction(
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
  await supabase
    .from("service_records")
    .update({
      status: "cancelado",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);
  const stockError = await syncServiceStock(supabase, parsed.data.id);
  if (stockError) {
    return actionFailure(stockError);
  }
  await supabase
    .from("financial_entries")
    .delete()
    .eq("service_record_id", parsed.data.id);
  const { error } = await supabase
    .from("service_records")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/atendimentos");
  revalidatePath("/agenda");
  revalidatePath("/financeiro");
  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Atendimento excluído.");
}
