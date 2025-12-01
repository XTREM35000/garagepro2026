import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">404 — Page introuvable</h1>
      <p className="mt-3">La page que vous cherchez est introuvable.</p>
      <Link href="/" className="mt-4 text-sky-600">Retour à l&#39;accueil</Link>
    </div>
  )
}
