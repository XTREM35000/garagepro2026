"use client";

import React from "react";
import Image from 'next/image'
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import PageSection from "@/components/layout/PageSection";
import Card3D from "@/components/ui/Card3D";
import TablePro from "@/components/ui/TablePro";
import SettingsForm from "@/components/tenant/SettingsForm";

export default function TenantSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // wait for auth to initialize before deciding
  if (loading) return null;

  // only allow admin / super_admin
  if (!user || !["admin", "super_admin"].includes((user.role ?? "").toString())) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4">
              {/* Hero image with title/subtitle overlay */}
              <div className="mt-4 w-full rounded-3xl overflow-hidden shadow relative h-[300px]">
                <Image
                  src={'/images/super_admin.jpg'}
                  alt={`settings hero`}
                  width={1600}
                  height={300}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex items-end">
                  <div className="p-6 md:p-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">Paramètres du Tenant</h1>
                    <p className="text-lg md:text-xl text-white/90 mt-2 drop-shadow">Configurez les fonctionnalités, les utilisateurs et les préférences générales</p>
                  </div>
                </div>
              </div>
            </div>

            <PageSection title="Paramètres généraux">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card3D title="Info Tenant" subtitle="Nom, description, logo" />
                <Card3D title="Configuration App" subtitle="Activer/Désactiver modules" />
                <Card3D title="Préférences" subtitle="Devise, langue, thèmes" />
              </div>
            </PageSection>

            <PageSection title="Utilisateurs et rôles">
              <TablePro
                columns={["Nom", "Email", "Rôle", "Statut"]}
                data={[
                  ["Mariam Koné", "mariam.kone@ci.com", "Admin", "Actif"],
                  ["Kouadio Traoré", "kt@ci.com", "Technicien", "Actif"],
                  ["Abou Ouattara", "ao@ci.com", "Super Admin", "Actif"],
                ]}
              />
            </PageSection>

            <PageSection title="Modules et fonctionnalités">
              <TablePro
                columns={["Module", "Activé", "Dernière mise à jour"]}
                data={[
                  ["Facturation", "Oui", "12 Nov 2025"],
                  ["CRM", "Oui", "02 Oct 2025"],
                  ["Atelier", "Oui", "05 Nov 2025"],
                  ["Stock", "Non", "—"],
                ]}
              />
            </PageSection>

            <PageSection title="Logs et Historique">
              <TablePro
                columns={["Date", "Utilisateur", "Action", "Détails"]}
                data={[
                  ["20 Nov 2025", "Mariam Koné", "Création module", "Module Facturation activé"],
                  ["19 Nov 2025", "Abou Ouattara", "Mise à jour rôle", "Kouadio Traoré → Technicien"],
                  ["18 Nov 2025", "Mariam Koné", "Modification préférences", "Devise : FCFA"],
                ]}
              />
            </PageSection>

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <SettingsForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
// "use client";

// import React from "react";
// import { useAuth } from "@/lib/auth-context";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/dashboard/sidebar";
// import Header from "@/components/dashboard/header";
// import PageSection from "@/components/layout/PageSection";
// import Card3D from "@/components/ui/Card3D";
// import TablePro from "@/components/ui/TablePro";
// import SettingsForm from "@/components/tenant/SettingsForm";
// import HeroBanner from "@/components/hero/HeroBanner";

// export default function TenantSettingsPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   // Access control
//   if (loading) {
//     // wait for auth to initialize before deciding
//     return null
//   }

//   if (!user || !["admin", "super_admin"].includes((user.role ?? "").toString())) {
//     router.push("/dashboard");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <Header />

//       {/* Hero + filigrane */}
//       <HeroBanner
//         title="Paramètres du Tenant"
//         subtitle="Configurez les fonctionnalités, les utilisateurs et les préférences générales"
//         image="/images/hero/settings-hero.jpg"
//       />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
//         <PageSection title="Paramètres généraux">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Card3D title="Info Tenant" subtitle="Nom, description, logo" />
//             <Card3D title="Configuration App" subtitle="Activer/Désactiver modules" />
//             <Card3D title="Préférences" subtitle="Devise, langue, thèmes" />
//           </div>
//         </PageSection>

