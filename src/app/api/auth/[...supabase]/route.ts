import { handleAuth } from '@supabase/auth-helpers-nextjs'

export const GET = handleAuth()
export const POST = handleAuth()
export const PUT = handleAuth()
export const DELETE = handleAuth()

export const PATCH = handleAuth()
