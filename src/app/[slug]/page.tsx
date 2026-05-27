import { CalendarCheck2, MessageCircle, Scissors } from "lucide-react";
import { notFound } from "next/navigation";
import { PublicBookingForm } from "@/components/forms/public-booking-form";
import { MarketingShell } from "@/components/marketing/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { getPublicBookingData } from "@/server/queries";

function todayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${byType.year}-${byType.month}-${byType.day}`;
}

export default async function PublicBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ data?: string; servico?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const selectedDate = query.data ?? todayInSaoPaulo();
  const data = await getPublicBookingData(slug, {
    date: selectedDate,
    serviceId: query.servico,
  });

  if (!data) {
    notFound();
  }

  const displayName =
    data.profile.business_name ?? data.profile.full_name ?? "Agenda Velora";

  return (
    <MarketingShell>
      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="premium-panel rounded-lg p-5 sm:p-6">
            <div className="brand-tile flex h-12 w-12 items-center justify-center rounded-lg text-lilac">
              <Scissors size={22} />
            </div>
            <Badge className="mt-6 border-lilac/30 bg-lilac/10 text-lilac">
              Agenda online
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
              {displayName}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Escolha um serviço, veja horários livres e envie seu pedido. A
              confirmação aparece depois que a profissional aceitar no Velora.
            </p>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="surface-row flex items-center gap-3 rounded-lg p-3">
                <CalendarCheck2 size={17} className="text-lilac" />
                <span className="text-muted">Horários livres em tempo real</span>
              </div>
              <div className="surface-row flex items-center gap-3 rounded-lg p-3">
                <MessageCircle size={17} className="text-lilac" />
                <span className="text-muted">Contato por WhatsApp após o pedido</span>
              </div>
            </div>
          </aside>

          <section className="premium-panel rounded-lg p-5 sm:p-6">
            <PublicBookingForm
              profile={data.profile}
              services={data.services}
              selectedService={data.selectedService}
              selectedDate={selectedDate}
              slots={data.slots}
            />
          </section>
        </section>
      </main>
    </MarketingShell>
  );
}
