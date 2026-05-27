import { addMonths, format, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleDollarSign, Plus } from "lucide-react";
import { FinanceEntryForm } from "@/components/forms/finance-entry-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Sheet } from "@/components/ui/sheet";
import { currency, dateTimeLabel, dayRange } from "@/lib/utils";
import { deleteFinanceEntryAction } from "@/server/actions/finance";
import {
  getClients,
  getFinanceEntries,
  getFinanceEntriesPage,
  getServiceRecords,
} from "@/server/queries";

function sum(entries: Array<{ amount: number }>) {
  return entries.reduce((total, entry) => total + Number(entry.amount ?? 0), 0);
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const today = dayRange();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const monthStart = startOfMonth(new Date());
  const monthEnd = addMonths(monthStart, 1);

  const [monthEntries, entriesPage, clients, services] = await Promise.all([
    getFinanceEntries({ from: monthStart.toISOString(), to: monthEnd.toISOString() }),
    getFinanceEntriesPage({
      from: monthStart.toISOString(),
      to: monthEnd.toISOString(),
      page: params.page,
    }),
    getClients(),
    getServiceRecords({ status: "concluido" }),
  ]);
  const entries = entriesPage.data;

  const todayEntries = monthEntries.filter(
    (entry) =>
      new Date(entry.received_at) >= new Date(today.start) &&
      new Date(entry.received_at) < new Date(today.end),
  );
  const weekEntries = monthEntries.filter(
    (entry) => new Date(entry.received_at) >= weekStart,
  );
  const serviceReturn = Object.entries(
    monthEntries.reduce<Record<string, number>>((acc, entry) => {
      const service = entry.service_records?.service_type ?? "Avulso";
      acc[service] = (acc[service] ?? 0) + Number(entry.amount ?? 0);
      return acc;
    }, {}),
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <PageHeader
        eyebrow="Financeiro"
        title="Recebimentos"
        description="Acompanhe faturamento diário, semanal, mensal e serviços que mais retornam receita."
        action={
          <Sheet
            title="Registrar recebimento"
            description="Use para valores avulsos ou ajustes manuais."
            trigger={
              <Button>
                <Plus size={16} />
                Novo recebimento
              </Button>
            }
          >
            <FinanceEntryForm clients={clients} services={services} />
          </Sheet>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="premium-panel rounded-lg p-5">
          <p className="text-sm text-muted">Total de hoje</p>
          <strong className="mt-2 block text-2xl font-semibold text-foreground">
            {currency(sum(todayEntries))}
          </strong>
          <p className="mt-2 text-xs text-muted">
            {format(new Date(), "dd MMM yyyy", { locale: ptBR })}
          </p>
        </article>
        <article className="premium-panel rounded-lg p-5">
          <p className="text-sm text-muted">Total da semana</p>
          <strong className="mt-2 block text-2xl font-semibold text-foreground">
            {currency(sum(weekEntries))}
          </strong>
          <p className="mt-2 text-xs text-muted">Semana iniciada na segunda.</p>
        </article>
        <article className="premium-panel rounded-lg p-5">
          <p className="text-sm text-muted">Total do mês</p>
          <strong className="mt-2 block text-2xl font-semibold text-foreground">
            {currency(sum(monthEntries))}
          </strong>
          <p className="mt-2 text-xs text-muted">
            Recebimentos do mês atual.
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="premium-panel rounded-lg p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-lilac/20 bg-lilac/10 text-lilac">
              <CircleDollarSign size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Lançamentos do mês
              </h2>
              <p className="text-sm text-muted">
                Atendimentos concluídos geram entrada automaticamente.
              </p>
            </div>
          </div>
          {entries.length ? (
            <div className="grid gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="surface-row rounded-lg p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {currency(entry.amount)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {entry.clients?.name ?? "Recebimento avulso"} • {entry.payment_method || "Sem forma"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {dateTimeLabel(entry.received_at)}
                      </p>
                    </div>
                    <QuickActionForm
                      action={deleteFinanceEntryAction}
                      fields={{ id: entry.id }}
                      label="Excluir"
                      variant="danger"
                      confirmMessage="Excluir este recebimento?"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem recebimentos no mês"
              description="Conclua atendimentos ou lance um recebimento manual."
            />
          )}
          <Pagination
            basePath="/financeiro"
            page={entriesPage.page}
            totalPages={entriesPage.totalPages}
            total={entriesPage.total}
            params={{}}
          />
        </article>

        <article className="premium-panel rounded-lg p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Serviços com maior retorno
          </h2>
          <div className="mt-4 grid gap-3">
            {serviceReturn.length ? (
              serviceReturn.map((item) => (
                <div
                  key={item.name}
                  className="surface-row flex items-center justify-between gap-4 rounded-lg p-4"
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                  <Badge className="border-mint/30 bg-mint/10 text-mint">
                    {currency(item.total)}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem dados ainda"
                description="Os serviços mais rentáveis aparecem após entradas financeiras."
              />
            )}
          </div>
        </article>
      </section>
    </>
  );
}
