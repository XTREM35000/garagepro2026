import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function InterventionsPage() {
  const columns = ["ID", "Client", "Véhicule", "Date", "Statut"];
  const data = [
    ["INT-001", "M. Kouadio", "AB-123-CD", "2025-11-20", "En cours"],
    ["INT-002", "Mme Diarra", "EF-456-GH", "2025-11-21", "Planifiée"],
    ["INT-003", "Société X", "Flotte", "2025-11-18", "Livrée"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Interventions aujourd'hui" value="6" icon="Activity" />
        <MetricsCard title="Temps moyen" value="1.8 h" icon="Clock" />
        <MetricsCard title="Interventions terminées" value="1 320" icon="Tool" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Table des interventions</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
