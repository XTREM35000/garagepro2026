"use client"

import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const inputVariants = {
  focused: { scale: 1.02, boxShadow: "0 0 0 2px rgba(2, 132, 199, 0.3)" },
}

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

const alertVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, height: 0 },
}

export default function LoginForm() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const router = useRouter()
  const { signIn } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const result = await signIn(email, password)
      setSuccess("✅ Connexion réussie ! Redirection...")
      await new Promise((r) => setTimeout(r, 1200))
      router.push("/dashboard/agents")
    } catch (err: any) {
      setError(err?.message || "Erreur de connexion")
      setIsSubmitting(false)
    }
  }

  const calcStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strength = calcStrength(password)

  return (
    <motion.form
      ref={formRef}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {error && (
        <motion.div
          className="text-sm text-red-600 bg-red-50 rounded p-2"
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          className="text-sm text-green-600 bg-green-50 rounded p-2"
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {success}
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <motion.input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-0"
          variants={inputVariants}
          whileFocus="focused"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Mot de passe</label>
        <div className="relative">
          <motion.input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-0"
            variants={inputVariants}
            whileFocus="focused"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>

        <div className="mt-2 h-2 w-full bg-gray-200 rounded-xl overflow-hidden">
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
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-xl bg-sky-600 text-white font-bold shadow-lg hover:bg-sky-700 disabled:opacity-50"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </motion.button>
    </motion.form>
  )
}
