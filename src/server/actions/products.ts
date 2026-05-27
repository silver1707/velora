"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import { formObject, idSchema, productSchema, validationError } from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

export async function createProductAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = productSchema.safeParse(formObject(formData));
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
  const { error } = await supabase.from("products").insert({
    ...payload,
    user_id: userId,
  });

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Produto cadastrado.");
}

export async function updateProductAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = productSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (!parsed.data.id) {
    return actionFailure("Produto inválido.");
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase } = context;
  const { id, ...payload } = parsed.data;
  const { error } = await supabase
    .from("products")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Produto atualizado.");
}

export async function deleteProductAction(
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
  const { error } = await supabase.from("products").delete().eq("id", parsed.data.id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/produtos");
  revalidatePath("/dashboard");
  return actionSuccess("Produto excluído.");
}
