import React from "react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function StockPage() {
  const columns = ["Référence", "Nom", "Quantité", "Seuil alerte"];
  const data = [
    ["P-001", "Filtre huile", "24", "5"],
    ["P-042", "Bougie", "120", "20"],
    ["P-177", "Plaquette frein", "7", "10"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Articles en stock" value="1 324" icon="PackageSearch" />
        <MetricsCard title="Articles faibles" value="12" icon="Archive" />
        <MetricsCard title="Valeur stock" value="3 250 000 FCFA" icon="Tag" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Liste du stock</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
