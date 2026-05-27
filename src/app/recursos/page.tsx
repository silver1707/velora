import {
  BellRing,
  CalendarDays,
  Camera,
  ChartNoAxesCombined,
  CircleDollarSign,
  PackageSearch,
} from "lucide-react";
import type { Metadata } from "next";
import { FeatureGrid, MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";
import { Badge } from "@/components/ui/badge";

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
    text: "O dashboard destaca atendimentos próximos e itens de estoque que precisam de atenção.",
  },
  {
    icon: PackageSearch,
    title: "Produtos por serviço",
    text: "Cada atendimento pode guardar quais produtos foram usados e em qual quantidade.",
  },
  {
    icon: CalendarDays,
    title: "Agenda flexível",
    text: "Visualizações por dia, semana e mês ajudam no planejamento rápido pelo celular.",
  },
  {
    icon: CircleDollarSign,
    title: "Recebimentos automáticos",
    text: "Atendimento concluído pode virar entrada financeira vinculada à cliente.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Métricas para decidir",
    text: "Serviços mais realizados, faturamento mensal e estoque baixo ficam à vista.",
  },
];

export default function ResourcesPage() {
  return (
    <MarketingShell>
      <main className="pt-28">
        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Recursos"
              title="Tudo que uma profissional precisa para atender com memória e método."
              description="Velora não tenta virar um ERP. Ele concentra o essencial para uma cabeleireira autônoma: relacionamento, agenda, serviços, produtos e dinheiro recebido."
              centered
            />
            <FeatureGrid className="mt-10" />
          </div>
        </section>

        <section className="border-y border-border/60 bg-surface/55 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
            {deepFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="premium-panel rounded-lg p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="brand-tile flex h-11 w-11 items-center justify-center rounded-lg text-lilac">
                      <Icon size={20} />
                    </div>
                    <Badge className="border-lilac/25 bg-lilac/10 text-lilac">
                      Incluso
                    </Badge>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <MarketingCta
          title="Recursos completos, sem complexidade."
          description="A ideia é abrir o celular e resolver o que importa: cadastrar, agendar, concluir, consultar e receber."
        />
      </main>
    </MarketingShell>
  );
}
