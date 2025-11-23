export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import LandingPage from './landing/LandingPage'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

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

  // Server-side check of setup state (always server-side using Prisma)
  try {
    const superAdmin = await prisma.user.findFirst({ where: { role: 'super_admin' } })
    const tenantAdmin = await prisma.user.findFirst({ where: { role: 'admin' } })

    const initialSetupState = {
      superAdminExists: !!superAdmin,
      tenantAdminExists: !!tenantAdmin,
    }

    return <LandingPage initialSetupState={initialSetupState} />
  } catch (err) {
    // If DB check fails, render landing but allow client-side to re-check
    console.error('Failed to read setup state:', err)
    return <LandingPage />
  }
}
