import { CalendarPlus, CircleCheck, Search, XCircle } from "lucide-react";
import { ServiceForm } from "@/components/forms/service-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/field";
import { Pagination } from "@/components/ui/pagination";
import { Sheet } from "@/components/ui/sheet";
import { appointmentStatuses } from "@/lib/constants";
import {
  currency,
  dateTimeLabel,
  statusLabel,
  statusTone,
} from "@/lib/utils";
import {
  deleteServiceAction,
  updateServiceStatusAction,
} from "@/server/actions/services";
import {
  getClients,
  getProducts,
  getServiceCatalog,
  getServiceRecordsPage,
} from "@/server/queries";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cliente?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [clients, products, catalogServices, servicesPage] = await Promise.all([
    getClients(),
    getProducts(),
    getServiceCatalog(),
    getServiceRecordsPage({
      status: params.status,
      clientId: params.cliente,
      page: params.page,
    }),
  ]);
  const services = servicesPage.data;

  return (
    <>
      <PageHeader
        eyebrow="Serviços"
        title="Atendimentos"
        description="Registre serviços realizados, valores, produtos usados, status e observações técnicas."
        action={
          <Sheet
            title="Novo atendimento"
            description="Crie um agendamento ou registre um serviço concluído."
            trigger={
              <Button>
                <CalendarPlus size={16} />
                Novo atendimento
              </Button>
            }
          >
            <ServiceForm
              clients={clients}
              products={products}
              catalogServices={catalogServices}
            />
          </Sheet>
        }
      />

      <form className="toolbar-panel mb-5 grid gap-3 rounded-lg p-3 md:grid-cols-[220px_1fr_auto]">
        <Select name="status" defaultValue={params.status ?? ""}>
          <option value="">Todos os status</option>
          {appointmentStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>
        <Select name="cliente" defaultValue={params.cliente ?? ""}>
          <option value="">Todas as clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          <Search size={16} />
          Buscar
        </Button>
      </form>

      {services.length ? (
        <section className="grid gap-4">
          {services.map((service) => (
            <article key={service.id} className="premium-panel rounded-lg p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {service.service_type}
                    </h2>
                    <Badge className={statusTone[service.status]}>
                      {statusLabel[service.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {service.clients?.name ?? "Cliente"} • {dateTimeLabel(service.scheduled_at)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {currency(service.price)} • {service.payment_method || "Pagamento não informado"} • {service.duration_minutes ?? 0} min
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Sheet
                    title="Editar atendimento"
                    trigger={<Button variant="secondary">Editar</Button>}
                  >
                    <ServiceForm
                      service={service}
                      clients={clients}
                      products={products}
                      catalogServices={catalogServices}
                    />
                  </Sheet>
                  <QuickActionForm
                    action={updateServiceStatusAction}
                    fields={{ id: service.id, status: "concluido" }}
                    label="Concluir"
                    variant="secondary"
                  />
                  <QuickActionForm
                    action={updateServiceStatusAction}
                    fields={{ id: service.id, status: "cancelado" }}
                    label="Cancelar"
                    variant="danger"
                  />
                </div>
              </div>

              {service.service_products?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.service_products.map((item) => (
                    <Badge key={item.id} className="border-border/70 bg-background/35 text-muted">
                      {item.products?.name ?? "Produto"} x {item.quantity_used}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {service.notes ? (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {service.notes}
                </p>
              ) : null}

              <div className="soft-divider mt-4 flex flex-wrap gap-2 border-t pt-4">
                <QuickActionForm
                  action={deleteServiceAction}
                  fields={{ id: service.id }}
                  label="Excluir atendimento"
                  variant="danger"
                  confirmMessage="Excluir este atendimento?"
                />
                {service.status !== "concluido" ? (
                  <span className="inline-flex items-center gap-2 text-sm text-muted">
                    <CircleCheck size={16} className="text-mint" />
                    Marque como concluído para gerar recebimento.
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm text-muted">
                    <XCircle size={16} className="text-lilac" />
                    Recebimento sincronizado com o financeiro.
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Nenhum atendimento encontrado"
          description="Crie um atendimento para alimentar histórico, agenda e financeiro."
        />
      )}
      <Pagination
        basePath="/atendimentos"
        page={servicesPage.page}
        totalPages={servicesPage.totalPages}
        total={servicesPage.total}
        params={{ status: params.status, cliente: params.cliente }}
      />
    </>
  );
}
