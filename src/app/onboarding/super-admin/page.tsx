import React from 'react'
import { redirect } from 'next/navigation'
import SuperAdminClient from '../SuperAdminClient'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Page() {
  // Server-side check: if super admin already exists, skip to next step
  try {
    if (!supabaseAdmin) {
      console.warn('supabase admin client not configured; rendering onboarding form')
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <SuperAdminClient />
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
      console.error('onboarding super-admin check failed', superErr ?? tenantErr)
    } else {
      if (Array.isArray(superAdminRows) && superAdminRows.length > 0 && Array.isArray(tenantAdminRows) && tenantAdminRows.length > 0) {
        return redirect('/auth')
      }

      if (Array.isArray(superAdminRows) && superAdminRows.length > 0 && (!Array.isArray(tenantAdminRows) || tenantAdminRows.length === 0)) {
        return redirect('/onboarding/tenant-admin')
      }
    }
  } catch (err) {
    console.error('onboarding super-admin check failed', err)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <SuperAdminClient />
    </div>
  )
}
