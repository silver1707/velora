import { Check, Crown, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { MarketingCta, MarketingShell, SectionIntro } from "@/components/marketing/marketing-layout";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Preços",
  description:
    "Plano simples do Velora para uso pessoal com Supabase próprio e app pronto para produção.",
};

const included = [
  "Clientes ilimitadas para uso pessoal",
  "Agenda por dia, semana e mês",
  "Histórico de serviços e produtos usados",
  "Upload de fotos antes/depois",
  "Financeiro simples",
  "Estoque com alerta de baixo nível",
  "Dashboard com métricas essenciais",
  "Banco Supabase próprio",
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="pt-28">
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Preços"
              title="Um plano simples para uma profissional autônoma."
              description="Como o Velora foi pensado para uso próprio, a estrutura é direta: você roda o app, conecta ao seu Supabase e usa sem mensalidades internas além dos serviços de hospedagem que escolher."
              centered
            />

            <div className="mx-auto mt-10 max-w-3xl">
              <article className="premium-panel rounded-lg p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="brand-tile mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
                      <Crown size={22} />
                    </div>
                    <p className="text-sm font-semibold uppercase text-lilac">
                      Velora pessoal
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-foreground">
                      Uso próprio
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                      Ideal para uma cabeleireira organizar clientes, agenda,
                      produtos e recebimentos com controle total do próprio banco.
                    </p>
                  </div>
                  <div className="rounded-lg border border-lilac/25 bg-lilac/10 p-4 text-left sm:text-right">
                    <p className="text-sm text-muted">Licença do app</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">R$ 0</p>
                    <p className="mt-1 text-xs text-muted">custos externos à parte</p>
                  </div>
                </div>

                <div className="soft-divider mt-8 border-t pt-6">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Sparkles size={16} className="text-lilac" />
                    Inclui
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {included.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-muted">
                        <Check className="mt-0.5 shrink-0 text-mint" size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <LinkButton href="/cadastro" variant="primary">
                    Criar conta
                  </LinkButton>
                  <LinkButton href="/recursos" variant="secondary">
                    Ver recursos
                  </LinkButton>
                </div>
              </article>
            </div>
          </div>
        </section>

        <MarketingCta
          title="Comece com uma conta e o schema do Supabase."
          description="Depois de configurar o `.env.local` e rodar o schema, o Velora fica pronto para uso real no dia a dia."
        />
      </main>
    </MarketingShell>
  );
}
