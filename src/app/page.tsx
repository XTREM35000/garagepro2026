export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import LandingPage from './landing/LandingPage'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'

export default async function Page() {
  // Vérifier la session côté serveur et rediriger vers /dashboard si connecté
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      redirect('/dashboard')
    }
  } catch (err) {
    console.warn('Server session check failed:', err)
  }

  // Server-side check of setup state via Supabase admin client
  try {
    if (!supabaseAdmin) {
      console.warn('supabase admin client not configured; rendering landing without setup state')
      return <LandingPage />
    }

    const [{ data: superAdminRows, error: superErr }, { data: tenantAdminRows, error: tenantErr }] = await Promise.all([
      supabaseAdmin.from('User').select('id').eq('role', 'SUPER_ADMIN').limit(1),
      supabaseAdmin.from('User').select('id').eq('role', 'TENANT_ADMIN').limit(1),
    ] as any)

    if (superErr || tenantErr) {
      console.error('Failed to read setup state:', superErr ?? tenantErr)
      return <LandingPage />
    }

    const initialSetupState = {
      superAdminExists: Array.isArray(superAdminRows) && superAdminRows.length > 0,
      tenantAdminExists: Array.isArray(tenantAdminRows) && tenantAdminRows.length > 0,
    }

    return <LandingPage initialSetupState={initialSetupState} />
  } catch (err) {
    console.error('Failed to read setup state:', err)
    return <LandingPage />
  }
}
