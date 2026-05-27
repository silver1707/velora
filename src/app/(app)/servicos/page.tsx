import { Plus, Sparkles } from "lucide-react";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { ServiceCatalogForm } from "@/components/forms/service-catalog-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet } from "@/components/ui/sheet";
import { currency } from "@/lib/utils";
import { deleteServiceCatalogAction } from "@/server/actions/service-catalog";
import { getServiceCatalog } from "@/server/queries";

export default async function ServiceCatalogPage() {
  const services = await getServiceCatalog({ includeInactive: true });

  return (
    <>
      <PageHeader
        eyebrow="Tabela"
        title="Servicos"
        description="Cadastre servicos, precos e duracao para preencher agenda e link publico sem retrabalho."
        action={
          <Sheet
            title="Novo servico"
            description="Cadastre um item da sua tabela de precos."
            trigger={
              <Button>
                <Plus size={16} />
                Novo servico
              </Button>
            }
          >
            <ServiceCatalogForm />
          </Sheet>
        }
      />

      <section className="premium-panel rounded-lg p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="brand-tile flex h-10 w-10 items-center justify-center rounded-lg text-lilac">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Tabela de servicos
            </h2>
            <p className="text-sm text-muted">
              Precos e duracoes entram automaticamente ao agendar.
            </p>
          </div>
        </div>

        {services.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.id} className="surface-row rounded-lg p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <Badge
                        className={
                          service.is_active
                            ? "border-mint/30 bg-mint/10 text-mint"
                            : "border-border/70 bg-background/35 text-muted"
                        }
                      >
                        {service.is_active ? "Ativo" : "Pausado"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {currency(service.price)} - {service.duration_minutes} min
                    </p>
                    {service.description ? (
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {service.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Sheet
                      title="Editar servico"
                      trigger={<Button variant="secondary">Editar</Button>}
                    >
                      <ServiceCatalogForm service={service} />
                    </Sheet>
                    <QuickActionForm
                      action={deleteServiceCatalogAction}
                      fields={{ id: service.id }}
                      label="Excluir"
                      variant="danger"
                      confirmMessage="Excluir este servico da tabela?"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Tabela ainda vazia"
            description="Cadastre seus servicos mais vendidos para preencher agendamentos em poucos toques."
          />
        )}
      </section>
    </>
  );
}
