"use client";
export const runtime = "nodejs";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Home,
  Settings,
  Rocket,
  CreditCard,
  CalendarCheck,
  Wrench,
  Users,
  Camera,
  Cpu,
} from "lucide-react";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";

type LandingPageProps = {
  onClose?: () => void;
  initialSetupState?: { superAdminExists: boolean; tenantAdminExists: boolean };
};

const features = [
  {
    icon: <CalendarCheck size={36} className="text-white drop-shadow-md" />,
    title: "Planning des interventions",
    desc: "Calendrier visuel, cr&eacute;neaux, assignation rapide de techniciens.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: <Wrench size={36} className="text-white drop-shadow-md" />,
    title: "Gestion du stock",
    desc: "Suivi des pi&egrave;ces, alertes seuil, mouvements et inventaires rapides.",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: <CreditCard size={36} className="text-white drop-shadow-md" />,
    title: "Facturation &amp; paiements",
    desc: "Cr&eacute;ation de factures, paiements en ligne, re&ccedil;us et historique FCFA.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: <Users size={36} className="text-white drop-shadow-md" />,
    title: "Gestion des &eacute;quipes",
    desc: "R&ocirc;les, permissions, planning &amp; performances des techniciens.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <Camera size={36} className="text-white drop-shadow-md" />,
    title: "Photos v&eacute;hicules",
    desc: "Before/after, upload rapide et timeline visuelle des r&eacute;parations.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: <Cpu size={36} className="text-white drop-shadow-md" />,
    title: "Automatisation &amp; IA",
    desc: "Suggestions de pi&egrave;ces, diagnostics rapides et macros automatis&eacute;es.",
    color: "from-yellow-500 to-yellow-600",
  },
];

export default function LandingPage({ onClose = () => { }, initialSetupState }: LandingPageProps) {
  const router = useRouter();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleConnectClick = async () => {
    try {
      let superAdminExists = false;
      let tenantAdminExists = false;

      if (initialSetupState && typeof initialSetupState.superAdminExists === "boolean") {
        superAdminExists = initialSetupState.superAdminExists;
        tenantAdminExists = initialSetupState.tenantAdminExists;
      } else {
        let json: { superAdminExists: boolean; tenantAdminExists: boolean } = { superAdminExists: false, tenantAdminExists: false };
        try {
          const res = await fetch("/api/setup/status", { cache: "no-store" });
          if (res.ok) {
            try { json = await res.json(); } catch { json = { superAdminExists: false, tenantAdminExists: false }; }
          }
        } catch (err) {
          json = { superAdminExists: false, tenantAdminExists: false };
        }

        superAdminExists = !!json.superAdminExists;
        tenantAdminExists = !!json.tenantAdminExists;
      }

      if (!superAdminExists) router.push("/onboarding/super-admin");
      else if (!tenantAdminExists) router.push("/onboarding/tenant-admin");
      else router.push("/auth");
    } catch (err) {
      router.push("/onboarding/super-admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Sticky header */}
      <header className="sticky top-0 z-50">
        <div className="backdrop-blur bg-white/60 dark:bg-gray-900/60 border-b border-white/10 dark:border-gray-800/60">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AnimatedLogoGarage size={44} animated showText />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Home size={16} className="text-sky-600" /> Accueil
              </button>
              <button onClick={() => scrollTo("features")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Settings size={16} className="text-emerald-600" /> Fonctionnalit&eacute;s
              </button>
              <button onClick={() => scrollTo("how")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Rocket size={16} className="text-orange-500" /> Comment &ccedil;a marche
              </button>
              <button onClick={() => scrollTo("pricing")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <CreditCard size={16} className="text-yellow-600" /> Tarifs
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={handleConnectClick}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
              >
                Se connecter
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-full border text-sm hover:bg-gray-100 transition">
                D&eacute;couvrir
              </button>
              <button
                className="md:hidden p-2 rounded-full bg-white/60 backdrop-blur border"
                onClick={() => scrollTo("features")}
                aria-label="menu"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO, FEATURES, HOW, PRICING ... */}
      {/* Ton code actuel du landing page reste inchangé */}

    </div>
  );
}

/* PricingCard unchanged */
function PricingCard({
  title,
  price,
  period,
  features,
  accent,
  textColor = "text-gray-900",
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  accent: string;
  textColor?: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`rounded-3xl p-8 shadow-lg bg-gradient-to-b ${accent} ${textColor}`}>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold mb-3">{price} <span className="text-base font-medium">FCFA</span></p>
      <p className="text-sm mb-6">{period}</p>
      <ul className="text-sm text-left space-y-2 mb-6">
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <button className="px-6 py-3 rounded-full bg-black/90 text-white font-semibold hover:opacity-90 transition">Choisir</button>
    </motion.div>
  );
}
