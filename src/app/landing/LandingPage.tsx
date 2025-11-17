"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  onClose: () => void;
};

export default function LandingPage({ onClose }: Props) {
  const router = useRouter();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">GaragePro</div>
            <nav className="hidden sm:flex space-x-3">
              <button onClick={() => scrollTo('hero')} className="text-sm hover:underline">Accueil</button>
              <button onClick={() => scrollTo('features')} className="text-sm hover:underline">Fonctionnalités</button>
              <button onClick={() => scrollTo('how')} className="text-sm hover:underline">Comment ça marche</button>
              <button onClick={() => scrollTo('pricing')} className="text-sm hover:underline">Tarifs</button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/auth')}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Se connecter
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-md border text-sm"
            >
              Commencer
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-24">
        <section id="hero" className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-extrabold">Gestion simplifiée de votre garage</h1>
          <p className="text-lg text-gray-600">Organisez les interventions, suivez le stock, facturez et fidélisez vos clients en un seul endroit.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/auth')} className="px-5 py-3 bg-blue-600 text-white rounded-md">Se connecter</button>
            <button onClick={onClose} className="px-5 py-3 border rounded-md">Découvrir</button>
          </div>
        </section>

        <section id="features">
          <h2 className="text-2xl font-bold mb-4">Fonctionnalités clés</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <li className="p-4 border rounded">Planning des interventions</li>
            <li className="p-4 border rounded">Gestion du stock et pièces</li>
            <li className="p-4 border rounded">Facturation et paiements</li>
          </ul>
        </section>

        <section id="how">
          <h2 className="text-2xl font-bold mb-4">Comment ça marche</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Créez vos fiches clients et véhicules.</li>
            <li>Planifiez les interventions et suivez l'avancement.</li>
            <li>Gérez le stock de pièces et automatisez la facturation.</li>
          </ol>
        </section>

        <section id="pricing">
          <h2 className="text-2xl font-bold mb-4">Tarifs</h2>
          <p className="text-gray-600">Plans adaptés aux garages indépendants et aux chaînes — commencez par un essai gratuit.</p>
        </section>

        <footer className="py-12 text-center text-sm text-gray-500">© {new Date().getFullYear()} GaragePro</footer>
      </main>
    </div>
  );
}
