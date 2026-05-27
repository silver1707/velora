import { CalendarPlus } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { ServiceForm } from "@/components/forms/service-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { getClients, getProducts, getServiceRecords } from "@/server/queries";
import { AgendaView } from "@/components/dashboard/agenda-view";

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
  const [clients, products, services] = await Promise.all([
    getClients(),
    getProducts(),
    getServiceRecords({
      // Fetch 6 weeks to safely cover any monthly view
      from: new Date(currentDate.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date(currentDate.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    }),
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
            <ServiceForm clients={clients} products={products} />
          </Sheet>
        }
      />

      <div className="mt-6">
        <AgendaView 
          view={view} 
          currentDate={currentDate} 
          services={services} 
          clients={clients} 
          products={products} 
        />
      </div>
    </>
  );
}
