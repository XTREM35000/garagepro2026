"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarUploader from '@/components/auth/avatar-uploader'
import { useAuth } from '@/lib/auth-context'
import { useAuthTab } from '@/lib/auth-tab-context'

export default function SignupForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const auth = useAuth()
  const { setActiveTab } = useAuthTab()

  // avatarUrl will be set by AvatarUploader's onUpload callback

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, avatarUrl }),
      })

      const json = await res.json()
      if (!res.ok) {
        console.error('[SignupForm] signup failed:', json?.error)
        setError(json?.error || 'Échec de l\'inscription')
      } else {
        console.log('[SignupForm] signup successful, attempting auto-login')
        setMessage('✅ Inscription réussie ! Connexion en cours...')

        // attempt auto-login via useAuth.signIn for consistency
        try {
          await auth.signIn(email, password)
          console.log('[SignupForm] auto-login succeeded, redirecting to /dashboard/agents')

          // Attendre un peu avant de rediriger
          await new Promise(resolve => setTimeout(resolve, 1500))
          router.push('/dashboard/agents')
        } catch (loginErr) {
          console.warn('[SignupForm] auto-login failed:', loginErr)
          setMessage('✅ Inscription réussie ! Vous pouvez maintenant vous connecter manuellement.')
          // Switch to login tab instead of reloading
          setTimeout(() => {
            setActiveTab('login')
            // Reset form
            setFirstName('')
            setLastName('')
            setEmail('')
            setPassword('')
            setAvatarUrl(null)
            setMessage(null)
          }, 2000)
        }
      }
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {message && <div className="text-sm text-green-600">{message}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar (optionnel)</label>
        <div className="mt-1">
          <AvatarUploader
            value={avatarUrl}
            bucket="avatars"
            upload={true}
            onChange={() => { /* handled internally */ }}
            onUpload={(publicUrl) => setAvatarUrl(publicUrl)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3c-4 0-7 3.5-8 7 1 3.5 4 7 8 7s7-3.5 8-7c-1-3.5-4-7-8-7zM10 13a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4 0-7-3.5-8-7a9.97 9.97 0 012.3-3.68M6.1 6.1L3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères, inclure majuscule, chiffre et symbole pour une meilleure sécurité</p>
      </div>

      <div className="flex items-center justify-between">
        <button type="submit" disabled={loading} className="inline-flex items-center rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Chargement...' : 'S\'inscrire'}
        </button>
      </div>
    </form>
  )
}
