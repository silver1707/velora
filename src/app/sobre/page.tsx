import { HeartHandshake, Scissors, Sparkles, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import { MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A proposta do Velora: organização premium e simples para cabeleireiras autônomas.",
};

const principles = [
  {
    icon: Scissors,
    title: "Feito para beleza, não para escritório",
    text: "A linguagem, as fichas e os fluxos foram pensados para atendimento técnico e relacionamento com clientes.",
  },
  {
    icon: UsersRound,
    title: "Memória profissional",
    text: "A cliente volta, e o sistema lembra produtos, alergias, preferências, histórico químico e fotos.",
  },
  {
    icon: HeartHandshake,
    title: "Rotina mais leve",
    text: "Menos procura em conversa, menos anotação perdida, mais clareza para atender com segurança.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <main className="pt-28">
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionIntro
              eyebrow="Sobre"
              title="Velora nasceu para deixar o salão pequeno com cara de operação premium."
              description="A proposta é simples: dar para uma profissional autônoma a organização que grandes salões têm, mas sem telas pesadas, sem excesso de módulos e sem perder a delicadeza da experiência."
            />
            <div className="premium-panel rounded-lg p-6 sm:p-8">
              <Sparkles className="text-lilac" size={28} />
              <blockquote className="mt-5 text-2xl font-semibold leading-snug text-foreground">
                “Um bom sistema de beleza precisa lembrar dos detalhes que fazem a cliente se sentir cuidada.”
              </blockquote>
              <p className="mt-5 text-sm leading-6 text-muted">
                Por isso o Velora junta histórico técnico, agenda, fotos e financeiro
                em uma interface escura, elegante e rápida para usar entre atendimentos.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-surface/55 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="premium-panel rounded-lg p-5">
                  <div className="brand-tile flex h-11 w-11 items-center justify-center rounded-lg text-lilac">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <MarketingCta
          title="Organização bonita também é cuidado."
          description="Use o Velora para atender melhor, consultar histórico mais rápido e ter mais controle sobre a rotina."
        />
      </main>
    </MarketingShell>
  );
}
