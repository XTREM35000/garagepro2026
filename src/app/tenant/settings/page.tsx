import React from 'react'
import TenantSettings from '@/components/tenant/tenant-settings'

export const metadata = { title: 'Paramètres du tenant' }

export default function TenantSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Paramètres du tenant</h1>
      <div className="max-w-2xl">
        {/* client component handles data fetching/updating */}
        <TenantSettings />
      </div>
    </div>
  )
}
