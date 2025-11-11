"use client"
import React from 'react'
import Link from 'next/link'

const roles = ['super_admin', 'admin', 'agent_photo', 'caissier', 'comptable', 'technicien', 'viewer']

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="font-bold">Mon SaaS</h2>
        <p className="text-sm text-gray-500">Tenant: Demo</p>
      </div>

      <nav className="p-4 space-y-2">
        <Link href="/dashboard/super_admin" className="block text-sm font-medium">Accueil</Link>
        <div className="mt-4 text-xs text-gray-500">Dashboards par rôle</div>
        {roles.map(r => (
          <Link key={r} href={`/dashboard/${r}`} className="block text-sm text-sky-600">{r}</Link>
        ))}

        <div className="mt-6">
          <Link href="/tenant/settings" className="text-sm text-gray-700">Paramètres du tenant</Link>
        </div>
      </nav>
    </aside>
  )
}
