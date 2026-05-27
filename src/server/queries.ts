import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  paginated,
  normalizePage,
  sanitizeSearch,
  type PageInput,
} from "@/lib/pagination";
import { dayRange, monthRange } from "@/lib/utils";
import type {
  BookingRequest,
  Client,
  FinancialEntry,
  Product,
  ProfileSettings,
  PublicBookingProfile,
  ServiceCatalogItem,
  ServiceRecord,
} from "@/lib/types";

export async function requireSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function getClients(params?: {
  search?: string;
  hairType?: string;
}) {
  const { supabase } = await requireSession();
  const search = sanitizeSearch(params?.search);
  let query = supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,neighborhood.ilike.%${search}%`,
    );
  }

  if (params?.hairType) {
    query = query.eq("hair_type", params.hairType);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Client[];
}

export async function getClientsPage(
  params?: {
    search?: string;
    hairType?: string;
  } & PageInput,
) {
  const { supabase } = await requireSession();
  const { page, pageSize, from, to } = normalizePage(params);
  const search = sanitizeSearch(params?.search);
  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,neighborhood.ilike.%${search}%`,
    );
  }

  if (params?.hairType) {
    query = query.eq("hair_type", params.hairType);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw new Error(error.message);
  }

  return paginated<Client>({
    data: (data ?? []) as Client[],
    page,
    pageSize,
    total: count ?? 0,
  });
}

export async function getProfileSettings() {
  const { supabase } = await requireSession();
  const { data, error } = await supabase.from("profiles").select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProfileSettings;
}

export async function getServiceCatalog(params?: { includeInactive?: boolean }) {
  const { supabase } = await requireSession();
  let query = supabase
    .from("service_catalog")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  if (!params?.includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ServiceCatalogItem[];
}

export async function getClientById(id: string) {
  const { supabase } = await requireSession();
  const [{ data: client, error }, { data: services, error: serviceError }] =
    await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase
        .from("service_records")
        .select("*, service_products(*, products(*))")
        .eq("client_id", id)
        .order("scheduled_at", { ascending: false }),
    ]);

  if (error) {
    throw new Error(error.message);
  }
  if (serviceError) {
    throw new Error(serviceError.message);
  }

  return {
    client: client as Client,
    services: (services ?? []) as ServiceRecord[],
  };
}

export async function getBookingRequests(params?: { status?: string; limit?: number }) {
  const { supabase } = await requireSession();
  let query = supabase
    .from("booking_requests")
    .select("*, service_catalog(id, name, price, duration_minutes)")
    .order("requested_start_at", { ascending: true });

  if (params?.status) {
    query = query.eq("status", params.status);
  }
  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BookingRequest[];
}

