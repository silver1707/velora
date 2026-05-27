export type AppointmentStatus =
  | "agendado"
  | "concluido"
  | "cancelado"
  | "pendente";

export type Client = {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  phone: string | null;
  address: string | null;
  neighborhood: string | null;
  notes: string | null;
  birth_date: string | null;
  preferences: string | null;
  allergies: string | null;
  hair_type: string | null;
  favorite_products: string | null;
  chemical_history: string | null;
  service_frequency: string | null;
  before_photo_url: string | null;
  after_photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  cost: number | null;
  notes: string | null;
  is_running_low: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceProduct = {
  id: string;
  service_record_id: string;
  product_id: string;
  quantity_used: number;
  notes: string | null;
  products?: Product | null;
};

export type ServiceRecord = {
  id: string;
  user_id: string;
  client_id: string;
  service_type: string;
  scheduled_at: string;
  price: number;
  payment_method: string | null;
  notes: string | null;
  duration_minutes: number | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  clients?: Pick<Client, "id" | "name" | "phone" | "hair_type"> | null;
  service_products?: ServiceProduct[];
};

export type FinancialEntry = {
  id: string;
  user_id: string;
  service_record_id: string | null;
  client_id: string | null;
  amount: number;
  payment_method: string | null;
  received_at: string;
  notes: string | null;
  created_at: string;
  clients?: Pick<Client, "id" | "name"> | null;
  service_records?: Pick<ServiceRecord, "id" | "service_type"> | null;
};

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialActionState: ActionState = {
  ok: false,
  message: "",
};
