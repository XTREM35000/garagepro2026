import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

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

  // Auth check - rediriger vers /auth si non connecté
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Rediriger vers / si déjà connecté et sur /auth
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return res
}