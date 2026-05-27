import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
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

const faqs = [
  {
    question: "Preciso ter um computador?",
    answer:
      "Não. O Velora foi desenhado para funcionar muito bem no celular, com telas rápidas para agenda, clientes, financeiro e estoque.",
  },
  {
    question: "Consigo lembrar clientes pelo WhatsApp?",
    answer:
      "Sim. Na agenda, cada horário pode abrir o WhatsApp com uma mensagem pronta de confirmação.",
  },
  {
    question: "Posso cadastrar minha própria tabela de preços?",
    answer:
      "Sim. Em Ajustes você cadastra serviços, valores e duração para preencher novos agendamentos em poucos toques.",
  },
  {
    question: "Como funciona o cancelamento?",
    answer:
      "Você pode encerrar a assinatura quando quiser. A ideia do Velora é ser útil todos os dias, sem prender sua rotina.",
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
              title="Da cliente ao financeiro, sem retrabalho."
              description="Cada ação alimenta a próxima: ao concluir um atendimento, o histórico fica salvo e o financeiro recebe o valor automaticamente."
            />
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[42px] top-6 bottom-6 w-px bg-gradient-to-b from-lilac-strong/50 via-lilac/20 to-transparent hidden sm:block" />
              
              <div className="grid gap-7 sm:gap-9">
                {workflow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="relative grid gap-5 rounded-2xl sm:grid-cols-[84px_1fr] transition">
                      <div className="brand-tile relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lilac shadow-lg sm:h-20 sm:w-20">
                        <Icon size={30} />
                      </div>
                      <div className="premium-panel rounded-2xl p-7 sm:p-8">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-lilac/20 bg-lilac/10 px-2 text-sm font-bold text-lilac">
                          {index + 1}
                        </span>
                        <h3 className="mt-4 text-2xl font-bold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-muted">{item.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8 mt-12 sm:mt-0">
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
                <article key={item.title} className="surface-row rounded-2xl p-6 transition hover:bg-surface-glow/40 border border-border-soft">
                  <div className="h-12 w-12 rounded-xl bg-surface-soft flex items-center justify-center mb-5">
                    <Icon className="text-lilac" size={24} />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionIntro
              title="Respostas rápidas antes de começar."
              description="As perguntas que normalmente aparecem antes de uma profissional levar o Velora para a rotina do salão."
            />
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <MarketingCta title="Tudo pronto para começar" description="Acesse pelo celular ou computador e transforme sua rotina." />
      </main>
    </MarketingShell>
  );
}
