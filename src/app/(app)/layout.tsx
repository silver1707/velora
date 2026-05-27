import { AppShell } from "@/components/layout/app-shell";
import { BookingRequestWatcher } from "@/components/bookings/booking-request-watcher";
import { requireSession } from "@/server/queries";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, supabase } = await requireSession();
  const [{ count, error: countError }, { data: latestRequest, error: latestError }] =
    await Promise.all([
      supabase
        .from("booking_requests")
        .select("id", { count: "exact", head: true })
        .eq("professional_id", user.id)
        .eq("status", "pendente"),
      supabase
        .from("booking_requests")
        .select("id")
        .eq("professional_id", user.id)
        .eq("status", "pendente")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (countError || latestError) {
    throw new Error(countError?.message ?? latestError?.message);
  }

  const pendingBookingRequestsCount = count ?? 0;

  return (
    <AppShell user={user} pendingBookingRequestsCount={pendingBookingRequestsCount}>
      <BookingRequestWatcher
        initialPendingCount={pendingBookingRequestsCount}
        initialLatestRequestId={latestRequest?.id ?? null}
      />
      {children}
    </AppShell>
  );
}
