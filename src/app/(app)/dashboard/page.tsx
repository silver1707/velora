import {
  CalendarClock,
  CircleDollarSign,
  PackageCheck,
  Scissors,
  UsersRound,
} from "lucide-react";
import { ServicesChart } from "@/components/dashboard/services-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getDashboardData } from "@/server/queries";
import { currency, dateTimeLabel, statusLabel, statusTone } from "@/lib/utils";

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof UsersRound;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="premium-panel overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col h-full">
      <div className="brand-action mb-4 h-1 w-12 sm:w-16 rounded-full" />
      <div className="flex items-center justify-between gap-4">
        <div className="brand-tile flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg text-lilac">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <p className="mt-4 text-xs sm:text-sm text-muted line-clamp-1">{label}</p>
      <strong className="mt-1 block text-lg sm:text-2xl font-semibold text-foreground truncate">
        {value}
      </strong>
      <p className="mt-2 text-[10px] sm:text-xs leading-snug text-muted line-clamp-2 sm:line-clamp-none flex-1">{detail}</p>
    </article>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Dashboard"
        description="Métricas rápidas para começar o dia sabendo agenda, receita e estoque."
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          icon={UsersRound}
          label="Clientes cadastradas"
          value={String(data.clientsCount)}
          detail="Base ativa para histórico e preferências."
        />
        <MetricCard
          icon={Scissors}
          label="Atendimentos no mês"
          value={String(data.monthServices.length)}
          detail="Inclui agendados, concluídos, pendentes e cancelados."
        />
        <MetricCard
          icon={CircleDollarSign}
          label="Faturamento do mês"
          value={currency(data.monthRevenue)}
          detail="Recebimentos lançados ou gerados por atendimento concluído."
        />
        <MetricCard
          icon={PackageCheck}
          label="Produtos em alerta"
          value={String(data.lowStock.length)}
          detail="Itens abaixo do mínimo ou marcados como acabando."
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="premium-panel rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Serviços mais realizados
              </h2>
              <p className="mt-1 text-sm text-muted">
                Volume do mês atual por tipo de serviço.
              </p>
            </div>
          </div>
          <ServicesChart data={data.servicesByType} />
        </article>

        <article className="premium-panel rounded-lg p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
              <CalendarClock size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Atendimentos de hoje
              </h2>
              <p className="text-sm text-muted">Alertas rápidos do dia.</p>
            </div>
          </div>
          {data.todayAppointments.length ? (
            <div className="grid gap-3">
              {data.todayAppointments.map((service) => (
                <div
                  key={service.id}
                  className="surface-row rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {service.clients?.name ?? "Cliente"}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {service.service_type} • {dateTimeLabel(service.scheduled_at)}
                      </p>
                    </div>
                    <Badge className={statusTone[service.status]}>
                      {statusLabel[service.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum atendimento hoje"
              description="Quando a agenda do dia tiver horários, eles aparecem aqui."
            />
          )}
        </article>
      </section>

    </>
  );
}
