import React from 'react'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import TenantAdminClient from '../TenantAdminClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Page() {
  try {
    const superAdmin = await prisma.user.findFirst({ where: { role: UserRole.SUPER_ADMIN } })
    const tenantAdmin = await prisma.user.findFirst({ where: { role: UserRole.TENANT_ADMIN } })

    // If no super admin, send back to root landing
    if (!superAdmin) return redirect('/')

    // If tenant admin already exists, move to auth
    if (tenantAdmin) return redirect('/auth')
  } catch (err) {
    console.error('onboarding tenant-admin check failed', err)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <TenantAdminClient />
    </div>
  )
}
