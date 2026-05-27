import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import type { Metadata } from "next";
import { FeatureGrid, HeroSection, MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Velora | Sistema para cabeleireiras",
  description:
    "Landing page do Velora, um sistema premium para organizar clientes, agenda, serviços, produtos e financeiro.",
};

const workflow = [
  {
    icon: CalendarCheck2,
    title: "Comece pela agenda",
    text: "Veja o dia, encaixe horários e acompanhe próximos atendimentos sem abrir planilhas.",
  },
  {
    icon: Clock3,
    title: "Registre o atendimento",
    text: "Serviço, valor, status, produtos usados, duração e observações ficam em um único fluxo.",
  },
  {
    icon: CheckCircle2,
    title: "Acompanhe o resultado",
    text: "O histórico da cliente, financeiro e estoque são atualizados para orientar a próxima decisão.",
  },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <main>
        <HeroSection />

        <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
            {[
              ["Agenda", "dia, semana e mês"],
              ["Histórico", "técnico por cliente"],
              ["Estoque", "alertas automáticos"],
            ].map(([title, detail]) => (
              <div key={title} className="premium-panel rounded-lg p-4">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Produto"
              title="Um sistema que entende a rotina de uma cabeleireira."
              description="O Velora junta o que costuma ficar espalhado: mensagens, anotações, agenda, fotos, produtos e recebimentos. Tudo em telas rápidas, escuras e pensadas para tocar no celular entre um atendimento e outro."
              centered
            />
            <FeatureGrid className="mt-10" />
          </div>
        </section>

        <section className="border-y border-border/60 bg-surface/55 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionIntro
              eyebrow="Fluxo diário"
              title="Da cliente ao financeiro, sem retrabalho."
              description="Cada ação alimenta a próxima: ao concluir um atendimento, o histórico fica salvo, o financeiro recebe o valor e os produtos usados podem refletir no estoque."
            />
            <div className="grid gap-4">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="premium-panel grid gap-4 rounded-lg p-5 sm:grid-cols-[54px_1fr]">
                    <div className="brand-tile flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-lilac">
                        Passo {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Mobile primeiro",
                text: "Cards, drawers e botões foram desenhados para funcionar bem na mão.",
              },
              {
                icon: ShieldCheck,
                title: "Dados por usuária",
                text: "Supabase Auth e RLS separam os dados de cada conta no banco.",
              },
              {
                icon: ArrowRight,
                title: "Pronto para evoluir",
                text: "Base em Next.js, TypeScript e Supabase para crescer sem bagunça.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface-row rounded-lg p-5">
                  <Icon className="text-lilac" size={22} />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <MarketingCta />
      </main>
    </MarketingShell>
  );
}
