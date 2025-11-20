"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Car, Wrench, Users, CalendarCheck, CreditCard, Cpu, Camera, Repeat, Settings2, Upload, ShieldCheck } from "lucide-react";
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage';

type LandingPageProps = { onClose?: () => void };

const features = [
  { icon: <CalendarCheck size={28} className="text-green-600" />, title: "Planning des interventions" },
  { icon: <Wrench size={28} className="text-green-600" />, title: "Gestion du stock" },
  { icon: <CreditCard size={28} className="text-green-600" />, title: "Facturation & paiements" },
  { icon: <Users size={28} className="text-green-600" />, title: "Gestion des équipes" },
  { icon: <Camera size={28} className="text-green-600" />, title: "Photos véhicules" },
  { icon: <Cpu size={28} className="text-green-600" />, title: "Automatisation & IA" },
];

const modules = [
  { icon: <Car size={24} className="text-blue-500" />, title: "Tableau de bord intelligent" },
  { icon: <Car size={24} className="text-blue-500" />, title: "Gestion des véhicules" },
  { icon: <Wrench size={24} className="text-blue-500" />, title: "Stock & matériel" },
  { icon: <Camera size={24} className="text-blue-500" />, title: "Photos véhicules avant/après" },
  { icon: <CreditCard size={24} className="text-blue-500" />, title: "Système de paie (payslips)" },
  { icon: <Users size={24} className="text-blue-500" />, title: "Gestion multi-locataires" },
  { icon: <Cpu size={24} className="text-blue-500" />, title: "Agents IA" },
  { icon: <Repeat size={24} className="text-blue-500" />, title: "Support WhatsApp intégré" },
  { icon: <CreditCard size={24} className="text-blue-500" />, title: "Paiements Stripe" },
  { icon: <Settings2 size={24} className="text-blue-500" />, title: "Gestion Prisma & RLS" },
  { icon: <Upload size={24} className="text-blue-500" />, title: "Upload d’avatars" },
  { icon: <ShieldCheck size={24} className="text-blue-500" />, title: "Rôles & permissions" },
];

export default function LandingPage({ onClose = () => { } }: LandingPageProps) {
  const router = useRouter();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleConnectClick = async () => {
    const res = await fetch('/api/setup/status');
    const { superAdminExists, tenantAdminExists } = await res.json();

    if (!superAdminExists) {
      router.push('/setup?step=super_admin');
    } else if (!tenantAdminExists) {
      router.push('/setup?step=tenant_admin');
    } else {
      router.push('/auth');
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

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            {[
              { label: 'Accueil', id: 'hero' },
              { label: 'Fonctionnalités', id: 'features' },
              { label: 'Modules', id: 'modules' },
              { label: 'Comment ça marche', id: 'how' },
              { label: 'Tarifs', id: 'pricing' },
            ].map((item, i) => (
              <button key={i} onClick={() => scrollTo(item.id)} className="hover:text-gray-700 transition">
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <motion.button whileHover={{ scale: 1.05 }} onClick={handleConnectClick} className="px-5 py-2 rounded-xl bg-green-600 text-white shadow-lg shadow-green-300/40 text-sm font-semibold hover:bg-green-700 transition">
              Se connecter
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={onClose} className="px-4 py-2 rounded-xl border shadow text-sm font-medium hover:bg-gray-100 transition">
              Découvrir
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
              Gérez interventions, stock, paiements et relation client avec une interface simple et rapide.
            </p>
            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => router.push('/auth?tab=login')} className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-300/40 font-semibold">
                Se connecter
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={onClose} className="px-6 py-3 border rounded-2xl font-medium shadow">
                Découvrir
              </motion.button>
            </div>
          </div>
          <motion.img
            src="./img01.jpg"
            alt="Garage mécanique"
            className="rounded-3xl shadow-2xl object-cover"
            style={{ height: '65%', width: '80%' }}
          />

        </section>

        {/* FEATURES */}
        <section id="features">
          <h2 className="text-3xl font-bold mb-10 text-center">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-white p-6 rounded-3xl shadow-xl border flex flex-col items-center text-center hover:shadow-green-400 hover:bg-green-50 transition">
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
            {modules.map((m, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-lg flex items-center gap-3 hover:bg-blue-50 hover:shadow-blue-300 transition">
                {m.icon} <span className="font-medium text-gray-900">{m.title}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section id="how">
          <h2 className="text-3xl font-bold mb-6 text-center">Comment ça marche</h2>
          <div className="space-y-4 text-gray-700 mx-auto max-w-2xl">
            {[
              "Inscrivez votre garage ou réseau d’ateliers.",
              "Configurez vos équipes, stocks, rôles et tarifs.",
              "Gérez vos interventions et facturations en temps réel."
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow border">{i + 1}. {step}</div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="text-center">
          <h2 className="text-3xl font-bold mb-4">Tarifs</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {[
              { title: "Essai Gratuit", price: "0", period: "7 jours", bg: "bg-gradient-to-b from-gray-100 to-gray-200", text: "text-gray-900", btn: "bg-gray-900 text-white" },
              { title: "Pro", price: "25 000", period: "mois", bg: "bg-gradient-to-b from-gray-300 to-gray-500", text: "text-gray-900", btn: "bg-gray-800 text-white" },
              { title: "Entreprise", price: "100 000", period: "mois", bg: "bg-gradient-to-b from-gray-500 to-gray-800", text: "text-white", btn: "bg-white text-gray-900" },
            ].map((plan, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className={`rounded-3xl shadow-lg p-8 flex-1 ${plan.bg} ${plan.text} transition`}>
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <p className="text-3xl font-extrabold mb-6">{plan.price} <span className="text-base font-medium">FCFA</span></p>
                <p className="text-sm mb-4">{plan.period}</p>
                <button className={`px-6 py-3 rounded-xl font-semibold ${plan.btn} hover:opacity-90 transition`}>
                  Choisir
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
