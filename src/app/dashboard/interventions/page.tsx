import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function InterventionsPage() {
  const columns = ["ID", "Client", "Véhicule", "Date", "Statut"];
  const data = [
    ["INT-2025-001", "Kouadio Serge", "GR-1000-AB", "2025-11-20", "En cours"],
    ["INT-2025-002", "Konan Ahou", "DK-1001-CD", "2025-11-21", "Planifiée"],
    ["INT-2025-003", "Adélaïde Traoré", "AB-1002-EF", "2025-11-18", "Livrée"],
    ["INT-2025-004", "Bamba Ibrahim", "BD-1003-GH", "2025-10-30", "Terminé"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Interventions aujourd'hui" value="5" icon="Activity" />
        <MetricsCard title="Temps moyen" value="1.6 h" icon="Clock" />
        <MetricsCard title="Interventions terminées" value="1 024" icon="Tool" />
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
