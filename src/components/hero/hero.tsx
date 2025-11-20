"use client";

/**
 * Hero component
 * Props: none (example)
 * Renders a contextual hero banner with preloaded image
 */
import React from 'react'
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

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
    <header className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop" alt="Hero" fetchPriority="high" className="w-24 h-24 rounded-md object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">Bienvenue</h1>
          <p className="text-sm text-gray-600">Votre plateforme SaaS multi-tenant prête à monétiser.</p>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleConnectClick}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
        >
          Se connecter
        </button>
      </div>
    </header>
  )
}
