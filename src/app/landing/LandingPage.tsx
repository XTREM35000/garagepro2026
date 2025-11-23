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

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Garage background"
            fill
            quality={60}
            className="object-cover opacity-30 dark:opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70 dark:to-black/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                GaragePro — <span className="text-green-600">SaaS Multi-Garages</span>
              </h1>

              <p className="text-lg text-gray-700 max-w-xl">
                Centralisez interventions, stock, facturation et relation client. Interface rapide, pens&eacute;e pour l&apos;Afrique — FCFA natif, mobile-first et usage terrain.
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

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="px-3 py-2 bg-white/70 rounded-full text-sm shadow">3 jours : mise en route</div>
                <div className="px-3 py-2 bg-white/70 rounded-full text-sm shadow">Paiements FCFA (Stripe)</div>
                <div className="px-3 py-2 bg-white/70 rounded-full text-sm shadow">Mobile-first</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="hidden md:block">
              <div className="rounded-3xl shadow-2xl overflow-hidden border">
                <div className="relative h-80 bg-gradient-to-br from-green-50 to-white">
                  <Image src="/images/atelier.jpg" alt="Illustration" fill className="object-cover" />
                </div>

                <div className="p-6 bg-white">
                  <h4 className="font-bold text-lg">Tableau de bord intelligent</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Vue synth&eacute;tique, indicateurs cl&eacute;s, actions rapides — con&ccedil;u pour usage mobile et desktop.
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl text-center">
                      <div className="text-xs text-gray-500">CA / mois</div>
                      <div className="font-semibold">FCFA 0</div>
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
            <h2 className="text-3xl font-bold">Fonctionnalit&eacute;s principales</h2>
            <p className="text-sm text-gray-500 hidden sm:block">Pens&eacute; pour la rapidit&eacute;, le terrain et la gestion multi-sites.</p>
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
                initial={{ opacity: 0, y: 10 }}
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
          <h2 className="text-3xl font-bold text-center mb-6">Comment &ccedil;a marche ?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1. Inscription",
                text: "Cr&eacute;ez votre espace garage ou r&eacute;seau multi-sites. Entrer vos donn&eacute;es, logo et pr&eacute;f&eacute;rences.",
              },
              {
                title: "2. Configuration",
                text: "Ajoutez utilisateurs, r&ocirc;les, ateliers, stocks et mod&egrave;les de factures.",
              },
              {
                title: "3. Lancement",
                text: "Formez les &eacute;quipes, importez votre stock et lancez les interventions.",
              },
            ].map((s, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-gray-600">{s.text}</p>
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
              title="Essai Gratuit"
              price="0"
              period="7 jours"
              features={[
                "3 utilisateurs max",
                "1 garage",
                "Modules limit&eacute;s",
                "Pas d&rsquo;IA",
                "Pas de WhatsApp",
              ]}
              accent="from-gray-100 to-gray-200"
            />

            <PricingCard
              title="Pro"
              price="25 000"
              period="mois"
              features={[
                "3 utilisateurs",
                "3 garages",
                "Modules standards",
                "IA basique",
                "WhatsApp limit&eacute;",
                "Paiements int&eacute;gr&eacute;s",
                "Avance mise en route : 100 000 FCFA",
              ]}
              accent="from-gray-300 to-gray-500"
            />

            <PricingCard
              title="Entreprise"
              price="100 000"
              period="mois"
              features={[
                "Utilisateurs illimit&eacute;s",
                "Garages illimit&eacute;s",
                "Tous modules",
                "IA avanc&eacute;e",
                "WhatsApp illimit&eacute;",
                "Automatisations",
                "Avance mise en route : 100 000 FCFA",
              ]}
              accent="from-gray-500 to-gray-800"
              textColor="text-white"
            />
          </div>
        </div>
      </section>

      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GaragePro — Con&ccedil;u pour l&apos;Afrique · FCFA nativement support&eacute;
        </div>
      </footer>
    </div>
  );
}

/* Pricing card */
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
      <p className="text-3xl font-extrabold mb-3">
        {price} <span className="text-base font-medium">FCFA</span>
      </p>
      <p className="text-sm mb-6">{period}</p>

      <ul className="text-sm text-left space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>

      <button className="px-6 py-3 rounded-full bg-black/90 text-white font-semibold hover:opacity-90 transition">Choisir</button>
    </motion.div>
  );
}
