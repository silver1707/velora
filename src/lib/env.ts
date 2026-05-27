export const env = {
  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "0000000000000000000000000000000000000000",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  storageBucket:
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "client-photos",
};

export const hasSupabaseConfig =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
