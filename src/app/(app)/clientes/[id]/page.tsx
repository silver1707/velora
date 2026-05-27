import { CalendarPlus, Clock, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet } from "@/components/ui/sheet";
import { currency, dateLabel, dateTimeLabel, statusLabel, statusTone } from "@/lib/utils";
import { getClientById, getProducts, getServiceCatalog } from "@/server/queries";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [detail, products, catalogServices] = await Promise.all([
    getClientById(id).catch(() => null),
    getProducts(),
    getServiceCatalog(),
  ]);

  if (!detail) {
    notFound();
  }

  const { client, services } = detail;
  const servicesWithPhotos = services.filter(
    (service) => service.before_photo_url || service.after_photo_url,
  );

  return (
    <>
      <PageHeader
        eyebrow="Histórico da cliente"
        title={client.name}
        description="Preferências, dados técnicos e todos os serviços em ordem cronológica."
        action={
          <Sheet
            title="Novo atendimento"
            description={`Adicionar serviço para ${client.name}.`}
            trigger={
              <Button>
                <CalendarPlus size={16} />
                Novo atendimento
              </Button>
            }
          >
            <ServiceForm
              clients={[client]}
              products={products}
              defaultClientId={client.id}
              catalogServices={catalogServices}
            />
          </Sheet>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <aside className="grid gap-4">
          <article className="premium-panel rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Ficha rápida</h2>
                <p className="mt-1 text-sm text-muted">
                  {client.hair_type ?? "Tipo de cabelo não informado"}
                </p>
              </div>
              {client.service_frequency ? (
                <Badge className="border-lilac/30 bg-lilac/10 text-lilac">
                  {client.service_frequency}
                </Badge>
              ) : null}
            </div>
            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-lilac" />
                <span className="text-muted">{client.phone || "Sem telefone"}</span>
              </div>
              <div>
                <dt className="text-muted">Nascimento</dt>
                <dd className="mt-1 text-foreground">
                  {client.birth_date ? dateLabel(client.birth_date) : "Não informado"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Endereço ou bairro</dt>
                <dd className="mt-1 text-foreground">
                  {[client.address, client.neighborhood].filter(Boolean).join(" • ") ||
                    "Não informado"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Alergias</dt>
                <dd className="mt-1 whitespace-pre-wrap text-foreground">
                  {client.allergies || "Sem registro"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Preferências</dt>
                <dd className="mt-1 whitespace-pre-wrap text-foreground">
                  {client.preferences || "Sem registro"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Histórico químico</dt>
                <dd className="mt-1 whitespace-pre-wrap text-foreground">
                  {client.chemical_history || "Sem registro"}
                </dd>
              </div>
            </dl>
          </article>

          {(client.before_photo_url || client.after_photo_url) ? (
            <article className="premium-panel rounded-lg p-5">
              <h2 className="text-lg font-semibold text-foreground">Antes e depois</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {client.before_photo_url ? (
                  <div>
                    <p className="mb-2 text-xs text-muted">Antes</p>
                    <Image
                      src={client.before_photo_url}
                      alt={`Antes de ${client.name}`}
                      width={500}
                      height={360}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                {client.after_photo_url ? (
                  <div>
                    <p className="mb-2 text-xs text-muted">Depois</p>
                    <Image
                      src={client.after_photo_url}
                      alt={`Depois de ${client.name}`}
                      width={500}
                      height={360}
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
              </div>
            </article>
          ) : null}
        </aside>

        <div className="grid gap-6">
          {servicesWithPhotos.length ? (
            <section className="premium-panel rounded-lg p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose/25 bg-rose/10 text-rose">
                  <Clock size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Evolução visual
                  </h2>
                  <p className="text-sm text-muted">
                    Antes e depois registrados em cada atendimento.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {servicesWithPhotos.slice(0, 4).map((service) => (
                  <article key={service.id} className="surface-row rounded-lg p-3">
                    <p className="mb-3 text-sm font-medium text-foreground">
                      {service.service_type} · {dateLabel(service.scheduled_at)}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                      {service.before_photo_url ? (
                        <div>
                          <p className="mb-2 text-xs text-muted">Antes</p>
                          <Image
                            src={service.before_photo_url}
                            alt={`Antes de ${service.service_type}`}
                            width={420}
                            height={315}
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                      {service.after_photo_url ? (
                        <div>
                          <p className="mb-2 text-xs text-muted">Depois</p>
                          <Image
                            src={service.after_photo_url}
                            alt={`Depois de ${service.service_type}`}
                            width={420}
                            height={315}
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="premium-panel rounded-lg p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-lilac/20 bg-lilac/10 text-lilac">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Serviços realizados
              </h2>
              <p className="text-sm text-muted">Do mais recente ao mais antigo.</p>
            </div>
          </div>

          {services.length ? (
            <div className="grid gap-4">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="surface-row rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {service.service_type}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {dateTimeLabel(service.scheduled_at)} • {currency(service.price)}
                      </p>
                    </div>
                    <Badge className={statusTone[service.status]}>
                      {statusLabel[service.status]}
                    </Badge>
                  </div>
                  {service.service_products?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.service_products.map((item) => (
                        <Badge
                          key={item.id}
                          className="border-border/70 bg-background/35 text-muted"
                        >
                          {item.products?.name ?? "Produto"} x {item.quantity_used} {item.products?.unit ?? ""}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {service.notes ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                      {service.notes}
                    </p>
                  ) : null}
                  {service.before_photo_url || service.after_photo_url ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {service.before_photo_url ? (
                        <div>
                          <p className="mb-2 text-xs text-muted">Antes</p>
                          <Image
                            src={service.before_photo_url}
                            alt={`Antes de ${service.service_type}`}
                            width={420}
                            height={315}
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                      {service.after_photo_url ? (
                        <div>
                          <p className="mb-2 text-xs text-muted">Depois</p>
                          <Image
                            src={service.after_photo_url}
                            alt={`Depois de ${service.service_type}`}
                            width={420}
                            height={315}
                            className="aspect-[4/3] w-full rounded-lg object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Histórico ainda vazio"
              description="Quando um serviço for registrado para esta cliente, ele aparecerá nesta linha do tempo."
            />
          )}
          </section>
        </div>
      </section>
    </>
  );
}
