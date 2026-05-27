import { AppShell } from "@/components/layout/app-shell";
import { requireSession } from "@/server/queries";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireSession();

  return <AppShell user={user}>{children}</AppShell>;
}
