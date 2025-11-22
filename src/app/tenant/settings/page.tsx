import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BackButton from '@/components/ui/BackButton'
import SettingsForm from '@/components/tenant/SettingsForm'

export default async function TenantSettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  // Debug logs to help trace why session might be missing when rendering this page
  // (visible in the Next.js server console during `npm run dev`).
  // Remove or guard these logs before deploying to production.
  // eslint-disable-next-line no-console
  console.log('[tenant/settings] supabase session:', session)
  // Log cookies available to the server at render time
  try {
    const allCookies = (cookies && typeof cookies === 'function') ? cookies().getAll?.() ?? [] : []
    // eslint-disable-next-line no-console
    console.log('[tenant/settings] request cookies:', allCookies.map(c => ({ name: c.name, value: c.value ? '[redacted]' : '' })))
  } catch (cookieErr) {
    // eslint-disable-next-line no-console
    console.warn('[tenant/settings] could not read cookies for debug:', cookieErr)
  }

  if (!session) {
    // If session missing, render a helpful message instead of force-redirecting.
    // This avoids surprising client-side redirects while we debug auth issues.
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="font-medium text-yellow-800">Vous n'êtes pas connecté.</p>
          <p className="text-sm text-yellow-700 mt-1">Veuillez vous connecter pour accéder aux paramètres de l'instance.</p>
          <div className="mt-3">
            <a href="/auth" className="text-sm text-green-700 underline">Aller à la page de connexion</a>
          </div>
        </div>
      </div>
    )
  }

  const userId = session?.user?.id
  // eslint-disable-next-line no-console
  console.log('[tenant/settings] session userId:', userId)
  if (!userId) redirect('/auth')

  // fetch public.User from Prisma
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="font-medium text-red-800">Utilisateur introuvable</p>
          <p className="text-sm text-red-700 mt-1">Impossible de localiser votre profil — vérifiez votre session.</p>
        </div>
      </div>
    )
  }

  // allow admin and super_admin
  if (!(user.role === 'admin' || user.role === 'super_admin')) {
    // forbidden for non-admins
    redirect('/dashboard')
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <BackButton />

        <div className="mt-4 w-full rounded-3xl overflow-hidden shadow relative h-[300px]">
          <img src="/images/parametre.png" alt="Paramètres" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">Paramètres de l'instance</h1>
              <p className="text-lg md:text-xl text-white/90 mt-2 drop-shadow">Configurez votre instance et les paramètres métier.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <SettingsForm tenant={tenant} />
      </div>
    </div>
  )
}

export const metadata = { title: "Paramètres du tenant" }
