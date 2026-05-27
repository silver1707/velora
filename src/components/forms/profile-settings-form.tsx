"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { initialActionState, type ActionState, type ProfileSettings } from "@/lib/types";
import { updateProfileSettingsAction } from "@/server/actions/settings";

export function ProfileSettingsForm({
  profile,
  bookingUrl,
}: {
  profile: ProfileSettings;
  bookingUrl?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateProfileSettingsAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div className="surface-row rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Identidade visual</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            Essas imagens aparecem no topo da sua página pública de agendamento.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PhotoUploader
            name="profile_photo_url"
            label="Foto ou logo"
            initialValue={profile.profile_photo_url}
          />
          <PhotoUploader
            name="cover_photo_url"
            label="Foto de capa"
            initialValue={profile.cover_photo_url}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome">
          <Input name="full_name" defaultValue={profile.full_name ?? ""} />
        </Field>
        <Field label="Nome do salão">
          <Input name="business_name" defaultValue={profile.business_name ?? ""} />
        </Field>
        <Field label="Chamada da página">
          <Input
            name="business_headline"
            defaultValue={profile.business_headline ?? ""}
            placeholder="Coloração, corte e tratamentos com hora marcada"
          />
        </Field>
        <Field label="WhatsApp profissional">
          <Input
            name="whatsapp_phone"
            defaultValue={profile.whatsapp_phone ?? ""}
            placeholder="(11) 99999-9999"
          />
        </Field>
        <Field
          label="Link público"
          hint={bookingUrl ? bookingUrl : "Exemplo: salao-da-maria"}
        >
          <Input
            name="public_slug"
            defaultValue={profile.public_slug ?? ""}
            placeholder="salao-da-maria"
          />
        </Field>
        <Field label="Instagram">
          <Input
            name="instagram_url"
            defaultValue={profile.instagram_url ?? ""}
            placeholder="@seusalao ou https://instagram.com/seusalao"
          />
        </Field>
      </div>

      <Field label="Bio da página">
        <Textarea
          name="business_bio"
          defaultValue={profile.business_bio ?? ""}
          placeholder="Conte seu estilo de atendimento, especialidades e o que a cliente pode esperar."
        />
      </Field>
      <Field label="Especialidades">
        <Textarea
          name="specialties"
          defaultValue={profile.specialties ?? ""}
          placeholder="Ex: Loiros, cortes femininos, cronograma capilar, noivas"
          className="min-h-24"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Endereço ou região">
          <Input
            name="address_text"
            defaultValue={profile.address_text ?? ""}
            placeholder="Bairro, cidade ou endereço do salão"
          />
        </Field>
        <Field label="Mensagem da agenda">
          <Input
            name="booking_intro"
            defaultValue={profile.booking_intro ?? ""}
            placeholder="Escolha um horário e envie seu pedido"
          />
        </Field>
      </div>

      <Field label="Aviso antes de agendar">
        <Textarea
          name="booking_policy"
          defaultValue={profile.booking_policy ?? ""}
          placeholder="Ex: pedidos serão confirmados pelo WhatsApp; chegue com 10 minutos de antecedência."
          className="min-h-24"
        />
      </Field>

      <label className="surface-row flex items-start gap-3 rounded-lg p-4 text-sm">
        <input type="hidden" name="booking_enabled" value="false" />
        <input
          type="checkbox"
          name="booking_enabled"
          defaultChecked={profile.booking_enabled}
          className="mt-1 h-4 w-4 accent-lilac-strong"
        />
        <span>
          <span className="block font-semibold text-foreground">
            Ativar agendamento online
          </span>
          <span className="mt-1 block leading-5 text-muted">
            Clientes poderão escolher horários livres pelo seu link e enviar pedidos
            para aprovação no dashboard.
          </span>
        </span>
      </label>

      <ActionMessage state={state} />
      <SubmitButton>Salvar ajustes</SubmitButton>
    </form>
  );
}
