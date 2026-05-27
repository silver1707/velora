import { addDays, addMonths, format, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { ServiceForm } from "@/components/forms/service-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { currency, dateTimeLabel, dayRange, statusLabel, statusTone } from "@/lib/utils";
import {
  updateServiceStatusAction,
} from "@/server/actions/services";
import { getClients, getProducts, getServiceRecords } from "@/server/queries";

function agendaRange(view: string, dateValue?: string) {
  const base = dateValue ? new Date(`${dateValue}T12:00:00`) : new Date();

  if (view === "semana") {
    const start = startOfWeek(base, { weekStartsOn: 1 });
    const end = addDays(start, 7);
    return {
      start,
      end,
      label: `${format(start, "dd MMM", { locale: ptBR })} - ${format(addDays(end, -1), "dd MMM", { locale: ptBR })}`,
    };
  }

  if (view === "mes") {
    const start = startOfMonth(base);
    const end = addMonths(start, 1);
    return {
      start,
      end,
      label: format(start, "MMMM yyyy", { locale: ptBR }),
    };
  }

  const range = dayRange(base);
  return {
    start: new Date(range.start),
    end: new Date(range.end),
    label: format(base, "dd 'de' MMMM, yyyy", { locale: ptBR }),
  };
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ visual?: string; data?: string }>;
}) {
  const params = await searchParams;
  const view = params.visual ?? "dia";
  const range = agendaRange(view, params.data);
  const [clients, products, services] = await Promise.all([
    getClients(),
    getProducts(),
    getServiceRecords({
      from: range.start.toISOString(),
      to: range.end.toISOString(),
    }),
  ]);
  const sorted = [...services].sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
  );
  const upcomingSoon = sorted.filter(
    (service) => service.status !== "cancelado",
  ).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Agenda"
        description="Visualize atendimentos por dia, semana ou mês e faça ações rápidas pelo celular."
        action={
          <Sheet
            title="Novo agendamento"
            description="Escolha cliente, horário, serviço e status."
            trigger={
              <Button>
                <CalendarPlus size={16} />
                Agendar
              </Button>
            }
          >
            <ServiceForm clients={clients} products={products} />
          </Sheet>
        }
      />

      <form className="toolbar-panel mb-5 grid gap-3 rounded-lg p-3 md:grid-cols-[160px_190px_auto]">
        <Select name="visual" defaultValue={view}>
          <option value="dia">Dia</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
        </Select>
        <Input
          type="date"
          name="data"
          defaultValue={params.data ?? format(new Date(), "yyyy-MM-dd")}
        />
        <Button type="submit" variant="secondary">
          <Clock3 size={16} />
          Atualizar
        </Button>
      </form>

      <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <article className="premium-panel rounded-lg p-4">
          <p className="text-sm font-medium text-lilac">Período selecionado</p>
          <h2 className="mt-1 text-xl font-semibold capitalize text-foreground">
            {range.label}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {sorted.length} atendimento(s) encontrados para esta visualização.
          </p>
        </article>
        <article className="rounded-lg border border-gold/25 bg-gold/10 p-4">
          <p className="text-sm font-medium text-gold">Próximos horários</p>
          {upcomingSoon.length ? (
            <div className="mt-2 grid gap-2">
              {upcomingSoon.map((service) => (
                <p key={service.id} className="text-sm text-foreground">
                  {dateTimeLabel(service.scheduled_at)} • {service.clients?.name ?? "Cliente"}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">Sem horários próximos neste período.</p>
          )}
        </article>
      </section>

      {sorted.length ? (
        <section className="grid gap-4">
          {sorted.map((service) => (
            <article key={service.id} className="premium-panel rounded-lg p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {dateTimeLabel(service.scheduled_at)}
                    </h2>
                    <Badge className={statusTone[service.status]}>
                      {statusLabel[service.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {service.clients?.name ?? "Cliente"} • {service.service_type}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {currency(service.price)} • {service.duration_minutes ?? 0} min
                  </p>
                </div>
                <div className="grid gap-2 sm:flex sm:flex-wrap">
                  <Sheet
                    title="Editar horário"
                    trigger={<Button variant="secondary">Editar</Button>}
                  >
                    <ServiceForm service={service} clients={clients} products={products} />
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
              {service.status === "agendado" ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-mint/20 bg-mint/10 px-3 py-2 text-sm text-mint">
                  <CheckCircle2 size={16} />
                  Horário confirmado na agenda.
                </div>
              ) : service.status === "cancelado" ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
                  <XCircle size={16} />
                  Atendimento cancelado.
                </div>
              ) : null}
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Agenda livre neste período"
          description="Use o botão Agendar para criar um novo horário."
        />
      )}
    </>
  );
}
