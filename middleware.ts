import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env, hasSupabaseConfig } from "@/lib/env";

const publicRoutes = [
  "/login",
  "/cadastro",
  "/auth/callback",
  "/recursos",
  "/sobre",
  "/precos",
  "/termos",
  "/privacidade",
  "/robots.txt",
  "/sitemap.xml",
  "/api/booking-requests/summary",
];

const protectedRoutes = [
  "/dashboard",
  "/clientes",
  "/agenda",
  "/pedidos",
  "/atendimentos",
  "/servicos",
  "/produtos",
  "/financeiro",
  "/perfil",
  "/ajustes",
];

function isPublicBookingSlug(path: string) {
  const segments = path.split("/").filter(Boolean);
  if (segments.length !== 1) {
    return false;
  }

  return !protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  let hasUser = false;

  if (hasSupabaseConfig) {
    const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasUser = Boolean(user);
  }

  const path = request.nextUrl.pathname;
  const isPublic =
    publicRoutes.some((route) => path.startsWith(route)) ||
    isPublicBookingSlug(path);

  if (!hasUser && !isPublic && path !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (hasUser && (path === "/login" || path === "/cadastro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
