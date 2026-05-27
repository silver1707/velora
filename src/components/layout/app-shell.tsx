import { LogOut } from "lucide-react";
import { BrandMark, HeaderMetric, SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function AppShell({
  user,
  pendingBookingRequestsCount = 0,
  children,
}: {
  user: User;
  pendingBookingRequestsCount?: number;
  children: React.ReactNode;
}) {
  const email = user.email ?? "conta Velora";

  return (
    <div className="velora-shell min-h-[100dvh] pb-[88px] lg:flex lg:pb-0 bg-background">
      <aside className="hidden w-[280px] shrink-0 border-r border-border-soft bg-surface/50 p-6 backdrop-blur-2xl lg:flex lg:flex-col shadow-[1px_0_40px_rgba(0,0,0,0.05)]">
        <BrandMark />
        <div className="mt-10">
          <SidebarNav pendingBookingRequestsCount={pendingBookingRequestsCount} />
        </div>
        <div className="surface-row mt-auto rounded-2xl p-5 border border-border-soft/50 shadow-sm">
          <p className="truncate text-sm font-semibold text-foreground">{email}</p>
          <p className="mt-1 text-[11px] font-medium text-muted uppercase tracking-wider">Conta Segura</p>
          <form action="/auth/signout" method="post" className="mt-5">
            <Button type="submit" variant="secondary" className="w-full justify-center">
              <LogOut size={16} className="mr-2" />
              Desconectar
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-border-soft bg-background/80 px-4 py-3 sm:py-4 backdrop-blur-2xl sm:px-6 lg:px-10 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden flex items-center gap-2">
              <BrandMark compact />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-lilac uppercase tracking-wider mb-1">Rotina do salão</p>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Organize o dia com precisão
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {pendingBookingRequestsCount > 0 ? (
                <HeaderMetric label="Pedidos" value={String(pendingBookingRequestsCount)} />
              ) : null}
              <HeaderMetric label="Sessão" value="Ativa" />
              <form action="/auth/signout" method="post" className="lg:hidden">
                <Button type="submit" variant="secondary" size="icon" className="rounded-full w-10 h-10 border-border-soft/50 shadow-sm" aria-label="Sair">
                  <LogOut size={16} className="text-foreground" />
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-10 sm:py-8">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-surface/80 px-2 pt-2 pb-safe backdrop-blur-2xl lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="pb-2">
          <SidebarNav
            mobile
            pendingBookingRequestsCount={pendingBookingRequestsCount}
          />
        </div>
      </div>
    </div>
  );
}
