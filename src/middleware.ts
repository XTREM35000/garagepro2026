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

  console.log('[middleware] session present?', !!session, 'path=', pathname)

  // En DEV → pas de blocage
  if (isDev) return res;

  // --- AUTH PRODUCTION ---
  // Si pas de session → redirection vers /auth
  if (!session) {
    // Check for signed fallback cookie set by local-login API
    try {
      const cookie = request.cookies.get?.('saas_local_auth')?.value || null
      if (cookie) {
        console.log('[middleware] found saas_local_auth cookie — verifying')
        const parts = cookie.split('.')
        if (parts.length === 2) {
          const payloadStr = Buffer.from(parts[0], 'base64').toString('utf8')
          const signature = parts[1]
          const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
          if (secret) {
            const expected = require('crypto').createHmac('sha256', secret).update(payloadStr).digest('hex')
            if (expected === signature) {
              try {
                const payload = JSON.parse(payloadStr)
                const now = Math.floor(Date.now() / 1000)
                if (payload.exp && payload.exp > now) {
                  console.log('[middleware] saas_local_auth cookie valid — allowing request for user', payload.id)
                  return res
                } else {
                  console.log('[middleware] saas_local_auth cookie expired')
                }
              } catch (e) {
                console.warn('[middleware] failed parsing saas_local_auth payload', e)
              }
            } else {
              console.warn('[middleware] saas_local_auth invalid signature')
            }
          } else {
            console.warn('[middleware] no secret available to verify saas_local_auth')
          }
        } else {
          console.warn('[middleware] saas_local_auth cookie malformed')
        }
      }
    } catch (e) {
      console.error('[middleware] error while checking saas_local_auth cookie', e)
    }
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
