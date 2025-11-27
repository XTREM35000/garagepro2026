"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function TenantAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Only allow TENANT_ADMIN
    if (!user || (user as any).role !== "TENANT_ADMIN") {
      alert("Accès refusé. Seul Tenant Admin peut accéder à cette page.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || (user as any).role !== "TENANT_ADMIN") return null;

  const columns = ["Utilisateur", "Rôle", "Email", "Actif"];
  const data = [
    ["Jean Dupont", "Admin", "jean@garage.fr", "Oui"],
    ["Marie Martin", "Mécanicien", "marie@garage.fr", "Oui"],
    ["Pierre Durand", "Réceptionniste", "pierre@garage.fr", "Oui"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Utilisateurs" value="12" icon="Users" />
        <MetricsCard title="Mécaniciens" value="5" icon="Wrench" />
        <MetricsCard title="Réceptionnistes" value="2" icon="Users" />
      </div>

      <div className="mt-8">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Membres du garage</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
