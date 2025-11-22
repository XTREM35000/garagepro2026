"use client"

import MetricsCard from '@/components/dashboard/MetricsCard'
import Card3D from '@/components/ui/Card3D'

export default function DashboardHome() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricsCard title="Nouveaux clients" value={24} icon="Users" />
        <MetricsCard title="CA (30j)" value="12 340 FCFA" icon="DollarSign" />
        <MetricsCard title="Interventions" value={8} icon="Activity" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card3D>
          <h3 className="text-lg font-semibold mb-2">Vue synthétique</h3>
          <p className="text-sm text-gray-600">Chiffres clés et actions rapides.</p>
        </Card3D>

        <Card3D>
          <h3 className="text-lg font-semibold mb-2">Actions récentes</h3>
          <p className="text-sm text-gray-600">Dernières interventions et factures.</p>
        </Card3D>
      </div>
    </section>
  )
}
