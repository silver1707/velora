import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isTomorrow,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { ServiceForm } from "@/components/forms/service-form";
import { QuickActionForm } from "@/components/forms/quick-action-form";
import { updateServiceStatusAction } from "@/server/actions/services";
import { LinkButton } from "@/components/ui/button";
import type { Client, Product, ServiceCatalogItem, ServiceRecord } from "@/lib/types";
import { currency } from "@/lib/utils";

// Helper to determine the default duration for layout purposes
const DEFAULT_DURATION = 60; // 60 minutes
const START_HOUR = 8; // 08:00
const END_HOUR = 20; // 20:00

export function AgendaView({
  services,
  view,
  currentDate,
  clients,
  products,
  catalogServices,
}: {
  services: ServiceRecord[];
  view: string;
  currentDate: Date;
  clients: Client[];
  products: Product[];
  catalogServices: ServiceCatalogItem[];
}) {
  const formatUrl = (newDate: Date, newView?: string) => {
    const params = new URLSearchParams();
    params.set("visual", newView || view);
    params.set("data", format(newDate, "yyyy-MM-dd"));
    return `/agenda?${params.toString()}`;
  };

  // Determine prev/next dates
  let prevDate, nextDate;
  if (view === "mes") {
    prevDate = subMonths(currentDate, 1);
    nextDate = addMonths(currentDate, 1);
  } else if (view === "semana") {
    prevDate = subWeeks(currentDate, 1);
    nextDate = addWeeks(currentDate, 1);
  } else {
    prevDate = subDays(currentDate, 1);
    nextDate = addDays(currentDate, 1);
  }

  // Generate view title
  let viewTitle = "";
  if (view === "mes") {
    viewTitle = format(currentDate, "MMMM yyyy", { locale: ptBR });
  } else if (view === "semana") {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    viewTitle = `${format(start, "dd MMM", { locale: ptBR })} a ${format(end, "dd MMM", { locale: ptBR })}`;
  } else {
    viewTitle = format(currentDate, "dd 'de' MMMM, yyyy", { locale: ptBR });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar Header Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 premium-panel p-2 rounded-2xl">
        <div className="flex items-center gap-1">
          <Link
            href={formatUrl(prevDate)}
            className="p-2 text-muted hover:text-foreground hover:bg-surface-raised rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <Link
            href={formatUrl(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-raised rounded-lg transition-colors"
          >
            Hoje
          </Link>
          <Link
            href={formatUrl(nextDate)}
            className="p-2 text-muted hover:text-foreground hover:bg-surface-raised rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </Link>
          <h2 className="ml-2 text-lg font-semibold capitalize tracking-tight text-foreground hidden sm:block">
            {viewTitle}
          </h2>
        </div>

        <div className="flex w-max self-start sm:self-auto bg-surface-raised p-1 rounded-xl">
          <Link
            href={formatUrl(currentDate, "dia")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              view === "dia" ? "bg-lilac-strong text-white shadow-md" : "text-muted hover:text-foreground"
            }`}
          >
            Dia
          </Link>
          <Link
            href={formatUrl(currentDate, "semana")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              view === "semana" ? "bg-lilac-strong text-white shadow-md" : "text-muted hover:text-foreground"
            }`}
          >
            Semana
          </Link>
          <Link
            href={formatUrl(currentDate, "mes")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              view === "mes" ? "bg-lilac-strong text-white shadow-md" : "text-muted hover:text-foreground"
            }`}
          >
            Mês
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-bold capitalize sm:hidden text-foreground px-1">
        {viewTitle}
      </h2>

      {/* View Render */}
      {view === "mes" ? (
        <MonthlyGrid currentDate={currentDate} services={services} />
      ) : view === "semana" ? (
        <WeeklyTimeline
          currentDate={currentDate}
          services={services}
          clients={clients}
          products={products}
          catalogServices={catalogServices}
        />
      ) : (
        <DailyTimeline
          services={services}
          clients={clients}
          products={products}
          catalogServices={catalogServices}
        />
      )}
    </div>
  );
}

function whatsappNumber(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits.length > 11 ? digits : "";
}

function whatsappReminderLink(service: ServiceRecord) {
  const date = new Date(service.scheduled_at);
  const when = isToday(date)
    ? "hoje"
    : isTomorrow(date)
      ? "amanhã"
      : `no dia ${format(date, "dd/MM", { locale: ptBR })}`;
  const message = `Olá ${service.clients?.name ?? ""}, tudo bem? Passando para confirmar nosso horário ${when} às ${format(date, "HH:mm")} para ${service.service_type}. Te espero!`;
  const phone = whatsappNumber(service.clients?.phone);

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function ServiceCard({
  service,
  clients,
  products,
  catalogServices,
}: {
  service: ServiceRecord;
  clients: Client[];
  products: Product[];
  catalogServices: ServiceCatalogItem[];
}) {
  const isDone = service.status === "concluido";
  const isCanceled = service.status === "cancelado";

  const colorClass = isCanceled
    ? "bg-danger/10 border-danger/20 text-danger"
    : isDone
    ? "bg-mint/10 border-mint/20 text-mint"
    : "bg-lilac/10 border-lilac/30 text-lilac";

  return (
    <Sheet
      title="Detalhes do Agendamento"
      trigger={
        <div className={`w-full h-full p-3 rounded-xl border flex flex-col items-start text-left overflow-hidden transition-all hover:brightness-125 shadow-sm backdrop-blur-md cursor-pointer ${colorClass}`}>
          <p className="font-bold text-sm truncate w-full text-foreground">
            {service.clients?.name ?? "Cliente"}
          </p>
          <p className="text-xs truncate w-full opacity-80 mt-0.5 font-medium">
            {service.service_type}
          </p>
          <p className="text-xs mt-auto opacity-70 flex items-center gap-1 font-medium">
             {currency(service.price)}
          </p>
        </div>
      }
    >
      <div className="flex flex-col h-full">
         <ServiceForm
           service={service}
           clients={clients}
           products={products}
           catalogServices={catalogServices}
         />
         <div className="mt-8 pt-6 border-t border-border-soft flex flex-col gap-3 sm:flex-row sm:flex-wrap">
             <LinkButton
               href={whatsappReminderLink(service)}
               target="_blank"
               rel="noreferrer"
               className="border-lilac/35 bg-lilac/10 text-foreground hover:border-lilac/60 hover:bg-surface-glow"
             >
               <MessageCircle size={16} />
               Lembrete via WhatsApp
             </LinkButton>
             {!isDone ? (
               <QuickActionForm
                 action={updateServiceStatusAction}
                 fields={{ id: service.id, status: "concluido" }}
                 label="Marcar como Concluído"
                 variant="primary"
               />
             ) : null}
             {!isCanceled ? (
               <QuickActionForm
                 action={updateServiceStatusAction}
                 fields={{ id: service.id, status: "cancelado" }}
                 label="Cancelar Horário"
                 variant="danger"
               />
             ) : null}
         </div>
      </div>
    </Sheet>
  );
}

function DailyTimeline({
  services,
  clients,
  products,
  catalogServices,
}: {
  services: ServiceRecord[];
  clients: Client[];
  products: Product[];
  catalogServices: ServiceCatalogItem[];
}) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const HOUR_HEIGHT = 90; // Pixels per hour

  return (
    <div className="premium-panel rounded-2xl overflow-hidden relative min-h-[600px] bg-background/50">
      <div className="absolute top-0 left-0 bottom-0 w-16 border-r border-border-soft bg-surface-soft/50 z-10" />
      
      <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>
        {/* Hour lines */}
        {hours.map((hour, index) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-border-soft/50 flex items-start"
            style={{ top: `${index * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
          >
            <span className="w-16 flex-shrink-0 text-center text-xs font-medium text-muted mt-2 relative z-20">
              {hour.toString().padStart(2, "0")}:00
            </span>
          </div>
        ))}

        {/* Service Blocks */}
        <div className="absolute top-0 left-16 right-0 bottom-0 px-2 sm:px-4 py-0 pointer-events-none">
          {services.map((service) => {
            const start = new Date(service.scheduled_at);
            const startHour = start.getHours() + start.getMinutes() / 60;
            
            // Only show if it's within our timeline
            if (startHour < START_HOUR || startHour >= END_HOUR) return null;

            const duration = service.duration_minutes || DEFAULT_DURATION;
            
            const top = (startHour - START_HOUR) * HOUR_HEIGHT;
            const height = (duration / 60) * HOUR_HEIGHT;

            return (
              <div
                key={service.id}
                className="absolute left-4 right-4 sm:left-6 sm:right-6 sm:w-2/3 max-w-lg pointer-events-auto z-20"
                style={{ top: `${top}px`, height: `${height - 4}px` }}
              >
                <ServiceCard
                  service={service}
                  clients={clients}
                  products={products}
                  catalogServices={catalogServices}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeeklyTimeline({
  currentDate,
  services,
  clients,
  products,
  catalogServices,
}: {
  currentDate: Date;
  services: ServiceRecord[];
  clients: Client[];
  products: Product[];
  catalogServices: ServiceCatalogItem[];
}) {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const HOUR_HEIGHT = 70; 

  return (
    <div className="premium-panel rounded-2xl overflow-x-auto relative bg-background/50">
      <div className="min-w-[800px]">
        {/* Days Header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border-soft sticky top-0 bg-surface-soft/90 backdrop-blur-md z-30">
          <div className="border-r border-border-soft" />
          {days.map(day => (
            <div key={day.toISOString()} className={`py-3 text-center border-r border-border-soft last:border-0 ${isToday(day) ? 'bg-lilac/10' : ''}`}>
              <p className="text-xs font-medium text-muted uppercase">{format(day, 'E', { locale: ptBR })}</p>
              <p className={`text-lg font-bold mt-0.5 ${isToday(day) ? 'text-lilac' : 'text-foreground'}`}>{format(day, 'd')}</p>
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>
          <div className="absolute top-0 left-0 bottom-0 w-[60px] border-r border-border-soft bg-surface-soft/50 z-20" />
          
          {/* Horizontal lines */}
          {hours.map((hour, index) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-border-soft/50"
              style={{ top: `${index * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute left-0 w-[60px] text-center text-xs font-medium text-muted mt-2 z-30">
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>
          ))}

          {/* Vertical columns */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] h-full absolute inset-0">
            <div /> {/* Time column spacing */}
            {days.map((day, dayIndex) => {
              const dayServices = services.filter(s => isSameDay(new Date(s.scheduled_at), day));
              
              return (
                <div key={dayIndex} className="relative border-r border-border-soft/50 last:border-0 h-full">
                  {dayServices.map(service => {
                    const start = new Date(service.scheduled_at);
                    const startHour = start.getHours() + start.getMinutes() / 60;
                    if (startHour < START_HOUR || startHour >= END_HOUR) return null;
                    
                    const duration = service.duration_minutes || DEFAULT_DURATION;
                    const top = (startHour - START_HOUR) * HOUR_HEIGHT;
                    const height = (duration / 60) * HOUR_HEIGHT;

                    return (
                      <div
                        key={service.id}
                        className="absolute left-1 right-1 pointer-events-auto z-20"
                        style={{ top: `${top}px`, height: `${height - 2}px` }}
                      >
                         <ServiceCard
                           service={service}
                           clients={clients}
                           products={products}
                           catalogServices={catalogServices}
                         />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyGrid({
  currentDate,
  services,
}: {
  currentDate: Date;
  services: ServiceRecord[];
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="premium-panel rounded-2xl overflow-hidden bg-background/50">
      <div className="grid grid-cols-7 border-b border-border-soft bg-surface-soft/50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold uppercase text-muted tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, i) => {
          const dayServices = services.filter((s) => isSameDay(new Date(s.scheduled_at), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border-r border-b border-border-soft/50 transition-colors hover:bg-surface-soft/30
                ${!isCurrentMonth ? "bg-surface-soft/10 opacity-40" : ""}
                ${i % 7 === 6 ? "border-r-0" : ""}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                 <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? "bg-lilac text-background" : "text-foreground"}`}>
                   {format(day, "d")}
                 </span>
                 {dayServices.length > 0 && (
                   <span className="text-xs text-muted font-medium bg-surface-raised px-1.5 py-0.5 rounded-md">
                     {dayServices.length}
                   </span>
                 )}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {dayServices.slice(0, 4).map(service => {
                  const isCanceled = service.status === "cancelado";
                  const dotColor = isCanceled ? "bg-danger" : service.status === "concluido" ? "bg-mint" : "bg-lilac";
                  return (
                    <Link
                       key={service.id}
                       href={`/agenda?visual=dia&data=${format(day, "yyyy-MM-dd")}`}
                       className="text-[10px] sm:text-xs truncate flex items-center gap-1.5 p-1 rounded hover:bg-surface-raised text-muted-strong hover:text-foreground transition-colors"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                      <span className="truncate">{format(new Date(service.scheduled_at), 'HH:mm')} {service.clients?.name}</span>
                    </Link>
                  )
                })}
                {dayServices.length > 4 && (
                  <Link href={`/agenda?visual=dia&data=${format(day, "yyyy-MM-dd")}`} className="text-[10px] text-lilac font-medium pl-2 hover:underline">
                    +{dayServices.length - 4} mais
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
