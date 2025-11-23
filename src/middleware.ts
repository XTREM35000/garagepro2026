import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const isDev = process.env.NODE_ENV !== 'production'
  // DEBUG: log cookies and session for troubleshooting auth redirect (dev only)
  if (isDev) {
    console.log('MIDDLEWARE DEBUG', {
      cookies: request.cookies.getAll(),
      pathname: request.nextUrl.pathname,
      env: process.env.NODE_ENV,
    })
  }

  // Skip middleware for static assets and Next internal routes to avoid
  // interfering with JS/CSS chunk responses (which can otherwise return HTML
  // and cause "Unexpected token '<'" in the browser).
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') || // don't intercept API routes (webhooks etc.)
    pathname.includes('.') // simple check for file extensions
  ) {
    return res
  }

  // Whitelist public frontend routes that must remain accessible without a session.
  // Important: Landing page (/) and the setup flows must never be blocked by middleware.
  const publicRoute =
    pathname === '/' ||
    pathname === '/auth' ||
    pathname.startsWith('/auth/setup') ||
    pathname.startsWith('/setup') ||
    pathname.startsWith('/api/setup')

  if (publicRoute) return res

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      // In production we should fail fast — misconfiguration is critical.
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in production')
    }
    // In development, warn and skip auth middleware so the app can still render.
    // eslint-disable-next-line no-console
    console.warn('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return res
  }

  const supabase = createMiddlewareClient({ req: request, res, supabaseUrl, supabaseKey: supabaseAnonKey } as any)

  const {
    data: { session },
  } = await supabase.auth.getSession()
  // DEBUG: log session after getSession
  console.log('MIDDLEWARE DEBUG session', { session });

  // In dev we allow easier local testing: do not redirect to /auth (prevents "redirect loop" when cookies
  // are not set). Keep strict auth behavior in production but still allow public routes.
  if (isDev) {
    return res
  }

  // Auth check - redirect to /auth if not authenticated and not on a public route
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Rediriger vers / si déjà connecté et sur /auth
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return res
}