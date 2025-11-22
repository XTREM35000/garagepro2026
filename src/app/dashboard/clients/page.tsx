import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function ClientsPage() {
  const columns = ["Nom", "Téléphone", "Véhicule", "Dernière visite"];
  const data = [
    ["M. Kouadio", "+225 01 23 45 67", "CI-123-ABC", "2025-11-10"],
    ["Mme Diarra", "+225 07 89 01 23", "CI-987-XYZ", "2025-11-04"],
    ["Société X", "+225 02 34 56 78", "Flotte", "2025-10-28"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Clients total" value="422" icon="Users" />
        <MetricsCard title="Nouveaux (30j)" value="12" icon="Phone" />
        <MetricsCard title="Zones actives" value="6" icon="MapPin" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Liste des clients</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
