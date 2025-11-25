import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.warn('SUPABASE URL not configured (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL)')
}

export const supabase = ((): SupabaseClient | null => {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null
  return createClient(SUPABASE_URL, SUPABASE_ANON)
})()

// Admin client for server-side operations (service_role)
export const supabaseAdmin = ((): SupabaseClient | null => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) return null
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
    global: { fetch },
  })
})()

export default supabase
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Client Supabase avec clé publique
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // important pour SSR/Next.js
    },
  }
)

// Client admin avec clé service (pour les webhooks)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
  : null