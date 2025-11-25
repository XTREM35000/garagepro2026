import React from 'react'
import { redirect } from 'next/navigation'
import TenantAdminClient from '../TenantAdminClient'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Page() {
  try {
    if (!supabaseAdmin) {
      console.warn('supabase admin client not configured; allow onboarding flow')
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <TenantAdminClient />
        </div>
      )
    }

    const { data: superAdminRows, error: superErr } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('role', 'SUPER_ADMIN')
      .limit(1)

    const { data: tenantAdminRows, error: tenantErr } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('role', 'TENANT_ADMIN')
      .limit(1)

    if (superErr || tenantErr) {
      console.error('onboarding tenant-admin check failed', superErr ?? tenantErr)
    } else {
      // If no super admin, send back to root landing
      if (!Array.isArray(superAdminRows) || superAdminRows.length === 0) return redirect('/')

      // If tenant admin already exists, move to auth
      if (Array.isArray(tenantAdminRows) && tenantAdminRows.length > 0) return redirect('/auth')
    }
  } catch (err) {
    console.error('onboarding tenant-admin check failed', err)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <TenantAdminClient />
    </div>
  )
}
