import { NextResponse } from 'next/server'

// The package `@supabase/auth-helpers-nextjs` in this environment
// may not export `handleAuth`. Provide minimal route handlers
// to avoid build-time errors. Adjust if you need full Supabase
// auth handling here.

export const GET = () => NextResponse.json({ ok: true })
export const POST = () => NextResponse.json({ ok: true })
export const PUT = () => NextResponse.json({ ok: true })
export const DELETE = () => NextResponse.json({ ok: true })
export const PATCH = () => NextResponse.json({ ok: true })
