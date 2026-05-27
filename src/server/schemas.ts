import { z } from "zod";
import { appointmentStatuses, paymentMethods, serviceTypes } from "@/lib/constants";

const optionalText = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().nullable(),
);

const optionalDate = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().nullable(),
);

const optionalUrl = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().url("Informe uma URL válida.").nullable(),
);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }
  return Number(value);
}, z.number().finite().nullable());

const requiredMoney = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return 0;
  }
  return Number(value);
}, z.number().min(0, "O valor não pode ser negativo."));

export const idSchema = z.object({
  id: z.string().uuid("ID inválido."),
});

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Informe o nome da cliente."),
  age: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return null;
    }
    return Number(value);
  }, z.number().int().min(0).max(120).nullable()),
  phone: optionalText,
  address: optionalText,
  neighborhood: optionalText,
  notes: optionalText,
  birth_date: optionalDate,
  preferences: optionalText,
  allergies: optionalText,
  hair_type: optionalText,
  favorite_products: optionalText,
  chemical_history: optionalText,
  service_frequency: optionalText,
  before_photo_url: optionalUrl,
  after_photo_url: optionalUrl,
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Informe o nome do produto."),
  brand: optionalText,
  category: optionalText,
  stock_quantity: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return 0;
    }
    return Number(value);
  }, z.number().min(0, "O estoque não pode ser negativo.")),
  low_stock_threshold: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return 1;
    }
    return Number(value);
  }, z.number().min(0, "O alerta não pode ser negativo.")),
  cost: optionalNumber,
  notes: optionalText,
  is_running_low: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
});

export const serviceRecordSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid("Escolha uma cliente."),
  service_type: z
    .string()
    .min(2, "Escolha um serviço.")
    .refine((value) => serviceTypes.includes(value) || value.length > 2, {
      message: "Serviço inválido.",
    }),
  scheduled_at: z.string().min(1, "Informe data e horário."),
  price: requiredMoney,
  payment_method: z
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .refine((value) => value === null || paymentMethods.includes(value), {
      message: "Forma de pagamento inválida.",
    }),
  notes: optionalText,
  duration_minutes: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return 60;
    }
    return Number(value);
  }, z.number().int().min(5).max(720).nullable()),
  status: z.enum(["agendado", "concluido", "cancelado", "pendente"]),
});

export const statusUpdateSchema = z.object({
  id: z.string().uuid("ID inválido."),
  status: z.enum(appointmentStatuses.map((item) => item.value) as [
    "agendado",
    "concluido",
    "cancelado",
    "pendente",
  ]),
});

export const financeEntrySchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.string().uuid().nullable(),
  ),
  service_record_id: z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.string().uuid().nullable(),
  ),
  amount: requiredMoney,
  payment_method: z
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  received_at: z.string().min(1, "Informe a data de recebimento."),
  notes: optionalText,
});

export function formObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function validationError(error: z.ZodError): {
  ok: false;
  message: string;
  errors: Record<string, string[] | undefined>;
} {
  return {
    ok: false,
    message: "Revise os campos destacados.",
    errors: error.flatten().fieldErrors,
  };
}
