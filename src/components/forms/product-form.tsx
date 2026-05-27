"use client";

import { useActionState } from "react";
import { ActionMessage } from "@/components/forms/action-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { productCategories } from "@/lib/constants";
import { initialActionState, type ActionState, type Product } from "@/lib/types";
import {
  createProductAction,
  updateProductAction,
} from "@/server/actions/products";

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? updateProductAction : createProductAction;
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    initialActionState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" error={state.errors?.name?.[0]}>
          <Input name="name" required defaultValue={product?.name ?? ""} />
        </Field>
        <Field label="Marca">
          <Input name="brand" defaultValue={product?.brand ?? ""} />
        </Field>
        <Field label="Categoria">
          <Select name="category" defaultValue={product?.category ?? ""}>
            <option value="">Selecionar</option>
            {productCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </Select>
        </Field>
        <Field label="Custo">
          <Input
            name="cost"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.cost ?? ""}
          />
        </Field>
        <Field label="Quantidade em estoque">
          <Input
            name="stock_quantity"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.stock_quantity ?? 0}
          />
        </Field>
        <Field label="Alerta abaixo de">
          <Input
            name="low_stock_threshold"
            type="number"
            min={0}
            step="0.01"
            defaultValue={product?.low_stock_threshold ?? 1}
          />
        </Field>
      </div>
      <label className="surface-row flex items-center gap-3 rounded-lg p-3 text-sm text-muted">
        <input
          name="is_running_low"
          type="checkbox"
          defaultChecked={product?.is_running_low ?? false}
          className="h-4 w-4 accent-lilac-strong"
        />
        Marcar manualmente como acabando
      </label>
      <Field label="Observações">
        <Textarea name="notes" defaultValue={product?.notes ?? ""} />
      </Field>
      <ActionMessage state={state} />
      <SubmitButton>{product ? "Salvar produto" : "Cadastrar produto"}</SubmitButton>
    </form>
  );
}
