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
      <main className="flex flex-col gap-12 sm:gap-24 pb-20">
        <HeroSection />

        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-400">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Organização"
              title="Um sistema que entende a rotina do salão."
              description="Reúna o que costuma ficar espalhado: mensagens, anotações, agenda, produtos e recebimentos, em uma experiência rápida e feita para o celular."
              centered
            />
            <FeatureGrid className="mt-10" />
          </div>
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-500">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionIntro
              eyebrow="Praticidade"
              title="Da cliente ao financeiro, sem retrabalho."
              description="Cada ação alimenta a próxima: ao concluir um atendimento, o histórico fica salvo e o financeiro recebe o valor automaticamente."
            />
            <div className="grid gap-4">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="premium-panel grid gap-4 rounded-lg p-5 sm:grid-cols-[54px_1fr] transition hover:scale-[1.02]">
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

        <section className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Mobile primeiro",
                text: "Cards, botões e telas desenhados para funcionar perfeitamente na sua mão.",
              },
              {
                icon: ShieldCheck,
                title: "Segurança total",
                text: "Seus dados e o histórico das suas clientes ficam isolados e protegidos com tecnologia de ponta.",
              },
              {
                icon: ArrowRight,
                title: "Sempre atualizado",
                text: "Um sistema premium, rápido e em constante evolução para acompanhar o crescimento do seu salão.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface-row rounded-lg p-5 transition hover:bg-surface-glow/40">
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

        <MarketingCta title="Tudo pronto para começar" description="Acesse pelo celular ou computador e transforme sua rotina." />
      </main>
    </MarketingShell>
  );
}
