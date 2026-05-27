import {
  AtSign,
  CalendarCheck2,
  Clock3,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicBookingForm } from "@/components/forms/public-booking-form";
import { MarketingShell } from "@/components/marketing/marketing-layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { currency } from "@/lib/utils";
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

function listFromText(value?: string | null) {
  return (value ?? "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function whatsappLink(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  const normalized = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

function instagramLink(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
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

  const profile = data.profile;
  const displayName =
    profile.business_name ?? profile.full_name ?? "Agenda Velora";
  const headline =
    profile.business_headline ??
    "Atendimento de beleza com horário marcado e confirmação pelo Velora.";
  const specialties = listFromText(profile.specialties);
  const whatsappHref = whatsappLink(profile.whatsapp_phone);
  const instagramHref = instagramLink(profile.instagram_url);
  const lowestPrice = data.services.length
    ? Math.min(...data.services.map((service) => Number(service.price ?? 0)))
    : null;

  return (
    <MarketingShell>
      <main className="pb-20 pt-20">
        <section className="px-3 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="premium-panel overflow-hidden rounded-lg">
              <div className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[520px]">
                {profile.cover_photo_url ? (
                  <Image
                    src={profile.cover_photo_url}
                    alt={`Capa de ${displayName}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--lilac-deep)_38%,var(--surface)),color-mix(in_srgb,var(--surface-glow)_88%,var(--background))_52%,var(--surface))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/72 to-background/20" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-lilac/25 bg-surface shadow-2xl sm:h-28 sm:w-28">
                          {profile.profile_photo_url ? (
                            <Image
                              src={profile.profile_photo_url}
                              alt={`Foto de ${displayName}`}
                              fill
                              sizes="112px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="brand-tile flex h-full w-full items-center justify-center rounded-2xl text-lilac">
                              <Scissors size={34} />
                            </div>
                          )}
                        </div>
                        <div>
                          <Badge className="border-lilac/30 bg-lilac/10 text-lilac">
                            Agenda online
                          </Badge>
                          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
                            {displayName}
                          </h1>
                        </div>
                      </div>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                        {headline}
                      </p>
                      {specialties.length ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="rounded-lg border border-lilac/20 bg-background/40 px-3 py-1.5 text-xs font-semibold text-lilac"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                      <div className="surface-row rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase text-muted-strong">
                          Serviços
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-foreground">
                          {data.services.length || "0"}
                        </p>
                      </div>
                      <div className="surface-row rounded-lg p-4">
                        <p className="text-xs font-semibold uppercase text-muted-strong">
                          A partir de
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-foreground">
                          {lowestPrice !== null ? currency(lowestPrice) : "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-3 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="grid gap-6">
            <article className="premium-panel rounded-lg p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="brand-tile flex h-10 w-10 items-center justify-center rounded-lg text-lilac">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Sobre o atendimento
                  </h2>
                  <p className="text-sm text-muted">Conheça o estilo da profissional.</p>
                </div>
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted">
                {profile.business_bio ||
                  "Agende seu horário online e aguarde a confirmação da profissional pelo Velora."}
              </p>

              <div className="mt-5 grid gap-3 text-sm">
                {profile.address_text ? (
                  <div className="surface-row flex items-start gap-3 rounded-lg p-3">
                    <MapPin size={17} className="mt-0.5 text-lilac" />
                    <span className="leading-6 text-muted">{profile.address_text}</span>
                  </div>
                ) : null}
                <div className="surface-row flex items-start gap-3 rounded-lg p-3">
                  <CalendarCheck2 size={17} className="mt-0.5 text-lilac" />
                  <span className="leading-6 text-muted">
                    O pedido cai direto no Velora para confirmação da profissional.
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {whatsappHref ? (
                  <LinkButton href={whatsappHref} target="_blank" rel="noreferrer">
                    <MessageCircle size={16} />
                    WhatsApp
                  </LinkButton>
                ) : null}
                {instagramHref ? (
                  <LinkButton
                    href={instagramHref}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                  >
                    <AtSign size={16} />
                    Instagram
                  </LinkButton>
                ) : null}
              </div>
            </article>

            <article className="premium-panel rounded-lg p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Serviços</h2>
                  <p className="text-sm text-muted">
                    Escolha um serviço no painel de agendamento.
                  </p>
                </div>
                <Star size={18} className="text-lilac" />
              </div>
              {data.services.length ? (
                <div className="grid gap-3">
                  {data.services.slice(0, 5).map((service) => (
                    <div key={service.id} className="surface-row rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          {service.description ? (
                            <p className="mt-1 text-sm leading-6 text-muted">
                              {service.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-foreground">
                            {currency(service.price)}
                          </p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                            <Clock3 size={12} />
                            {service.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted">
                  Os serviços serão exibidos aqui assim que a profissional publicar a tabela.
                </p>
              )}
            </article>
          </div>

          <section className="premium-panel rounded-lg p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <PublicBookingForm
              profile={profile}
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
