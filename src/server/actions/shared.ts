import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionState } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getActionContext(): Promise<{
  supabase: SupabaseClient;
  userId: string;
} | ActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      message: "Sessão expirada. Entre novamente para continuar.",
    };
  }

  return { supabase, userId: user.id };
}

export function isActionState(
  value: Awaited<ReturnType<typeof getActionContext>>,
): value is ActionState {
  return "ok" in value;
}

export function actionSuccess(message: string): ActionState {
  return { ok: true, message };
}

export function actionFailure(message: string): ActionState {
  return { ok: false, message };
}
