"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home, Settings, Boxes, Rocket, CreditCard,
  Car, Wrench, Users, CalendarCheck, Cpu,
  Camera, Repeat, Settings2, Upload, ShieldCheck,
} from "lucide-react";
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage';
import Image from 'next/image'

type LandingPageProps = { onClose?: () => void, initialSetupState?: { superAdminExists: boolean, tenantAdminExists: boolean } };

type FeatureItem = { icon: JSX.Element; title: string }
const features: FeatureItem[] = [
  { icon: <CalendarCheck size={32} className="text-green-600 drop-shadow-md" />, title: "Planning des interventions" },
  { icon: <Wrench size={32} className="text-orange-600 drop-shadow-md" />, title: "Gestion du stock" },
  { icon: <CreditCard size={32} className="text-blue-600 drop-shadow-md" />, title: "Facturation & paiements" },
  { icon: <Users size={32} className="text-purple-600 drop-shadow-md" />, title: "Gestion des équipes" },
  { icon: <Camera size={32} className="text-rose-600 drop-shadow-md" />, title: "Photos véhicules" },
  { icon: <Cpu size={32} className="text-yellow-600 drop-shadow-md" />, title: "Automatisation & IA" },
];

type ModuleItem = { icon: JSX.Element; title: string }
const modules: ModuleItem[] = [
  { icon: <Car size={24} className="text-green-600" />, title: "Tableau de bord intelligent" },
  { icon: <Car size={24} className="text-blue-600" />, title: "Gestion des véhicules" },
  { icon: <Wrench size={24} className="text-orange-600" />, title: "Stock & matériel" },
  { icon: <Camera size={24} className="text-rose-600" />, title: "Photos avant / après" },
  { icon: <CreditCard size={24} className="text-blue-500" />, title: "Système de paie" },
  { icon: <Users size={24} className="text-purple-500" />, title: "Multi-locataires" },
  { icon: <Cpu size={24} className="text-yellow-600" />, title: "Agents IA" },
  { icon: <Repeat size={24} className="text-green-500" />, title: "Support WhatsApp" },
  { icon: <CreditCard size={24} className="text-blue-500" />, title: "Paiements Stripe" },
  { icon: <Settings2 size={24} className="text-gray-700" />, title: "Gestion Prisma & RLS" },
  { icon: <Upload size={24} className="text-gray-600" />, title: "Upload d’avatars" },
  { icon: <ShieldCheck size={24} className="text-green-700" />, title: "Rôles & permissions" },
];