export async function getPendingBookingRequestsCount() {
  const { supabase } = await requireSession();
  const { count, error } = await supabase
    .from("booking_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pendente");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getPublicBookingData(
  slug: string,
  params?: { date?: string; serviceId?: string },
) {
  const supabase = await createSupabaseServerClient();
  const { data: profileRows, error: profileError } = await supabase.rpc(
    "get_public_booking_profile",
    { p_slug: slug },
  );

  if (profileError) {
    throw new Error(profileError.message);
  }

  const profile = Array.isArray(profileRows)
    ? (profileRows[0] as PublicBookingProfile | undefined)
    : (profileRows as PublicBookingProfile | null);

  if (!profile) {
    return null;
  }

  const { data: services, error: servicesError } = await supabase
    .from("service_catalog")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (servicesError) {
    throw new Error(servicesError.message);
  }

  const catalog = (services ?? []) as ServiceCatalogItem[];
  const selectedService =
    catalog.find((service) => service.id === params?.serviceId) ?? catalog[0] ?? null;
  let slots: { starts_at: string }[] = [];

  if (selectedService && params?.date) {
    const { data: slotRows, error: slotsError } = await supabase.rpc(
      "get_public_available_slots",
      {
        p_slug: slug,
        p_date: params.date,
        p_duration_minutes: selectedService.duration_minutes,
      },
    );

    if (slotsError) {
      throw new Error(slotsError.message);
    }

    slots = (slotRows ?? []) as { starts_at: string }[];
  }

  return {
    profile,
    services: catalog,
    selectedService,
    slots,
  };
}

export async function getProducts(params?: { search?: string; low?: string }) {
  const { supabase } = await requireSession();
  const search = sanitizeSearch(params?.search);
  let query = supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const products = (data ?? []) as Product[];
  if (params?.low === "true") {
    return products.filter(
      (product) =>
        product.is_running_low ||
        Number(product.stock_quantity) <= Number(product.low_stock_threshold),
    );
  }

  return products;
}

export async function getProductsPage(
  params?: { search?: string; low?: string } & PageInput,
) {
  const { supabase } = await requireSession();
  const { page, pageSize, from, to } = normalizePage(params);
  const search = sanitizeSearch(params?.search);

  if (params?.low === "true") {
    const products = await getProducts({ search, low: "true" });
    return paginated<Product>({
      data: products.slice(from, to + 1),
      page,
      pageSize,
      total: products.length,
    });
  }

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("name", { ascending: true });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`,
    );
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    throw new Error(error.message);
  }

  return paginated<Product>({
    data: (data ?? []) as Product[],
    page,
    pageSize,
    total: count ?? 0,
  });
}

export async function getServiceRecords(params?: {
  status?: string;
  clientId?: string;
  from?: string;
  to?: string;
}) {
  const { supabase } = await requireSession();
  let query = supabase
    .from("service_records")
    .select("*, clients(id, name, phone, hair_type), service_products(*, products(*))")
    .order("scheduled_at", { ascending: false });

  if (params?.status) {
    query = query.eq("status", params.status);
  }
  if (params?.clientId) {
    query = query.eq("client_id", params.clientId);
  }
  if (params?.from) {
    query = query.gte("scheduled_at", params.from);
  }
  if (params?.to) {
    query = query.lt("scheduled_at", params.to);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ServiceRecord[];
}

export async function getServiceRecordsPage(
  params?: {
    status?: string;
    clientId?: string;
    from?: string;
    to?: string;
  } & PageInput,
) {
  const { supabase } = await requireSession();
  const { page, pageSize, from: rangeFrom, to: rangeTo } = normalizePage({
    page: params?.page,
    pageSize: params?.pageSize ?? 10,
  });
  let query = supabase
    .from("service_records")
    .select("*, clients(id, name, phone, hair_type), service_products(*, products(*))", {
      count: "exact",
    })
    .order("scheduled_at", { ascending: false });

  if (params?.status) {
    query = query.eq("status", params.status);
  }
  if (params?.clientId) {
    query = query.eq("client_id", params.clientId);
  }
  if (params?.from) {
    query = query.gte("scheduled_at", params.from);
  }
  if (params?.to) {
    query = query.lt("scheduled_at", params.to);
  }

  const { data, error, count } = await query.range(rangeFrom, rangeTo);
  if (error) {
    throw new Error(error.message);
  }

  return paginated<ServiceRecord>({
    data: (data ?? []) as ServiceRecord[],
    page,
    pageSize,
    total: count ?? 0,
  });
}

export async function getFinanceEntries(params?: { from?: string; to?: string }) {
  const { supabase } = await requireSession();
  let query = supabase
    .from("financial_entries")
    .select("*, clients(id, name), service_records(id, service_type)")
    .order("received_at", { ascending: false });

  if (params?.from) {
    query = query.gte("received_at", params.from);
  }
  if (params?.to) {
    query = query.lt("received_at", params.to);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FinancialEntry[];
}

export async function getFinanceEntriesPage(
  params?: { from?: string; to?: string } & PageInput,
) {
  const { supabase } = await requireSession();
  const { page, pageSize, from: rangeFrom, to: rangeTo } = normalizePage({
    page: params?.page,
    pageSize: params?.pageSize ?? 10,
  });
  let query = supabase
    .from("financial_entries")
    .select("*, clients(id, name), service_records(id, service_type)", {
      count: "exact",
    })
    .order("received_at", { ascending: false });

  if (params?.from) {
    query = query.gte("received_at", params.from);
  }
  if (params?.to) {
    query = query.lt("received_at", params.to);
  }

  const { data, error, count } = await query.range(rangeFrom, rangeTo);
  if (error) {
    throw new Error(error.message);
  }

  return paginated<FinancialEntry>({
    data: (data ?? []) as FinancialEntry[],
    page,
    pageSize,
    total: count ?? 0,
  });
}

export async function getDashboardData() {
  const { supabase } = await requireSession();
  const month = monthRange();
  const today = dayRange();
  const now = new Date().toISOString();

  const [
    clientsCount,
    monthServices,
    monthFinance,
    upcoming,
    todayAppointments,
    products,
    bookingRequests,
  ] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase
      .from("service_records")
      .select("*")
      .gte("scheduled_at", month.start)
      .lt("scheduled_at", month.end),
    supabase
      .from("financial_entries")
      .select("*")
      .gte("received_at", month.start)
      .lt("received_at", month.end),
    supabase
      .from("service_records")
      .select("*, clients(id, name, phone, hair_type)")
      .gte("scheduled_at", now)
      .neq("status", "cancelado")
      .order("scheduled_at", { ascending: true })
      .limit(5),
    supabase
      .from("service_records")
      .select("*, clients(id, name, phone, hair_type)")
      .gte("scheduled_at", today.start)
      .lt("scheduled_at", today.end)
      .neq("status", "cancelado")
      .order("scheduled_at", { ascending: true }),
    supabase.from("products").select("*").order("stock_quantity", { ascending: true }),
    supabase
      .from("booking_requests")
      .select("*, service_catalog(id, name, price, duration_minutes)")
      .eq("status", "pendente")
      .order("requested_start_at", { ascending: true })
      .limit(6),
  ]);

  if (clientsCount.error) throw new Error(clientsCount.error.message);
  if (monthServices.error) throw new Error(monthServices.error.message);
  if (monthFinance.error) throw new Error(monthFinance.error.message);
  if (upcoming.error) throw new Error(upcoming.error.message);
  if (todayAppointments.error) throw new Error(todayAppointments.error.message);
  if (products.error) throw new Error(products.error.message);
  if (bookingRequests.error) throw new Error(bookingRequests.error.message);

  const services = (monthServices.data ?? []) as ServiceRecord[];
  const finance = (monthFinance.data ?? []) as FinancialEntry[];
  const lowStock = ((products.data ?? []) as Product[]).filter(
    (product) =>
      product.is_running_low ||
      Number(product.stock_quantity) <= Number(product.low_stock_threshold),
  );

  const servicesByType = Object.entries(
    services.reduce<Record<string, number>>((acc, service) => {
      acc[service.service_type] = (acc[service.service_type] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    clientsCount: clientsCount.count ?? 0,
    monthServices: services,
    monthRevenue: finance.reduce(
      (sum, entry) => sum + Number(entry.amount ?? 0),
      0,
    ),
    upcoming: (upcoming.data ?? []) as ServiceRecord[],
    todayAppointments: (todayAppointments.data ?? []) as ServiceRecord[],
    bookingRequests: (bookingRequests.data ?? []) as BookingRequest[],
    servicesByType,
    lowStock: lowStock.slice(0, 6),
  };
}
