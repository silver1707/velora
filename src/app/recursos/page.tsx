import {
  BellRing,
  CalendarDays,
  Camera,
  ChartNoAxesCombined,
  CircleDollarSign,
  PackageSearch,
} from "lucide-react";
import type { Metadata } from "next";
import { MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Conheça os recursos do Velora para clientes, agenda, atendimentos, produtos, fotos e financeiro.",
};

const deepFeatures = [
  {
    icon: Camera,
    title: "Fotos antes/depois",
    text: "Anexe imagens na ficha da cliente para acompanhar evolução de cor, corte, tratamento e finalização.",
  },
  {
    icon: BellRing,
    title: "Alertas do dia",
    text: "O dashboard destaca atendimentos próximos e itens de estoque que precisam de atenção imediata.",
  },
  {
    icon: PackageSearch,
    title: "Produtos por serviço",
    text: "Cada atendimento guarda quais produtos foram usados e a quantidade exata aplicada.",
  },
  {
    icon: CalendarDays,
    title: "Agenda flexível",
    text: "Visualizações por dia, semana e mês ajudam no planejamento ultra-rápido pelo celular.",
  },
  {
    icon: CircleDollarSign,
    title: "Recebimentos automáticos",
    text: "O atendimento concluído já vira uma entrada financeira vinculada ao histórico da cliente.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Métricas para decidir",
    text: "Serviços mais realizados, faturamento mensal e estoque baixo sempre à vista.",
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main className="flex flex-col gap-12 pt-28 pb-20 sm:gap-20">
        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--lilac-deep)_10%,transparent),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <SectionIntro
              title="Tudo que você precisa para atender com memória e método."
              description="Velora não tenta virar um sistema complicado. Ele concentra o essencial para a cabeleireira: relacionamento, agenda, serviços, produtos e dinheiro recebido."
              centered
            />
          </div>
        </section>

        <section className="relative px-4 sm:px-6 lg:px-8 animate-fade-in-up delay-300">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deepFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="premium-panel group relative rounded-2xl p-6 transition duration-300 hover:shadow-2xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lilac/10 text-lilac">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-6 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {feature.text}
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </article>
              );
            })}
          </div>
        </section>

        <div className="animate-fade-in-up delay-500">
          <MarketingCta
            title="Pronto para simplificar?"
            description="Abra o celular e resolva o que importa: agendar, concluir, consultar e receber."
          />
        </div>
      </main>
    </MarketingShell>
  );
}
