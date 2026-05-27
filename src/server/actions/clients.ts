"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import { clientSchema, formObject, idSchema, validationError } from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

export async function createClientAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = clientSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const payload = { ...parsed.data };
  delete payload.id;
  const { error } = await supabase.from("clients").insert({
    ...payload,
    user_id: userId,
  });

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  return actionSuccess("Cliente cadastrada com sucesso.");
}

export async function updateClientAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = clientSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (!parsed.data.id) {
    return actionFailure("Cliente inválida.");
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase } = context;
  const { id, ...payload } = parsed.data;
  const { error } = await supabase
    .from("clients")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  revalidatePath("/dashboard");
  return actionSuccess("Cliente atualizada.");
}

export async function deleteClientAction(
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
  const { error } = await supabase.from("clients").delete().eq("id", parsed.data.id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/clientes");
  revalidatePath("/dashboard");
  return actionSuccess("Cliente excluída.");
}
