import { addMonths, format, parse, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CircleDollarSign, Plus, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
  searchParams: Promise<{ page?: string; month?: string }>;
}) {
  const params = await searchParams;
  
  // Base date for filtering
  const baseDate = params.month 
    ? parse(params.month, "yyyy-MM", new Date())
    : new Date();

  const today = dayRange();
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(baseDate);
  const monthEnd = addMonths(monthStart, 1);

  // Month navigation dates
  const prevMonth = subMonths(monthStart, 1);
  const nextMonth = addMonths(monthStart, 1);
  const isCurrentMonth = format(new Date(), "yyyy-MM") === format(monthStart, "yyyy-MM");

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
        description="Acompanhe o faturamento diário, semanal e mensal, além dos serviços que mais retornam receita."
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

      {/* Month Navigator */}
      <div className="mb-6 flex items-center justify-between premium-panel rounded-2xl p-3 shadow-sm max-w-sm">
        <Link
          href={`/financeiro?month=${format(prevMonth, "yyyy-MM")}`}
          className="p-2 text-muted hover:text-foreground hover:bg-surface-raised rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h2 className="text-lg font-bold capitalize text-foreground">
          {format(monthStart, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex gap-1 items-center">
          {!isCurrentMonth && (
            <Link
              href={`/financeiro`}
              className="text-xs font-semibold text-lilac bg-lilac/10 hover:bg-lilac/20 px-2 py-1 rounded transition-colors mr-1"
            >
              Hoje
            </Link>
          )}
          <Link
            href={`/financeiro?month=${format(nextMonth, "yyyy-MM")}`}
            className="p-2 text-muted hover:text-foreground hover:bg-surface-raised rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-3">
        {/* Today Card - High contrast Mint */}
        <article className={`premium-panel group rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${isCurrentMonth ? 'shadow-[0_0_30px_-15px_var(--mint)] border-mint/30' : 'opacity-60 grayscale'}`}>
          {isCurrentMonth && <div className="absolute top-0 right-0 p-4 opacity-10"><CircleDollarSign size={80} /></div>}
          <div className="absolute inset-0 bg-gradient-to-br from-mint/5 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-muted uppercase tracking-wider relative z-10">Total de Hoje</p>
          <strong className="mt-2 block text-4xl font-bold text-foreground tracking-tight relative z-10">
            {currency(sum(todayEntries))}
          </strong>
          <p className="mt-2 text-xs font-medium text-mint relative z-10">
            {format(new Date(), "dd MMM yyyy", { locale: ptBR })}
          </p>
        </article>

        {/* Week Card - Subtle Gold */}
        <article className="premium-panel group rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-gold/30">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-muted uppercase tracking-wider relative z-10">Total da Semana</p>
          <strong className="mt-2 block text-4xl font-bold text-foreground tracking-tight relative z-10">
            {currency(sum(weekEntries))}
          </strong>
          <p className="mt-2 text-xs font-medium text-gold relative z-10">
            Semana iniciada na segunda.
          </p>
        </article>

        {/* Month Card - Strong Lilac */}
        <article className="premium-panel group rounded-2xl p-6 relative overflow-hidden transition-all duration-300 border-lilac/20 shadow-[0_0_20px_-10px_var(--lilac)]">
          <div className="absolute inset-0 bg-gradient-to-br from-lilac-strong/10 to-transparent pointer-events-none" />
          <p className="text-sm font-medium text-muted uppercase tracking-wider relative z-10">Total do Mês</p>
          <strong className="mt-2 block text-4xl font-bold text-foreground tracking-tight relative z-10">
            {currency(sum(monthEntries))}
          </strong>
          <p className="mt-2 text-xs font-medium text-lilac relative z-10">
            {format(monthStart, "MMMM", { locale: ptBR })} completo.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <article className="premium-panel rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-border-soft pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lilac-strong to-lilac-deep text-white shadow-lg">
                <CircleDollarSign size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Lançamentos do Mês
                </h2>
                <p className="text-sm font-medium text-muted mt-0.5">
                  Atendimentos concluídos geram entrada automaticamente.
                </p>
              </div>
            </div>
          </div>
          
          {entries.length ? (
            <div className="grid gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border-soft bg-background/40 p-4 transition-all hover:bg-surface-raised hover:border-lilac/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-mint/10 text-mint">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">
                        {currency(entry.amount)}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-muted">
                        {entry.clients?.name ?? "Recebimento avulso"} <span className="text-border mx-1">•</span> <span className="text-lilac">{entry.payment_method || "Sem forma"}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <p className="text-xs font-medium text-muted-strong uppercase tracking-wide">
                      {format(new Date(entry.received_at), "dd MMM, HH:mm", { locale: ptBR })}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <QuickActionForm
                        action={deleteFinanceEntryAction}
                        fields={{ id: entry.id }}
                        label="Estornar"
                        variant="danger"
                        confirmMessage="Deseja realmente excluir/estornar este recebimento?"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem recebimentos"
              description={`Nenhuma entrada financeira em ${format(monthStart, "MMMM yyyy", { locale: ptBR })}.`}
            />
          )}
          <div className="mt-6">
            <Pagination
              basePath="/financeiro"
              page={entriesPage.page}
              totalPages={entriesPage.totalPages}
              total={entriesPage.total}
              params={{ month: params.month }}
            />
          </div>
        </article>

        <article className="premium-panel rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-foreground border-b border-border-soft pb-4 mb-6">
            Serviços com Maior Retorno
          </h2>
          <div className="grid gap-3">
            {serviceReturn.length ? (
              serviceReturn.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border-soft bg-background/40 p-4 transition-all hover:bg-surface-raised hover:border-mint/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-soft text-sm font-bold text-muted">
                      {index + 1}º
                    </div>
                    <span className="font-semibold text-foreground">{item.name}</span>
                  </div>
                  <Badge className="border-mint/30 bg-mint/10 text-mint font-bold px-3 py-1 text-sm">
                    {currency(item.total)}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem dados de serviços"
                description="Os serviços mais rentáveis aparecem após o primeiro faturamento."
              />
            )}
          </div>
        </article>
      </section>
    </>
  );
}
