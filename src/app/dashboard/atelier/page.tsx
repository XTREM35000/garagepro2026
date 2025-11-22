import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function AtelierPage() {
  const columns = ["Intervention", "Véhicule", "Statut", "Technicien"];
  const data = [
    ["Changement frein", "AB-123-CD", "En cours", "Ali"],
    ["Révision 10k", "EF-456-GH", "Planifiée", "Mamadou"],
    ["Diagnostic moteur", "IJ-789-KL", "Terminé", "Sophie"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Interventions actives" value="8" icon="Wrench" />
        <MetricsCard title="Temps moyen (h)" value="2.3" icon="Clock" />
        <MetricsCard title="Techniciens" value="5" icon="Users" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Interventions récentes</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
