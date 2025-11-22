import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function CaissePage() {
  const columns = ["Date", "Type", "Montant", "Par"];
  const data = [
    ["2025-11-20", "Encaissement", "25 000 FCFA", "Cabinet A"],
    ["2025-11-19", "Sortie", "5 000 FCFA", "Fournisseur B"],
    ["2025-11-18", "Encaissement", "12 000 FCFA", "Client C"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Solde caisse" value="1 250 000 FCFA" icon="Wallet" />
        <MetricsCard title="Encaissements (30j)" value="320 000 FCFA" icon="CreditCard" />
        <MetricsCard title="Dépenses (30j)" value="85 000 FCFA" icon="DollarSign" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Mouvements récents</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
