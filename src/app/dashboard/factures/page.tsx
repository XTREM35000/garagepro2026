import MetricsCard from '@/components/dashboard/MetricsCard'
import Card3D from '@/components/ui/Card3D'

export default function FacturesPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Facturation</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricsCard title="Factures ouvertes" value={14} icon="CreditCard" />
        <MetricsCard title="Reçus (30j)" value="9 120 FCFA" icon="Calendar" />
        <MetricsCard title="En retard" value={2} icon="CreditCard" />
      </div>

      <Card3D>
        <h3 className="text-lg font-semibold mb-2">Résumé facturation</h3>
        <p className="text-sm text-gray-600">Vue des paiements et relances.</p>
      </Card3D>
    </section>
  );
}
