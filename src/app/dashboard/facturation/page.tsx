import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function FacturationPage() {
  const columns = ["N° facture", "Client", "Total", "Statut"];
  const data = [
    ["INV-2025-001", "M. Kouadio", "120 000 FCFA", "BROUILLON"],
    ["INV-2025-002", "Mme Diarra", "45 000 FCFA", "PAYEE"],
    ["INV-2025-003", "Société X", "350 000 FCFA", "ANNULEE"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Factures en cours" value="14" icon="FileText" />
        <MetricsCard title="Revenu (mois)" value="1 250 000 FCFA" icon="DollarSign" />
        <MetricsCard title="Paiements en attente" value="3" icon="CreditCard" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Factures récentes</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
