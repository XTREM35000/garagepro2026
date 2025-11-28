"use client";
export const runtime = "nodejs";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

// Fonction utilitaire pour formater les montants en FCFA
function formatFCFA(amount: number | string): string {
  return `${Number(amount).toLocaleString('fr-FR')} FCFA`;
}
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
  UserPlus,
  Sliders,
  PlayCircle,
  Star,
  Crown,
  Building2,
} from "lucide-react";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";

type SetupState = { superAdminExists: boolean; tenantAdminExists: boolean };
type LandingPageProps = {
  onClose?: () => void;
  initialSetupState?: SetupState;
};

const features = [
  {
    icon: <CalendarCheck size={36} className="text-white drop-shadow-md" />,
    title: "Planning des interventions",
    desc: "Calendrier visuel, créneaux, assignation rapide de techniciens.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: <Wrench size={36} className="text-white drop-shadow-md" />,
    title: "Gestion du stock",
    desc: "Suivi des pièces, alertes seuil, mouvements et inventaires rapides.",
    color: "from-sky-500 to-sky-600",
  },
  {
    icon: <CreditCard size={36} className="text-white drop-shadow-md" />,
    title: "Facturation & paiements",
    desc: "Création de factures, paiements en ligne, reçus et historique FCFA.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: <Users size={36} className="text-white drop-shadow-md" />,
    title: "Gestion des équipes",
    desc: "Rôles, permissions, planning & performances des techniciens.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <Camera size={36} className="text-white drop-shadow-md" />,
    title: "Photos véhicules",
    desc: "Before/after, upload rapide et timeline visuelle des réparations.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: <Cpu size={36} className="text-white drop-shadow-md" />,
    title: "Automatisation & IA",
    desc: "Suggestions de pièces, diagnostics rapides et macros automatisées.",
    color: "from-yellow-500 to-yellow-600",
  },
];

