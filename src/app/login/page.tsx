import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";
import { VeloraSymbol } from "@/components/brand/velora-logo";

export default function LoginPage() {
  return (
    <main className="velora-shell flex min-h-screen items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,var(--lilac-deep)_0%,transparent_70%)] opacity-20 blur-[100px] pointer-events-none" />

      <section className="premium-panel relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {/* Subtle inner top glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilac/30 to-transparent" />
        
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised shadow-inner border border-border-soft">
            <VeloraSymbol className="h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Bem-vinda de volta
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Acesse sua agenda, clientes, histórico técnico e financeiro do salão.
          </p>
        </div>
        
        <Suspense
          fallback={
            <div className="surface-row rounded-xl p-4 text-center text-sm text-muted animate-pulse">
              Carregando formulário...
            </div>
          }
        >
          <AuthForm mode="login" />
        </Suspense>
      </section>
    </main>
  );
}
