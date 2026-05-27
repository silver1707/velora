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

const optionalSlug = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}, z.string().min(3, "Use pelo menos 3 caracteres.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras, números e hífens.").nullable());

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
  before_photo_url: optionalUrl,
  after_photo_url: optionalUrl,
  status: z.enum(["agendado", "concluido", "cancelado", "pendente"]),
});

export const serviceCatalogSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Informe o nome do serviço."),
  price: requiredMoney,
  duration_minutes: z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return 60;
    }
    return Number(value);
  }, z.number().int().min(5, "Duração mínima de 5 minutos.").max(720, "Duração máxima de 12 horas.")),
  description: optionalText,
  is_active: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
});

export const profileSettingsSchema = z.object({
  full_name: optionalText,
  business_name: optionalText,
  business_headline: optionalText,
  business_bio: optionalText,
  specialties: optionalText,
  address_text: optionalText,
  instagram_url: optionalText,
  profile_photo_url: optionalUrl,
  cover_photo_url: optionalUrl,
  booking_intro: optionalText,
  booking_policy: optionalText,
  public_slug: optionalSlug,
  whatsapp_phone: optionalText,
  booking_enabled: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
});

export const publicBookingRequestSchema = z.object({
  professional_id: z.string().uuid("Profissional inválida."),
  slug: z.string().min(3),
  service_catalog_id: z.string().uuid("Escolha um serviço."),
  requested_start_at: z
    .string()
    .min(1, "Escolha um horário livre.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Horário inválido.",
    }),
  client_name: z.string().min(2, "Informe seu nome."),
  client_phone: z.string().min(8, "Informe um WhatsApp válido."),
  client_notes: optionalText,
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
