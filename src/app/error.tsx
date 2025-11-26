"use client"

import React from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-700">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p className="mt-3 text-sm">{error.message}</p>
      <button onClick={() => reset()} className="mt-6 rounded bg-sky-600 px-4 py-2 text-white">Réessayer</button>
    </div>
  )
}
