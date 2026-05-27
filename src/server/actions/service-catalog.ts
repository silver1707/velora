"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import {
  formObject,
  idSchema,
  serviceCatalogSchema,
  validationError,
} from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

function revalidateCatalogPaths() {
  revalidatePath("/ajustes");
  revalidatePath("/agenda");
  revalidatePath("/atendimentos");
  revalidatePath("/dashboard");
}

export async function createServiceCatalogAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceCatalogSchema.safeParse(formObject(formData));
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

  const { error } = await supabase.from("service_catalog").insert({
    ...payload,
    user_id: userId,
  });

  if (error) {
    return actionFailure(error.message);
  }

  revalidateCatalogPaths();
  return actionSuccess("Serviço adicionado à tabela.");
}

export async function updateServiceCatalogAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceCatalogSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (!parsed.data.id) {
    return actionFailure("Serviço inválido.");
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase } = context;
  const { id, ...payload } = parsed.data;
  const { error } = await supabase
    .from("service_catalog")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidateCatalogPaths();
  return actionSuccess("Serviço atualizado.");
}

export async function deleteServiceCatalogAction(
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
    .from("service_catalog")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidateCatalogPaths();
  return actionSuccess("Serviço removido.");
}
