import { LogOut } from "lucide-react";
import { BrandMark, HeaderMetric, SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const email = user.email ?? "conta Velora";

  return (
    <div className="velora-shell min-h-screen pb-24 lg:flex lg:pb-0">
      <aside className="hidden w-72 shrink-0 border-r border-border/70 bg-surface/65 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <BrandMark />
        <div className="mt-8">
          <SidebarNav />
        </div>
        <div className="surface-row mt-auto rounded-lg p-4">
          <p className="truncate text-sm font-medium text-foreground">{email}</p>
          <p className="mt-1 text-xs text-muted">Dados protegidos por Supabase Auth.</p>
          <form action="/auth/signout" method="post" className="mt-4">
            <Button type="submit" variant="ghost" className="w-full justify-start">
              <LogOut size={16} />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-muted">Rotina do salão</p>
              <h1 className="text-xl font-semibold text-foreground">
                Organize o dia com calma e precisão
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <HeaderMetric label="Sessão" value="ativa" />
              <form action="/auth/signout" method="post" className="lg:hidden">
                <Button type="submit" variant="ghost" size="icon" aria-label="Sair">
                  <LogOut size={18} />
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-surface/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <SidebarNav mobile />
      </div>
    </div>
  );
}
