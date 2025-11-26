"use client"

import React, { useState } from 'react'
import HeroBanner from '@/components/ui/HeroBanner'
import Sidebar from '@/components/dashboard/sidebar'
import Header from '@/components/dashboard/header'
import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'
import { usePathname } from 'next/navigation'

const heroImages: Record<string, string> = {
  atelier: '/images/atelier.jpg',
  stock: '/images/stock.jpg',
  clients: '/images/client.jpg',
  caisse: '/images/caisse.jpg',
  photos: '/images/photo.jpg',
  interventions: '/images/interventions.jpg',
  admin: '/images/admin.jpg',
  super: '/images/super_admin.jpg',
  facturation: '/images/facturation.jpg',
}

const heroTitles: Record<string, string> = {
  dashboard: 'Tableau de bord',
  atelier: 'Atelier & Interventions',
  stock: 'Stock & Matériel',
  clients: 'Clients',
  caisse: 'Caisse & Encaissements',
  photos: 'Photos véhicules',
  interventions: 'Interventions',
  admin: 'Administration',
  super: 'Super Admin',
  facturation: 'Facturation & Paiements',
}

const heroSubtitles: Record<string, string> = {
  dashboard: "Vue synthétique de l'activité",
  atelier: "Pilotez les interventions — planning, techniciens, et statut en temps réel.",
  stock: "Surveillez les niveaux, mouvements et alertes de réapprovisionnement.",
  clients: "Tous vos clients, historiques et informations de contact.",
  caisse: "Suivez les entrées et sorties, exportez et rapprochez vos paiements.",
  photos: "Galerie avant / après des véhicules en atelier.",
  interventions: "Pilotez toutes les interventions: priorités, planning et impact.",
  admin: "Paramètres globaux et configuration de la plateforme.",
  super: "Vue globale et contrôle multi-tenant de la plateforme.",
  facturation: "Générez, suivez et rapprochez vos factures.",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const segment = pathname.split('/').filter(Boolean)[1] || 'dashboard'

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-x-hidden">
      <Sidebar openMobile={mobileSidebarOpen} setOpenMobile={setMobileSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header onOpenMobile={() => setMobileSidebarOpen(true)} isMobileOpen={mobileSidebarOpen} />
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4">
              <BackButton />

              {/* Hero image with title/subtitle overlay (filigramme blanc) */}
              {/* Centralized hero banner */}
              <HeroBanner image={heroImages[segment] || '/images/dashboard.png'} alt={`${segment} hero`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">{heroTitles[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1))}</h1>
                    <p className="text-lg md:text-xl text-white/90 mt-2 drop-shadow">{heroSubtitles[segment] || `Gestion ${segment}`}</p>
                  </div>

                  {segment === 'agents' && (
                    <div className="ml-6 hidden md:flex items-center gap-3">
                      <Button onClick={() => { if (typeof window !== 'undefined') { window.location.hash = 'add'; } }}>
                        <UserPlus size={16} /> Ajouter agent
                      </Button>
                      <Button variant="ghost">Exporter</Button>
                    </div>
                  )}
                </div>
              </HeroBanner>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
