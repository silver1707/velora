import {
  CalendarClock,
  CalendarPlus,
  CircleDollarSign,
  PackageCheck,
  Scissors,
  UsersRound,
} from "lucide-react";
import { BookingRequestsList } from "@/components/bookings/booking-requests-list";
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
    <article className="premium-panel flex h-full flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
      <div className="brand-action mb-4 h-1 w-12 rounded-full sm:w-16" />
      <div className="flex items-center justify-between gap-4">
        <div className="brand-tile flex h-9 w-9 items-center justify-center rounded-lg text-lilac sm:h-11 sm:w-11">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <p className="mt-4 line-clamp-1 text-xs text-muted sm:text-sm">{label}</p>
      <strong className="mt-1 block truncate text-lg font-semibold text-foreground sm:text-2xl">
        {value}
      </strong>
      <p className="mt-2 line-clamp-2 flex-1 text-[10px] leading-snug text-muted sm:line-clamp-none sm:text-xs">
        {detail}
      </p>
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
        description="Métricas rápidas para começar o dia sabendo agenda, receita, estoque e pedidos online."
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
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
          icon={CalendarPlus}
          label="Pedidos online"
          value={String(data.bookingRequests.length)}
          detail="Solicitações aguardando aceite pelo link público."
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

      <section className="premium-panel mt-6 rounded-lg p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-lilac/20 bg-lilac/10 text-lilac">
            <CalendarPlus size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Pedidos de agendamento online
            </h2>
            <p className="text-sm text-muted">
              Aceitar cria cliente e agendamento automaticamente; recusar remove da fila.
            </p>
          </div>
        </div>
        <BookingRequestsList requests={data.bookingRequests} />
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
                <div key={service.id} className="surface-row rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {service.clients?.name ?? "Cliente"}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {service.service_type} · {dateTimeLabel(service.scheduled_at)}
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
