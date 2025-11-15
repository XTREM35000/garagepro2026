"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardHome() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page agents par défaut
    console.log('[DashboardHome] Redirecting to /dashboard/agents')
    router.replace('/dashboard/agents')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      <span className="ml-4 text-gray-600">Redirection en cours...</span>
    </div>
  )
}
