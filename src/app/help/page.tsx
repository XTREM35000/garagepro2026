'use client';

import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { helpMessages } from '@/lib/helpMessages';

export default function HelpPage() {
  const categories = {
    'Dashboard': [
      { path: '/dashboard', label: 'Tableau de bord principal' },
      { path: '/dashboard/interventions', label: 'Interventions' },
      { path: '/dashboard/stock_materiel', label: 'Stock de matériel' },
      { path: '/dashboard/photos_vehicules', label: 'Photos de véhicules' },
      { path: '/dashboard/clients', label: 'Clients' },
      { path: '/dashboard/facturation', label: 'Facturation' },
      { path: '/dashboard/caisse', label: 'Caisse' },
      { path: '/dashboard/atelier', label: 'Atelier' },
      { path: '/dashboard/agents', label: 'Agents' },
    ],
    'Administration': [
      { path: '/dashboard/super', label: 'Super Admin' },
      { path: '/dashboard/tenant', label: 'Paramètres du locataire' },
    ],
    'Authentification': [
      { path: '/auth', label: 'Connexion' },
      { path: '/onboarding/super-admin', label: 'Configuration Super Admin' },
      { path: '/onboarding/tenant-admin', label: 'Configuration Locataire' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-emerald-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Centre d&apos;aide</h1>
          </div>
          <p className="text-white/90 text-lg">Trouvez les réponses à vos questions sur les différentes fonctionnalités de GaragePro</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {Object.entries(categories).map(([categoryName, items]) => (
          <div key={categoryName} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b-2 border-sky-500">
              {categoryName}
            </h2>

            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.path}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 transition-all hover:shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.label}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {helpMessages[item.path] || helpMessages['default']}
                    </p>
                    {item.path !== '/help' && (
                      <Link
                        href={item.path}
                        className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition"
                      >
                        Aller à la page
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* FAQ Section */}
        <div className="mt-16 bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-sky-200 dark:border-sky-800 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Questions fréquentes</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Comment créer une nouvelle intervention ?',
                a: 'Allez à la section Interventions, cliquez sur "Nouvelle intervention", remplissez les détails du véhicule et du client, puis validez. Vous pourrez ensuite ajouter des pièces et du temps de travail.'
              },
              {
                q: 'Comment gérer le stock de matériel ?',
                a: 'Consultez la section Stock de matériel. Vous pouvez ajouter, modifier ou supprimer des éléments. Le stock est mis à jour automatiquement lors de chaque intervention.'
              },
              {
                q: 'Comment accéder aux photos des véhicules ?',
                a: 'Allez à la section Photos de véhicules. Vous pouvez consulter les photos existantes et en ajouter de nouvelles pour chaque véhicule.'
              },
              {
                q: 'Comment générer une facture ?',
                a: 'Dans la section Facturation, créez une nouvelle facture, associez une intervention, définissez les tarifs et générez le PDF à imprimer ou envoyer au client.'
              },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{item.q}</p>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
