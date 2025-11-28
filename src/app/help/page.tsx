'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';
import HeroBanner from '@/components/ui/HeroBanner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Inbox, Wrench, FileText, Users, ShieldCheck, DollarSign, AlertCircle } from 'lucide-react';

export default function HelpPage() {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar openMobile={openMobile} setOpenMobile={setOpenMobile} />
      <div className="flex-1 flex flex-col">
        <Header onOpenMobile={() => setOpenMobile(true)} isMobileOpen={openMobile} />
        <main className="flex-1 overflow-auto">
          {/* Hero Banner with image and text overlay */}
          <div className="px-4 md:px-8 py-4">
            <HeroBanner image="/images/admin.jpg" alt="Aide & Documentation">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">Aide & Documentation</h1>
                <p className="text-lg md:text-xl text-white/90 mt-2 drop-shadow">Guide complet du workflow garage - De la réception à la facturation</p>
              </div>
            </HeroBanner>
          </div>

          <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Section 1 - Hero Mission */}
            <Card className="p-6 backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-blue-700/30 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <Target size={32} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold mb-1">Mission de l&apos;Aide</h2>
                  <p className="text-gray-600 dark:text-gray-300">Accédez à toute la documentation, aux workflows et à l&apos;assistance pour garantir une expérience PRO et fluide.</p>
                </div>
              </div>
            </Card>

            {/* Section 2 - Workflow Visuel */}
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Inbox size={20} /> Workflow Atelier</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col items-center">
                  <Badge variant="blue" className="mb-2">Réception</Badge>
                  <Inbox size={28} className="text-blue-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Arrivée véhicule</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Badge variant="orange" className="mb-2">Atelier</Badge>
                  <Wrench size={28} className="text-orange-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Intervention technique</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Badge variant="orange" className="mb-2">Facturation</Badge>
                  <DollarSign size={28} className="text-amber-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Paiement & sortie</span>
                </div>
              </div>
            </Card>

            {/* Section 3 - Modules avec Grid */}
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText size={20} /> Modules principaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 items-start">
                  <Badge variant="blue">Réception</Badge>
                  <Inbox size={24} className="text-blue-500" />
                  <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4">
                    <li>Gestion des arrivées</li>
                    <li>Photos véhicules</li>
                    <li>Clients & historique</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <Badge variant="orange">Atelier</Badge>
                  <Wrench size={24} className="text-orange-500" />
                  <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4">
                    <li>Planning interventions</li>
                    <li>Suivi techniciens</li>
                    <li>Statuts en temps réel</li>
                  </ul>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <Badge variant="orange">Facturation</Badge>
                  <DollarSign size={24} className="text-amber-500" />
                  <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4">
                    <li>Factures & paiements</li>
                    <li>Exports comptables</li>
                    <li>Alertes & relances</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Section 4 - Rôles & Permissions */}
            <Card className="p-6 bg-white/50 dark:bg-gray-900/50 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={20} /> Rôles & Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <Badge variant="green" className="mb-2">Réception</Badge>
                  <Inbox size={24} className="text-green-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Accès clients, photos, réception</span>
                </div>
                <div className="flex flex-col items-center">
                  <Badge variant="blue" className="mb-2">Technicien</Badge>
                  <Wrench size={24} className="text-blue-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Gestion interventions, atelier</span>
                </div>
                <div className="flex flex-col items-center">
                  <Badge variant="orange" className="mb-2">Admin</Badge>
                  <ShieldCheck size={24} className="text-orange-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Paramètres, facturation, équipe</span>
                </div>
              </div>
            </Card>

            {/* Section 5 - Support Urgence */}
            <Card className="p-6 bg-gradient-to-r from-rose-500/30 to-rose-700/30 border border-rose-400 dark:border-rose-600">
              <div className="flex items-center gap-4 mb-2">
                <AlertCircle size={28} className="text-rose-600 dark:text-rose-400" />
                <h3 className="text-lg font-semibold">Support & Urgences</h3>
              </div>
              <ol className="list-decimal ml-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>Consultez la documentation complète en ligne</li>
                <li>Contactez le support technique : <a href="mailto:support@garagepro.com" className="underline text-blue-600">support@garagepro.com</a></li>
                <li>En cas de panne critique, appelez le <span className="font-bold text-rose-600">01 23 45 67 89</span></li>
              </ol>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
