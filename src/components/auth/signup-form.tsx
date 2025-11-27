"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AvatarUploader from "@/components/auth/avatar-uploader"
import { PhoneInput } from "@/components/ui/PhoneInput"
import { EmailInput } from "@/components/ui/EmailInput"
import { useAuthTab } from "@/lib/auth-tab-context"

export default function SignupForm() {
  const router = useRouter()
  const auth = useAuth()
  const { setActiveTab } = useAuthTab()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calcStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = calcStrength(password)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, avatarUrl }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json?.error || "Erreur inscription")
      } else {
        setMessage("✅ Inscription réussie ! Connexion...")
        // Sign in with the credentials - email_confirm=true allows this without email verification
        await auth.signIn(email, password)
        await new Promise((r) => setTimeout(r, 1200))
        router.push("/dashboard/agents")
      }
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      {message && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{message}</div>}

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Prénom"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
        <input
          type="text"
          placeholder="Nom"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      <AvatarUploader
        value={avatarUrl}
        bucket="avatars"
        upload
        onUpload={(url) => setAvatarUrl(url)}
      />

      <PhoneInput
        value={phone}
        onChange={setPhone}
        label="Téléphone"
        placeholder="123456789"
        required
      />

      <EmailInput
        value={email}
        onChange={setEmail}
        label="Email"
        placeholder="nom.prenom@domain.com"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "👁️" : "🙈"}
        </button>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-xl overflow-hidden">
        <div
          className={`h-2 rounded transition-all ${strength === 0
            ? "w-0"
            : strength === 1
              ? "w-1/4 bg-red-500"
              : strength === 2
                ? "w-1/2 bg-yellow-400"
                : strength === 3
                  ? "w-3/4 bg-green-400"
                  : "w-full bg-green-600"
            }`}
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </motion.button>
    </motion.form>
  )
}
