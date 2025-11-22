import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function ClientsPage() {
  const columns = ["Nom", "Téléphone", "Véhicule", "Dernière visite"];
  const data = [
    ["Kouadio Serge", "+225 01 23 45 67", "GR-1000-AB", "2025-11-10"],
    ["Konan Ahou", "+225 07 11 22 33", "DK-1001-CD", "2025-11-04"],
    ["Adélaïde Traoré", "+225 05 44 55 66", "AB-1002-EF", "2025-10-28"],
    ["Bamba Ibrahim", "+225 27 88 77 66", "BD-1003-GH", "2025-09-12"],
    ["Mariam Diabaté", "+225 01 99 88 77", "KT-1004-IJ", "2025-08-03"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Clients total" value="128" icon="Users" />
        <MetricsCard title="Nouveaux (30j)" value="9" icon="Phone" />
        <MetricsCard title="Zones actives" value="8" icon="MapPin" />
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
