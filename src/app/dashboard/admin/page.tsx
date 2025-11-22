import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function AdminPage() {
  const columns = ["Clé", "Valeur", "Description"];
  const data = [
    ["plan", "Pro", "Plan actif par défaut"],
    ["rls", "activé", "Row Level Security"],
    ["stripe", "connecté", "Paiements actifs"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Config clés" value="12" icon="Settings" />
        <MetricsCard title="DB size" value="15 GB" icon="Database" />
        <MetricsCard title="Sécurité" value="OK" icon="ShieldCheck" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Paramètres importants</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