export default function LandingPage({ onClose = () => { }, initialSetupState }: LandingPageProps) {
  const router = useRouter();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleConnectClick = async () => {
    try {
      let superAdminExists = false
      let tenantAdminExists = false

      if (initialSetupState && typeof initialSetupState.superAdminExists === 'boolean') {
        superAdminExists = initialSetupState.superAdminExists
        tenantAdminExists = initialSetupState.tenantAdminExists
      } else {
        const res = await fetch('/api/setup/status', { cache: 'no-store' })
        if (!res.ok) {
          router.push('/setup?step=super_admin')
          return
        }
        const json = await res.json()
        superAdminExists = !!json.superAdminExists
        tenantAdminExists = !!json.tenantAdminExists
      }

      if (!superAdminExists) router.push('/onboarding/super-admin')
      else if (!tenantAdminExists) router.push('/onboarding/tenant-admin')
      else router.push('/auth')
    } catch (err) {
      router.push('/onboarding/super-admin')
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <AnimatedLogoGarage size={48} animated showText />
          </motion.div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            {[
              { label: 'Accueil', id: 'hero', icon: <Home size={18} className="text-blue-600" /> },
              { label: 'Fonctionnalités', id: 'features', icon: <Settings size={18} className="text-green-600" /> },
              { label: 'Modules', id: 'modules', icon: <Boxes size={18} className="text-purple-600" /> },
              { label: 'Comment ça marche', id: 'how', icon: <Rocket size={18} className="text-orange-600" /> },
              { label: 'Tarifs', id: 'pricing', icon: <CreditCard size={18} className="text-yellow-600" /> },
            ].map((item, i) => (
              <button key={i} onClick={() => scrollTo(item.id)}
                className="hover:text-gray-700 flex items-center gap-2 transition">
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <motion.button whileHover={{ scale: 1.05 }} onClick={handleConnectClick} className="px-5 py-2 rounded-xl bg-green-600 text-white shadow-lg shadow-green-300/40 text-sm font-semibold hover:bg-green-700 transition">
              Se connecter
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-32">

        {/* HERO */}
        <section id="hero" className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              SaaS Multi-Garages — <span className="text-green-600">Gestion professionnelle</span>
            </h1>
            <p className="text-lg text-gray-700">
              Gérez interventions, stock, équipes, paiements et relation client avec une plateforme moderne pensée pour l’Afrique.
            </p>
          </div>

          <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ height: '65%', width: '80%' }}>
            <Image src="/img/img01.jpg" alt="Garage mécanique" className="object-cover" width={800} height={520} />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features">
          <h2 className="text-3xl font-bold mb-10 text-center">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f: FeatureItem, i: number) => (
              <motion.div key={i} whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-3xl shadow-xl border flex flex-col items-center text-center hover:shadow-green-400 hover:bg-green-50 transition">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MODULES */}
        <section id="modules">
          <h2 className="text-3xl font-bold mb-6 text-center">Modules du Système</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {modules.map((m: ModuleItem, i: number) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-2xl shadow-lg flex items-center gap-3 hover:bg-blue-50 hover:shadow-blue-300 transition">
                {m.icon} <span className="font-medium text-gray-900">{m.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section id="how">
          <h2 className="text-3xl font-bold mb-6 text-center">Comment ça marche ?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Inscription",
                text: "Créez votre espace garage ou réseau multi-sites. Vous définissez vos informations de base, activités et besoins.",
              },
              {
                title: "2. Configuration",
                text: "Ajoutez vos équipes, configurez vos rôles, votre stock, vos tarifs et vos processus internes.",
              },
              {
                title: "3. Exploitation",
                text: "Gérez interventions, factures, photos, paiements et relation client en temps réel.",
              }
            ].map((step, i) => (
              <motion.div key={i} whileHover={{ y: -6 }}
                className="bg-white p-6 rounded-2xl shadow border space-y-2">
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-700">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="text-center">
          <h2 className="text-3xl font-bold mb-4">Tarifs</h2>

          <div className="flex flex-col md:flex-row gap-6 justify-center">

            {/* FREE */}
            <PricingCard
              title="Essai Gratuit"
              price="0"
              period="7 jours"
              features={[
                "3 utilisateurs max",
                "1 garage",
                "Modules limités",
                "Pas d’IA",
                "Pas de WhatsApp"
              ]}
              bg="from-gray-100 to-gray-200"
              buttonBg="bg-gray-900 text-white"
            />

            {/* PRO */}
            <PricingCard
              title="Pro"
              price="25 000"
              period="mois"
              features={[
                "3 utilisateurs",
                "3 garages",
                "Modules standards",
                "IA basique",
                "WhatsApp limité",
                "Paiements intégrés",
                "⚠️ Avance mise en route : 100 000 FCFA"
              ]}
              bg="from-gray-300 to-gray-500"
              buttonBg="bg-gray-800 text-white"
            />

            {/* ENTERPRISE */}
            <PricingCard
              title="Entreprise"
              price="100 000"
              period="mois"
              features={[
                "Utilisateurs illimités",
                "Garages illimités",
                "Tous modules",
                "IA avancée",
                "WhatsApp illimité",
                "Automatisations",
                "Permissions avancées",
                "⚠️ Avance mise en route : 100 000 FCFA"
              ]}
              bg="from-gray-500 to-gray-800"
              buttonBg="bg-white text-gray-900"
              textColor="text-white"
            />

          </div>
        </section>

      </main>
    </div>
  );
}

/* PRICING CARD COMPONENT */
function PricingCard({ title, price, period, features, bg, textColor = "text-gray-900", buttonBg }: { title: string; price: string; period: string; features: string[]; bg: string; textColor?: string; buttonBg: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-3xl shadow-lg p-8 flex-1 bg-gradient-to-b ${bg} ${textColor} transition`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold mb-3">
        {price} <span className="text-base font-medium">FCFA</span>
      </p>
      <p className="text-sm mb-6">{period}</p>

      <ul className="text-sm text-left space-y-2 mb-6">
        {features.map((f: string, i: number) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>

      <button className={`px-6 py-3 rounded-xl font-semibold ${buttonBg} hover:opacity-90 transition`}>
        Choisir
      </button>
    </motion.div>
  );
}
