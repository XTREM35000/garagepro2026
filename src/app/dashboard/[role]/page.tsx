"use client"
import React, { useState } from 'react'
import DashboardOverview from '@/components/dashboard/overview'

type Props = {
  params: { role: string }
}

export default function RoleDashboard({ params }: Props) {
  const { role } = params
  const [tenantId, setTenantId] = useState('demo')

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tableau de bord — {role}</h1>
        <div className="flex items-center gap-2">
          <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="border p-2" />
          <div className="text-sm text-gray-500">Tenant id (pour la démo)</div>
        </div>
      </div>

      <DashboardOverview tenantId={tenantId} role={role} />
    </section>
  )
}
