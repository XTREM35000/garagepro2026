"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";

export default function SuperAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Only allow SUPER_ADMIN
    if (!user || (user as any).role !== "SUPER_ADMIN") {
      alert("Accès refusé. Seul Super Admin peut accéder à cette page.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || (user as any).role !== "SUPER_ADMIN") return null;

  const columns = ["Instance", "Tenants", "Utilisateurs", "Actif"];
  const data = [
    ["Instance-1", "12", "120", "Oui"],
    ["Instance-2", "3", "28", "Oui"],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard title="Tenants" value="15" icon="Globe" />
        <MetricsCard title="Utilisateurs" value="1 234" icon="Box" />
        <MetricsCard title="Super admin" value="1" icon="Crown" />
      </div>

      <div className="mt-4">
        <Card3D>
          <h3 className="text-lg font-semibold mb-4">Instances</h3>
          <TablePro columns={columns} data={data} />
        </Card3D>
      </div>
    </div>
  );
}
