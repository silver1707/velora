import { CalendarPlus, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { BookingRequestsList } from "@/components/bookings/booking-requests-list";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { currency, dateTimeLabel } from "@/lib/utils";
import { getBookingRequests } from "@/server/queries";

const statusOptions = [
  { value: "pendente", label: "Pendentes" },
  { value: "aceito", label: "Aceitos" },
  { value: "recusado", label: "Recusados" },
  { value: "", label: "Todos" },
];

const statusTone: Record<string, string> = {
  pendente: "border-gold/30 bg-gold/10 text-gold",
  aceito: "border-mint/30 bg-mint/10 text-mint",
  recusado: "border-danger/30 bg-danger/10 text-danger",
};

const statusLabel: Record<string, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  recusado: "Recusado",
};

export default async function BookingRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "pendente";
  const [requests, pendingRequests] = await Promise.all([
    getBookingRequests({
      status: status || undefined,
    }),
    getBookingRequests({ status: "pendente" }),
  ]);
  const pendingCount = pendingRequests.length;

  return (
    <>
      <PageHeader
        eyebrow="Agendamento online"
        title="Pedidos"
        description="Tudo que chega pelo link público aparece aqui. Aceitar cria cliente e agendamento automaticamente; recusar tira da fila."
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <article className="premium-panel rounded-lg p-4">
          <CalendarPlus className="text-lilac" size={20} />
          <p className="mt-3 text-sm text-muted">Pedidos na lista</p>
          <strong className="mt-1 block text-2xl text-foreground">
            {requests.length}
          </strong>
        </article>
        <article className="premium-panel rounded-lg p-4">
          <Clock3 className="text-gold" size={20} />
          <p className="mt-3 text-sm text-muted">Pendentes agora</p>
          <strong className="mt-1 block text-2xl text-foreground">
            {status === "pendente" ? requests.length : pendingCount}
          </strong>
        </article>
        <article className="premium-panel rounded-lg p-4">
          <CheckCircle2 className="text-mint" size={20} />
          <p className="mt-3 text-sm text-muted">Aceitos no filtro</p>
          <strong className="mt-1 block text-2xl text-foreground">
            {requests.filter((request) => request.status === "aceito").length}
          </strong>
        </article>
        <article className="premium-panel rounded-lg p-4">
          <XCircle className="text-danger" size={20} />
          <p className="mt-3 text-sm text-muted">Recusados no filtro</p>
          <strong className="mt-1 block text-2xl text-foreground">
            {requests.filter((request) => request.status === "recusado").length}
          </strong>
        </article>
      </section>

      <form className="toolbar-panel my-5 grid gap-3 rounded-lg p-3 sm:grid-cols-[240px_auto_1fr]">
        <Select name="status" defaultValue={status}>
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      {status === "pendente" ? (
        <BookingRequestsList requests={requests} />
      ) : (
        <section className="grid gap-3">
          {requests.map((request) => (
            <article key={request.id} className="premium-panel rounded-lg p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      {request.client_name}
                    </h2>
                    <Badge className={statusTone[request.status]}>
                      {statusLabel[request.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {request.service_name} · {dateTimeLabel(request.requested_start_at)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {currency(request.estimated_price)} · {request.requested_duration_minutes} min
                  </p>
                  {request.client_notes ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                      {request.client_notes}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!requests.length ? (
            <BookingRequestsList
              requests={[]}
              emptyTitle="Nenhum pedido neste filtro"
              emptyDescription="Troque o filtro para ver outros pedidos que chegaram pelo link público."
            />
          ) : null}
        </section>
      )}
    </>
  );
}
