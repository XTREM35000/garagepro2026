"use client"

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'

const inputVariants = {
  focused: { scale: 1.02, boxShadow: "0 0 0 2px rgba(2, 132, 199, 0.2)" },
}

const buttonVariants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
}

const errorVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, height: 0 },
}

export default function LoginForm() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn(email, password)
      // show success and redirect
      try {
        router.push('/dashboard')
      } catch (_) {
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err?.message || String(err) || 'Erreur de connexion')
      // fallback: alert
      // alert(err?.message || String(err) || 'Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleButtonClick = () => {
    console.log('[LoginForm] ✅ handleButtonClick called, isSubmitting=', isSubmitting)
    console.log('[LoginForm] formRef.current:', formRef.current)

    if (formRef.current) {
      try {
        console.log('[LoginForm] Form ref exists, attempting submit...')
        // requestSubmit will trigger form validation and submit event if available
        const current = formRef.current as HTMLFormElement & { requestSubmit?: () => void } | null
        if (current) {
          console.log('[LoginForm] current form element exists')
          if (typeof current.requestSubmit === 'function') {
            console.log('[LoginForm] ✅ Using requestSubmit method')
            current.requestSubmit()
          } else {
            console.log('[LoginForm] ⚠️ requestSubmit not available, using dispatchEvent')
            const event = new Event('submit', { bubbles: true, cancelable: true })
            current.dispatchEvent(event)
            console.log('[LoginForm] ✅ Submit event dispatched')
          }
        } else {
          console.warn('[LoginForm] ❌ current is null')
        }
      } catch (err) {
        console.error('[LoginForm] ❌ Error during submit attempt:', err)
        // As a last resort call onSubmit directly with a fake event
        console.log('[LoginForm] Calling onSubmit directly as fallback')
        void onSubmit({ preventDefault: () => { } } as unknown as React.FormEvent)
      }
    } else {
      console.warn('[LoginForm] ❌ formRef.current is null, cannot submit')
    }
  }

  function calcStrength(pw: string) {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score // 0..4
  }

  const onPasswordChange = (val: string) => {
    setPassword(val)
    setStrength(calcStrength(val))
  }

  return (
    <motion.form
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {error && (
        <motion.div
          className="text-sm text-red-600 bg-red-50 p-3 rounded"
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {error}
        </motion.div>
      )}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <motion.input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-0"
          variants={inputVariants}
          whileFocus="focused"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <div className="relative">
          <motion.input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-0"
            variants={inputVariants}
            whileFocus="focused"
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

        <div className="mt-2">
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className={`h-2 rounded transition-all ${strength === 0
                ? 'w-0'
                : strength === 1
                  ? 'w-1/4 bg-red-500'
                  : strength === 2
                    ? 'w-2/4 bg-yellow-400'
                    : strength === 3
                      ? 'w-3/4 bg-emerald-400'
                      : 'w-full bg-emerald-600'
                }`}
              style={{}}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {strength === 0
              ? 'Mot de passe trop court'
              : strength === 1
                ? 'Faible'
                : strength === 2
                  ? 'Correct'
                  : strength === 3
                    ? 'Bon'
                    : 'Fort'}
          </p>
        </div>
      </div>
      <div className="pt-2">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded bg-sky-600 px-4 py-2.5 text-white font-medium disabled:opacity-60 transition-colors hover:bg-sky-700"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleButtonClick}
        >
          {isSubmitting ? (
            <motion.svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </motion.svg>
          ) : null}
          {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
        </motion.button>
      </div>
    </motion.form>
  )
}
