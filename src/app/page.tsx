import Hero from '../components/hero/hero'
import Sidebar from '../components/ui/sidebar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  // Vérifier la session côté serveur et rediriger vers /dashboard si connecté
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // utilisateur connecté → redirection vers dashboard
      redirect('/dashboard')
    }
  } catch (err) {
    // En cas d'erreur, on continue et affiche la landing
    console.warn('Server session check failed:', err)
  }

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
