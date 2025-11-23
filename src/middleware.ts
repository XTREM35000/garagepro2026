import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  const isDev = process.env.NODE_ENV !== "production";

  // --- IGNORER les assets internes ---
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return res;
  }

  // --- ROUTES PUBLICS COMPLETES ---
  // Landing + Auth + Setup + Onboarding sont TOUJOURS publics
  const PUBLIC_ROUTES = [
    "/",
    "/auth",
    "/auth/setup",
    "/setup",
    "/onboarding",
    "/api/setup",
  ];

  const isPublic =
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublic) return res;

  // --- ENV Supabase ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase env vars");
    return res;
  }

  // --- SESSION ---
  const supabase = createMiddlewareClient({
    req: request,
    res,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  } as any);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // En DEV → pas de blocage
  if (isDev) return res;

  // --- AUTH PRODUCTION ---
  // Si pas de session → redirection vers /auth
  if (!session) {
    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  // Si session et route = /auth → rediriger vers dashboard home
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
  ],
};