//         <PageSection title="Utilisateurs et rôles">
//           <TablePro
//             columns={["Nom", "Email", "Rôle", "Statut"]}
//             data={[
//               ["Mariam Koné", "mariam.kone@ci.com", "Admin", "Actif"],
//               ["Kouadio Traoré", "kt@ci.com", "Technicien", "Actif"],
//               ["Abou Ouattara", "ao@ci.com", "Super Admin", "Actif"],
//             ]}
//           />
//         </PageSection>

//         <PageSection title="Modules et fonctionnalités">
//           <TablePro
//             columns={["Module", "Activé", "Dernière mise à jour"]}
//             data={[
//               ["Facturation", "Oui", "12 Nov 2025"],
//               ["CRM", "Oui", "02 Oct 2025"],
//               ["Atelier", "Oui", "05 Nov 2025"],
//               return (
//           <div className="min-h-screen flex bg-gray-50">
//             <Sidebar />
//             <div className="flex-1 flex flex-col">
//               <Header />
//               <main className="flex-1 p-6">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                   <div className="mb-4">
//                     {/* Hero image with title/subtitle overlay (filigrame blanc) */}
//                     <div className="mt-4 w-full rounded-3xl overflow-hidden shadow relative h-[300px]">
//                       <img
//                         src={'/images/super_admin.jpg'}
//                         alt={`settings hero`}
//                         className="w-full h-full object-cover"
//                       />

//                       <div className="absolute inset-0 flex items-end">
//                         <div className="p-6 md:p-8">
//                           <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">Paramètres du Tenant</h1>
//                           <p className="text-lg md:text-xl text-white/90 mt-2 drop-shadow">Configurez les fonctionnalités, les utilisateurs et les préférences générales</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <PageSection title="Paramètres généraux">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                       <Card3D title="Info Tenant" subtitle="Nom, description, logo" />
//                       <Card3D title="Configuration App" subtitle="Activer/Désactiver modules" />
//                       <Card3D title="Préférences" subtitle="Devise, langue, thèmes" />
//                     </div>
//                   </PageSection>

//                   <PageSection title="Utilisateurs et rôles">
//                     <TablePro
//                       columns={["Nom", "Email", "Rôle", "Statut"]}
//                       data={[
//                         ["Mariam Koné", "mariam.kone@ci.com", "Admin", "Actif"],
//                         ["Kouadio Traoré", "kt@ci.com", "Technicien", "Actif"],
//                         ["Abou Ouattara", "ao@ci.com", "Super Admin", "Actif"],
//                       ]}
//                     />
//                   </PageSection>

//                   <PageSection title="Modules et fonctionnalités">
//                     <TablePro
//                       columns={["Module", "Activé", "Dernière mise à jour"]}
//                       data={[
//                         ["Facturation", "Oui", "12 Nov 2025"],
//                         ["CRM", "Oui", "02 Oct 2025"],
//                         ["Atelier", "Oui", "05 Nov 2025"],
//                         ["Stock", "Non", "—"],
//                       ]}
//                     />
//                   </PageSection>

//                   <PageSection title="Logs et Historique">
//                     <TablePro
//                       columns={["Date", "Utilisateur", "Action", "Détails"]}
//                       data={[
//                         ["20 Nov 2025", "Mariam Koné", "Création module", "Module Facturation activé"],
//                         ["19 Nov 2025", "Abou Ouattara", "Mise à jour rôle", "Kouadio Traoré → Technicien"],
//                         ["18 Nov 2025", "Mariam Koné", "Modification préférences", "Devise : FCFA"],
//                       ]}
//                     />
//                   </PageSection>
//                 </div>
//               </main>
//             </div>
//           </div>
//           ); } ;}
