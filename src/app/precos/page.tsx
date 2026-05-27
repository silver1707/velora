import { Building2, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Escolha o plano ideal do Velora para a sua carreira ou para o seu salão.",
};

const individualFeatures = [
  "Clientes ilimitados",
  "Agenda inteligente",
  "Histórico químico e fichas técnicas",
  "Galeria de fotos (antes/depois)",
  "Financeiro descomplicado",
  "Estoque e controle de produtos",
];

const studioFeatures = [
  "Tudo do plano Essência, mais:",
  "Agendas para múltiplos profissionais",
  "Cálculo automático de comissões",
  "Relatórios financeiros avançados",
  "Controle de acesso por perfis",
  "Treinamento VIP para a equipe",
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="flex flex-col gap-16 pt-28 pb-20 sm:gap-24">
        
        {/* Header Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--lilac-deep)_10%,transparent),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionIntro
              title="Um sistema premium que cabe na sua rotina."
              description="Esqueça mensalidades abusivas e sistemas que você não usa metade das funções. Escolha o Velora que se adapta ao seu momento."
              centered
            />
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-300">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Plan 1: Autônoma */}
            <article className="premium-panel group relative flex flex-col rounded-3xl p-8 sm:p-10 transition duration-500 hover:shadow-[0_0_80px_-20px_var(--lilac-strong)]">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,var(--lilac-strong)_0%,transparent_50%)] opacity-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="brand-tile mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-lilac">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Velora Essência
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted h-12">
                  A organização perfeita para a cabeleireira que quer dominar sua própria agenda e encantar clientes.
                </p>
                
                <div className="my-8 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-foreground">R$ 49,90</span>
                  <span className="text-sm font-semibold text-muted">/mês</span>
                </div>

                <LinkButton href="/cadastro" variant="primary" className="w-full justify-center">
                  Começar agora
                </LinkButton>

                <div className="soft-divider mt-8 border-t pt-8">
                  <p className="mb-5 text-sm font-semibold text-foreground">O que está incluído:</p>
                  <ul className="flex flex-col gap-4">
                    {individualFeatures.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted">
                        <Check className="mt-0.5 shrink-0 text-lilac" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </article>

            {/* Plan 2: Studio */}
            <article className="group relative flex flex-col rounded-3xl border border-border-soft bg-surface-soft/40 p-8 sm:p-10 transition duration-500 hover:shadow-2xl">
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-surface-raised text-rose border border-border-soft">
                  <Building2 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Velora Studio
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted h-12">
                  O ecossistema completo para salões que precisam gerenciar múltiplos talentos e comissões.
                </p>
                
                <div className="my-8 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-foreground">Sob medida</span>
                </div>

                <LinkButton href="/contato" variant="secondary" className="w-full justify-center">
                  Falar com especialista
                </LinkButton>

                <div className="soft-divider mt-8 border-t pt-8">
                  <p className="mb-5 text-sm font-semibold text-foreground">Exclusivo do Studio:</p>
                  <ul className="flex flex-col gap-4">
                    {studioFeatures.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-muted">
                        <Check className="mt-0.5 shrink-0 text-rose" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </article>

          </div>
        </section>

        <div className="animate-fade-in-up delay-500">
          <MarketingCta
            title="Dúvidas sobre qual escolher?"
            description="Entre em contato com nossa equipe. Estamos aqui para ajudar você a encontrar a melhor organização para o seu negócio."
          />
        </div>

      </main>
    </MarketingShell>
  );
}
