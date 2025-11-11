/**
 * Hero component
 * Props: none (example)
 * Renders a contextual hero banner with preloaded image
 */
import React from 'react'

export default function Hero() {
  return (
    <header className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop" alt="Hero" fetchPriority="high" className="w-24 h-24 rounded-md object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">Bienvenue</h1>
          <p className="text-sm text-gray-600">Votre plateforme SaaS multi-tenant prête à monétiser.</p>
        </div>
      </div>
    </header>
  )
}
