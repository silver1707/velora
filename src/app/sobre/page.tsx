import { HeartHandshake, Scissors, Sparkles, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import { MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A proposta do Velora: organização premium e simples para cabeleireiras.",
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
      <main className="flex flex-col gap-16 pt-28 pb-20 sm:gap-24">
        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,color-mix(in_srgb,var(--lilac-deep)_10%,transparent),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionIntro
              eyebrow=""
              title="Velora nasceu para deixar o salão pequeno com cara de operação premium."
              description="A proposta é simples: dar para a cabeleireira a organização que grandes salões têm, mas sem telas pesadas, sem excesso de módulos e sem perder a delicadeza da experiência."
            />
            <div className="premium-panel group relative rounded-3xl p-8 sm:p-10 transition duration-500 hover:shadow-[0_0_80px_-20px_var(--lilac-strong)]">
              <Sparkles className="text-lilac" size={32} />
              <blockquote className="mt-6 text-2xl sm:text-3xl font-semibold leading-snug text-foreground">
                “Um bom sistema de beleza precisa lembrar dos detalhes que fazem a cliente se sentir cuidada.”
              </blockquote>
              <p className="mt-6 text-base leading-7 text-muted">
                Por isso o Velora junta histórico técnico, agenda, fotos e financeiro
                em uma interface escura, elegante e rápida para usar entre os atendimentos.
              </p>
              {/* Internal glow hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-lilac/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-300">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,color-mix(in_srgb,var(--rose)_5%,transparent),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="premium-panel group relative rounded-2xl p-6 sm:p-8 transition duration-300 hover:shadow-2xl">
                  <div className="brand-tile flex h-14 w-14 items-center justify-center rounded-xl text-lilac">
                    <Icon size={24} />
                  </div>
                  <h2 className="mt-6 text-lg font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </article>
              );
            })}
          </div>
        </section>

        <div className="animate-fade-in-up delay-500">
          <MarketingCta
            title="Organização bonita também é cuidado."
            description="Use o Velora para atender melhor, consultar históricos mais rápido e ter o controle total sobre a sua rotina."
          />
        </div>
      </main>
    </MarketingShell>
  );
}
