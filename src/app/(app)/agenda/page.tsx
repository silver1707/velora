import { CalendarPlus } from "lucide-react";
import { BookingRequestsList } from "@/components/bookings/booking-requests-list";
import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  getClients,
  getBookingRequests,
  getProducts,
  getServiceCatalog,
  getServiceRecords,
} from "@/server/queries";
import { AgendaView } from "@/components/dashboard/agenda-view";

export const dynamic = "force-dynamic";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ visual?: string; data?: string }>;
}) {
  const params = await searchParams;
  const view = params.visual ?? "dia";
  
  const currentDate = params.data 
    ? new Date(`${params.data}T12:00:00`) 
    : new Date();

  // Load larger range to ensure we have data for the week/month
  const [clients, products, catalogServices, services, bookingRequests] = await Promise.all([
    getClients(),
    getProducts(),
    getServiceCatalog(),
    getServiceRecords({
      // Fetch 6 weeks to safely cover any monthly view
      from: new Date(currentDate.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date(currentDate.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    getBookingRequests({ status: "pendente", limit: 4 }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Planejamento"
        title="Agenda"
        description="Visualize e gerencie seus horários. Clique em um agendamento para ver detalhes ou use a grade para organizar sua semana."
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
            <ServiceForm
              clients={clients}
              products={products}
              catalogServices={catalogServices}
            />
          </Sheet>
        }
      />

      <section className="premium-panel mb-6 rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Pedidos pendentes
            </h2>
            <p className="text-sm text-muted">
              Solicitações do link público ficam aqui antes de entrar na agenda.
            </p>
          </div>
        </div>
        <BookingRequestsList requests={bookingRequests} compact />
      </section>

      <div className="mt-6">
        <AgendaView 
          view={view} 
          currentDate={currentDate} 
          services={services} 
          clients={clients} 
          products={products} 
          catalogServices={catalogServices}
        />
      </div>
    </>
  );
}
