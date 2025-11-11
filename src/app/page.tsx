import React from 'react'
import Hero from '../components/hero/hero'
import Sidebar from '../components/ui/sidebar'

export default function Page() {
  return (
    <div className="flex">
      <aside className="w-72">
        <Sidebar />
      </aside>
      <main className="flex-1 p-8">
        <Hero />
        <section className="mt-8">Bienvenue sur le SaaS Starter — tableau de bord minimal</section>
      </main>
    </div>
  )
}
