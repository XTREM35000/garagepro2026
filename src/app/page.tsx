import LandingPage from './landing/LandingPage'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  // Vérifier la session côté serveur et rediriger vers /dashboard si connecté
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      redirect('/dashboard')
    }
  } catch (err) {
    console.warn('Server session check failed:', err)
  }

  return <LandingPage />
}
