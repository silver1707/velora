import { Suspense } from "react";
import { AuthForm } from "@/components/forms/auth-form";
import { VeloraSymbol, VeloraLogo } from "@/components/brand/velora-logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full">
      {/* Form Side (Left) */}
      <section className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24 bg-background relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(circle,var(--lilac-deep)_0%,transparent_70%)] opacity-20 blur-[80px] pointer-events-none" />

        <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
           <Link href="/" className="transition hover:opacity-80">
             <VeloraLogo />
           </Link>
        </div>

        <div className="w-full max-w-sm mx-auto relative z-10 animate-fade-in-up">
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bem-vinda de volta
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Acesse sua agenda, clientes e controle financeiro.
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
        </div>
      </section>

      {/* Visual Side (Right) */}
      <section className="hidden flex-1 lg:flex flex-col relative overflow-hidden bg-surface-soft border-l border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--rose)_10%,transparent),transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--lilac-strong)_10%,transparent),transparent_50%)] opacity-20" />
        
        {/* Beautiful Abstract Element */}
        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <div className="relative h-[500px] w-[500px]">
            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border border-lilac/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-rose/10 animate-[spin_30s_linear_infinite_reverse]" />
            <div className="absolute inset-16 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
            
            {/* Central Glow and Symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-lilac-strong to-rose blur-[80px] opacity-30 animate-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-2xl shadow-2xl rotate-[10deg] animate-[float_6s_ease-in-out_infinite]">
                <VeloraSymbol className="h-12 w-12 drop-shadow-[0_0_15px_var(--lilac-strong)]" />
              </div>
            </div>
            
            {/* Floating glass cards */}
            <div className="absolute top-[20%] right-[10%] flex items-center gap-3 rounded-2xl border border-border-soft bg-surface/60 backdrop-blur-xl px-5 py-3 shadow-2xl animate-[float_6s_ease-in-out_infinite] delay-300">
              <div className="h-2 w-2 rounded-full bg-mint shadow-[0_0_8px_var(--mint)]" />
              <span className="text-xs font-semibold text-foreground">Ana Clara confirmada</span>
            </div>
            
            <div className="absolute bottom-[25%] left-[5%] flex items-center gap-3 rounded-2xl border border-border-soft bg-surface/60 backdrop-blur-xl px-5 py-3 shadow-2xl animate-[float-reverse_8s_ease-in-out_infinite]">
              <div className="h-2 w-2 rounded-full bg-lilac shadow-[0_0_8px_var(--lilac)]" />
              <span className="text-xs font-semibold text-foreground">+ R$ 380,00</span>
            </div>
          </div>
        </div>

        {/* Text overlay at bottom */}
        <div className="relative bottom-12 px-16 z-10">
          <blockquote className="space-y-3">
            <p className="text-2xl font-medium text-foreground leading-snug">
              “O Velora tirou a bagunça do papel e colocou a organização inteira do meu salão na palma da mão.”
            </p>
            <footer className="text-sm font-medium text-muted">— Marina Alves, Cabeleireira</footer>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
