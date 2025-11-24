import React from 'react'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import SuperAdminClient from '../SuperAdminClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Page() {
  // Server-side check: if super admin already exists, skip to next step
  try {
    const superAdmin = await prisma.user.findFirst({ where: { role: UserRole.SUPER_ADMIN } })
    const tenantAdmin = await prisma.user.findFirst({ where: { role: UserRole.TENANT_ADMIN } })

    if (superAdmin && tenantAdmin) {
      return redirect('/auth')
    }

    if (superAdmin && !tenantAdmin) {
      // If super admin exists already, redirect to tenant onboarding
      return redirect('/onboarding/tenant-admin')
    }
  } catch (err) {
    // ignore and render client form which will fallback to API
    console.error('onboarding super-admin check failed', err)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <SuperAdminClient />
    </div>
  )
}