export default function LandingPage({ onClose = () => { }, initialSetupState }: LandingPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [setupState, setSetupState] = useState<SetupState | null>(initialSetupState ?? null);
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleConnectClick = async () => {
    setLoading(true);
    setMessage("Vérification du setup…");

    try {
      const res = await fetch("/api/setup/status", { cache: "no-store" });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setSetupState(json);

      if (!json.superAdminExists) {
        setMessage("Super Admin absent, redirection vers création…");
        setTimeout(() => router.push("/onboarding/super-admin"), 1500);
      } else if (!json.tenantAdminExists) {
        setMessage("Tenant Admin absent, redirection vers création…");
        setTimeout(() => router.push("/onboarding/tenant-admin"), 1500);
      } else {
        setMessage("Super Admin et Tenant Admin trouvés, redirection vers Auth…");
        setTimeout(() => router.push("/auth"), 1500);
      }
    } catch (err: any) {
      console.error("Erreur setup:", err);
      setMessage("Impossible de vérifier le setup. Redirection vers Super Admin…");
      setTimeout(() => router.push("/onboarding/super-admin"), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 max-w-full overflow-x-visible w-full relative">
        <div className="backdrop-blur bg-white/60 dark:bg-gray-900/60 border-b border-white/10 dark:border-gray-800/60">
          <div className="w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Desktop: Logo + Title */}
              <div className="hidden md:flex items-center gap-3">
                <AnimatedLogoGarage size={40} animated showText={false} />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Multi-Garages</span>
              </div>

              {/* Mobile: logo (left) */}
              <div className="md:hidden">
                <AnimatedLogoGarage size={40} animated showText={false} />
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Home size={16} className="text-sky-600" /> Accueil
              </button>
              <button onClick={() => scrollTo("features")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Settings size={16} className="text-emerald-600" /> Fonctionnalités
              </button>
              <button onClick={() => scrollTo("how")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <Rocket size={16} className="text-orange-500" /> Comment ça marche
              </button>
              <button onClick={() => scrollTo("pricing")} className="flex items-center gap-2 hover:text-gray-700 transition">
                <CreditCard size={16} className="text-yellow-600" /> Tarifs
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {/* Mobile burger moved to right actions so it's on the far-right */}
              <button className="md:hidden p-2 rounded-lg bg-gray-100" aria-label="Ouvrir le menu" onClick={() => setMobileOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              </button>
              <button
                onClick={handleConnectClick}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
              >
                Se connecter
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-full border text-sm hover:bg-gray-100 transition">
                D&eacute;couvrir
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer for landing nav */}
        {mobileOpen && (
          <div className="fixed inset-0 z-60">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="fixed top-0 left-0 w-full max-w-[80vw] bg-white dark:bg-gray-900 h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <AnimatedLogoGarage size={36} animated showText={false} />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-md">✕</button>
              </div>
              <nav className="flex flex-col gap-4">
                <button onClick={() => { setMobileOpen(false); scrollTo('hero'); }} className="flex items-center gap-3 py-2">
                  <Home size={18} /> Accueil
                </button>
                <button onClick={() => { setMobileOpen(false); scrollTo('features'); }} className="flex items-center gap-3 py-2">
                  <Settings size={18} /> Fonctionnalités
                </button>
                <button onClick={() => { setMobileOpen(false); scrollTo('how'); }} className="flex items-center gap-3 py-2">
                  <Rocket size={18} /> Comment ça marche
                </button>
                <button onClick={() => { setMobileOpen(false); scrollTo('pricing'); }} className="flex items-center gap-3 py-2">
                  <CreditCard size={18} /> Tarifs
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Garage background"
            fill
            sizes="90vw"
            quality={60}
            className="object-cover opacity-30 dark:opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70 dark:to-black/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-26">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                GaragePro — <span className="text-green-600">SaaS Multi-Garages</span>
              </h1>

              <p className="text-lg text-gray-700 max-w-xl">
                Centralisez interventions, stock, facturation et relation client. Interface rapide, pensée pour l&apos;Afrique — FCFA natif, mobile-first et usage terrain.
              </p>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow-xl"
                  onClick={handleConnectClick}
                >
                  Se connecter
                </motion.button>

                <motion.button whileHover={{ scale: 1.03 }} className="px-5 py-3 rounded-full border" onClick={() => scrollTo("features")}>
                  En savoir plus
                </motion.button>
              </div>

              {loading && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-700">{message}</p>
                </div>
              )}

              {!loading && setupState && (
                <div className="mt-4 text-gray-700 space-y-1">
                  <p>Super Admin: {setupState.superAdminExists ? "✅ trouvé" : "❌ absent"}</p>
                  <p>Tenant Admin: {setupState.tenantAdminExists ? "✅ trouvé" : "❌ absent"}</p>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="hidden md:block">
              <div className="rounded-3xl shadow-2xl overflow-hidden border">
                <div className="relative h-64 bg-gradient-to-br from-green-50 to-white">
                  <Image src="/images/hero-bg.jpg" alt="Illustration" fill sizes="(min-width: 768px) 33vw, 100%" className="object-cover" />
                </div>
                <div className="p-6 bg-white">
                  <h4 className="font-bold text-lg">Tableau de bord intelligent</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Vue synthétique, indicateurs clés, actions rapides — conçu pour usage mobile et desktop.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500">CA / mois</div>
                      <div className="font-semibold">{formatFCFA(0)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500">Interventions</div>
                      <div className="font-semibold">0</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500">Stock critique</div>
                      <div className="font-semibold">0</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Fonctionnalités principales</h2>
            <p className="text-sm text-gray-500 hidden sm:block">Pensé pour la rapidité, le terrain et la gestion multi-sites.</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6">
            <div className="absolute inset-0 pointer-events-none -z-10">
              <div className="max-w-5xl mx-auto">
                <div className="h-56 rounded-3xl bg-gradient-to-r from-white to-green-50/40 shadow-inner opacity-60" />
              </div>
            </div>

            {features.map((f, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="bg-white rounded-3xl p-6 shadow-lg border flex flex-col gap-3 hover:scale-[1.02] transition-transform"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${f.color}`}>
                  {f.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Disponible</div>
                  <button className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition">Voir</button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-6">Comment ça marche ?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <UserPlus size={36} className="text-white drop-shadow-md" />,
                title: "1. Inscription",
                text: "Créez votre espace garage ou réseau multi-sites. Entrer vos données, logo et préférences.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <Sliders size={36} className="text-white drop-shadow-md" />,
                title: "2. Configuration",
                text: "Ajoutez utilisateurs, rôles, ateliers, stocks et modèles de factures.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: <PlayCircle size={36} className="text-white drop-shadow-md" />,
                title: "3. Lancement",
                text: "Formez les équipes, importez votre stock et lancez les interventions.",
                color: "from-green-500 to-green-600",
              },
            ].map((s, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} className="bg-white p-6 rounded-2xl shadow border flex flex-col gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${s.color}`}>
                  {s.icon}
                </div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-gray-600">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Tarifs</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              icon={<Star size={36} className="text-white drop-shadow-md" />}
              title="Essai Gratuit"
              price={0}
              period="7 jours"
              features={["3 utilisateurs max", "1 garage", "Modules limités", "Pas d'IA", "Pas de WhatsApp"]}
              accent="from-gray-100 to-gray-200"
              iconColor="from-gray-400 to-gray-500"
            />
            <PricingCard
              icon={<Crown size={36} className="text-white drop-shadow-md" />}
              title="Pro"
              price={25000}
              period="mois"
              features={[
                "3 utilisateurs",
                "3 garages",
                "Modules standards",
                "IA basique",
                "WhatsApp limité",
                "Paiements intégrés",
                "Avance mise en route : 100 000 FCFA",
              ]}
              accent="from-gray-300 to-gray-500"
              iconColor="from-amber-500 to-amber-600"
            />
            <PricingCard
              icon={<Building2 size={36} className="text-white drop-shadow-md" />}
              title="Entreprise"
              price={100000}
              period="mois"
              features={[
                "Utilisateurs illimités",
                "Garages illimités",
                "Tous modules",
                "IA avancée",
                "WhatsApp illimité",
                "Automatisations",
                "Avance mise en route : 100 000 FCFA",
              ]}
              accent="from-gray-500 to-gray-800"
              iconColor="from-indigo-500 to-indigo-600"
              textColor="text-white"
            />
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GaragePro — Conçu pour l&apos;Afrique · FCFA nativement supporté
        </div>
      </footer>
    </div>
  );
}

/* Pricing card */
function PricingCard({ icon, title, price, period, features, accent, iconColor, textColor = "text-gray-900" }: { icon?: React.ReactNode; title: string; price: number; period: string; features: string[]; accent: string; iconColor?: string; textColor?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`rounded-3xl p-8 shadow-lg bg-gradient-to-b ${accent} ${textColor} flex flex-col`}>
      <div className="flex items-start justify-between mb-4">
        {icon && iconColor && (
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${iconColor}`}>
            {icon}
          </div>
        )}
        <button className="px-4 py-2 rounded-full bg-black/90 text-white text-sm font-semibold hover:opacity-90 transition">Choisir</button>
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold mb-3">
        {formatFCFA(price)}
      </p>
      <p className="text-sm mb-6">{period}</p>

      <ul className="text-sm text-left space-y-2 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>
    </motion.div>
  );
}
