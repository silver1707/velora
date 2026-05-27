import { ExternalLink, Plus, Settings, Sparkles } from "lucide-react";
import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { ServiceCatalogForm } from "@/components/forms/service-catalog-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet } from "@/components/ui/sheet";
import { env } from "@/lib/env";
import { currency } from "@/lib/utils";
import { deleteServiceCatalogAction } from "@/server/actions/service-catalog";
import { getProfileSettings, getServiceCatalog } from "@/server/queries";

export default async function SettingsPage() {
  const [profile, services] = await Promise.all([
    getProfileSettings(),
    getServiceCatalog({ includeInactive: true }),
  ]);
  const bookingUrl = profile.public_slug
    ? `${env.appUrl}/${profile.public_slug}`
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Configurações"
        title="Ajustes"
        description="Configure seu perfil público, link de agendamento e tabela de serviços para acelerar a rotina."
        action={
          bookingUrl && profile.booking_enabled ? (
            <LinkButton href={bookingUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Ver link público
            </LinkButton>
          ) : null
        }
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="premium-panel rounded-lg p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="brand-tile flex h-10 w-10 items-center justify-center rounded-lg text-lilac">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Perfil e agendamento online
              </h2>
              <p className="text-sm text-muted">
                Esses dados aparecem no link público da sua agenda.
              </p>
            </div>
          </div>
          <ProfileSettingsForm profile={profile} bookingUrl={bookingUrl} />
        </article>

        <article className="premium-panel rounded-lg p-5">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-tile flex h-10 w-10 items-center justify-center rounded-lg text-lilac">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Tabela de serviços
                </h2>
                <p className="text-sm text-muted">
                  Preços e durações entram automaticamente ao agendar.
                </p>
              </div>
            </div>
            <Sheet
              title="Novo serviço"
              description="Cadastre um item da sua tabela de preços."
              trigger={
                <Button>
                  <Plus size={16} />
                  Novo serviço
                </Button>
              }
            >
              <ServiceCatalogForm />
            </Sheet>
          </div>

          {services.length ? (
            <div className="grid gap-3">
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
                        {currency(service.price)} · {service.duration_minutes} min
                      </p>
                      {service.description ? (
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {service.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Sheet
                        title="Editar serviço"
                        trigger={<Button variant="secondary">Editar</Button>}
                      >
                        <ServiceCatalogForm service={service} />
                      </Sheet>
                      <QuickActionForm
                        action={deleteServiceCatalogAction}
                        fields={{ id: service.id }}
                        label="Excluir"
                        variant="danger"
                        confirmMessage="Excluir este serviço da tabela?"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Tabela ainda vazia"
              description="Cadastre seus serviços mais vendidos para preencher agendamentos em poucos toques."
            />
          )}
        </article>
      </section>
    </>
  );
}
