import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [
    { count, error: countError },
    { data: latest, error: latestError },
    { data: latestService, error: latestServiceError },
  ] = await Promise.all([
      supabase
        .from("booking_requests")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", user.id)
        .eq("status", "pendente"),
      supabase
        .from("booking_requests")
        .select("id, created_at")
        .eq("professional_id", user.id)
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("service_records")
        .select("id, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (countError || latestError || latestServiceError) {
    return NextResponse.json(
      { error: countError?.message ?? latestError?.message ?? latestServiceError?.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      pendingCount: count ?? 0,
      latestRequestId: latest?.id ?? null,
      latestCreatedAt: latest?.created_at ?? null,
      latestServiceId: latestService?.id ?? null,
      latestServiceUpdatedAt: latestService?.updated_at ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
