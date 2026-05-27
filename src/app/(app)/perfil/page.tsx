import { ExternalLink, Settings } from "lucide-react";
import { ProfileSettingsForm } from "@/components/forms/profile-settings-form";
import { PageHeader } from "@/components/layout/page-header";
import { LinkButton } from "@/components/ui/button";
import { env } from "@/lib/env";
import { getProfileSettings } from "@/server/queries";

export default async function ProfilePage() {
  const profile = await getProfileSettings();
  const bookingUrl = profile.public_slug
    ? `${env.appUrl}/${profile.public_slug}`
    : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Agenda online"
        title="Perfil"
        description="Personalize seu link de agendamento, fotos, bio, contatos e regras que as clientes veem antes de pedir horario."
        action={
          bookingUrl && profile.booking_enabled ? (
            <LinkButton href={bookingUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Ver link publico
            </LinkButton>
          ) : null
        }
      />

      <section className="premium-panel max-w-4xl rounded-lg p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="brand-tile flex h-10 w-10 items-center justify-center rounded-lg text-lilac">
            <Settings size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Perfil e link publico
            </h2>
            <p className="text-sm text-muted">
              Esses dados deixam sua pagina de agendamento mais completa e confiavel.
            </p>
          </div>
        </div>
        <ProfileSettingsForm profile={profile} bookingUrl={bookingUrl} />
      </section>
    </>
  );
}
