"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import {
  formObject,
  profileSettingsSchema,
  validationError,
} from "@/server/schemas";
import {
  actionFailure,
  actionSuccess,
  getActionContext,
  isActionState,
} from "@/server/actions/shared";

export async function updateProfileSettingsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = profileSettingsSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  if (parsed.data.booking_enabled && !parsed.data.public_slug) {
    return actionFailure("Defina um link público antes de ativar o agendamento online.");
  }

  const context = await getActionContext();
  if (isActionState(context)) {
    return context;
  }

  const { supabase, userId } = context;
  const { error } = await supabase
    .from("profiles")
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    if (error.code === "23505") {
      return actionFailure("Esse link público já está em uso.");
    }

    return actionFailure(error.message);
  }

  revalidatePath("/ajustes");
  revalidatePath("/perfil");
  if (parsed.data.public_slug) {
    revalidatePath(`/${parsed.data.public_slug}`);
  }

  return actionSuccess("Ajustes salvos.");
}
