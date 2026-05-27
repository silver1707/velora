"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import {
  financeEntrySchema,
  formObject,
  idSchema,
  validationError,
} from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

export async function createFinanceEntryAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = financeEntrySchema.safeParse(formObject(formData));
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
  const { error } = await supabase.from("financial_entries").insert({
    ...payload,
    received_at: new Date(payload.received_at).toISOString(),
    user_id: userId,
  });

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return actionSuccess("Recebimento registrado.");
}

export async function deleteFinanceEntryAction(
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
    .from("financial_entries")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return actionFailure(error.message);
  }

  revalidatePath("/financeiro");
  revalidatePath("/dashboard");
  return actionSuccess("Recebimento removido.");
}
