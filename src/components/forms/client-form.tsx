"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { hairTypes, serviceFrequencies } from "@/lib/constants";
import { initialActionState, type ActionState, type Client } from "@/lib/types";
import { createClientAction, updateClientAction } from "@/server/actions/clients";

export function ClientForm({ client }: { client?: Client }) {
  const action = client ? updateClientAction : createClientAction;
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      {client ? <input type="hidden" name="id" value={client.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" error={state.errors?.name?.[0]}>
          <Input name="name" required defaultValue={client?.name ?? ""} />
        </Field>
        <Field label="Telefone">
          <Input name="phone" defaultValue={client?.phone ?? ""} placeholder="(00) 00000-0000" />
        </Field>
        <Field label="Idade">
          <Input name="age" type="number" min={0} max={120} defaultValue={client?.age ?? ""} />
        </Field>
        <Field label="Data de nascimento">
          <Input name="birth_date" type="date" defaultValue={client?.birth_date ?? ""} />
        </Field>
        <Field label="Endereço">
          <Input name="address" defaultValue={client?.address ?? ""} />
        </Field>
        <Field label="Bairro">
          <Input name="neighborhood" defaultValue={client?.neighborhood ?? ""} />
        </Field>
        <Field label="Tipo de cabelo">
          <Select name="hair_type" defaultValue={client?.hair_type ?? ""}>
            <option value="">Selecionar</option>
            {hairTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </Select>
        </Field>
        <Field label="Frequência de atendimento">
          <Select name="service_frequency" defaultValue={client?.service_frequency ?? ""}>
            <option value="">Selecionar</option>
            {serviceFrequencies.map((frequency) => (
              <option key={frequency}>{frequency}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Preferências">
        <Textarea
          name="preferences"
          defaultValue={client?.preferences ?? ""}
          placeholder="Horários, estilo preferido, marcas favoritas..."
        />
      </Field>
      <Field label="Alergias">
        <Textarea name="allergies" defaultValue={client?.allergies ?? ""} />
      </Field>
      <Field label="Produtos que costuma usar">
        <Textarea
          name="favorite_products"
          defaultValue={client?.favorite_products ?? ""}
        />
      </Field>
      <Field label="Histórico químico">
        <Textarea
          name="chemical_history"
          defaultValue={client?.chemical_history ?? ""}
          placeholder="Progressivas, colorações, luzes, incompatibilidades..."
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoUploader
          name="before_photo_url"
          label="Foto antes"
          initialValue={client?.before_photo_url}
        />
        <PhotoUploader
          name="after_photo_url"
          label="Foto depois"
          initialValue={client?.after_photo_url}
        />
      </div>
      <Field label="Observações">
        <Textarea name="notes" defaultValue={client?.notes ?? ""} />
      </Field>

      {state.errors?.before_photo_url?.[0] || state.errors?.after_photo_url?.[0] ? (
        <p className="text-xs text-danger">
          {state.errors.before_photo_url?.[0] ?? state.errors.after_photo_url?.[0]}
        </p>
      ) : null}
      <ActionMessage state={state} />
      <SubmitButton>{client ? "Salvar alterações" : "Cadastrar cliente"}</SubmitButton>
    </form>
  );
}
