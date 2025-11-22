"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@/types/supabase'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUser?: (data: { firstName?: string; lastName?: string; avatarUrl?: string | null; email?: string; password?: string }) => Promise<any>
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { },
  signUp: async () => { },
  signOut: async () => { },
  updateUser: async () => ({}),
})

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Vérifie la session initiale
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        // map Supabase SDK user to our AuthUser shape
        const u = session?.user
        if (u) {
          const mapped = {
            id: u.id,
            email: u.email ?? null,
            name: (u.user_metadata as any)?.full_name ?? (u as any).user_metadata?.full_name ?? null,
            role: (u.user_metadata as any)?.role ?? (u as any).role ?? undefined,
            app_metadata: (u as any).app_metadata ?? null,
            user_metadata: (u as any).user_metadata ?? null,
          }
          setUser(mapped)
        } else {
          setUser(null)
        }
        setLoading(false)
      } catch (err) {
        console.error('Session check failed:', err)
        setLoading(false)
      }
    }

    void checkSession()

    // Écoute les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const u = (session as any)?.user
      if (u) {
        const mapped = {
          id: u.id,
          email: u.email ?? null,
          name: (u.user_metadata as any)?.full_name ?? (u as any).user_metadata?.full_name ?? null,
          role: (u.user_metadata as any)?.role ?? (u as any).role ?? undefined,
          app_metadata: (u as any).app_metadata ?? null,
          user_metadata: (u as any).user_metadata ?? null,
        }
        setUser(mapped)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('[AuthContext] 🔵 signIn called with email:', email)
      setLoading(true)
      console.log('[AuthContext] loading set to true')

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log('[AuthContext] Supabase.auth.signInWithPassword response - error:', error)

      if (error) {
        console.error('[AuthContext] ❌ Supabase error:', error.message)
        throw error
      }
      console.log('[AuthContext] ✅ signIn successful')
    } catch (err) {
      console.error('[AuthContext] ❌ signIn failed:', err)
      throw err
    } finally {
      console.log('[AuthContext] finally: setting loading to false')
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateUser = async (data: { firstName?: string; lastName?: string; avatarUrl?: string | null; email?: string; password?: string }) => {
    if (!user?.id) return { error: 'Not authenticated' }
    setLoading(true)
    try {
      // Update Prisma user (name, avatar)
      const body: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
      }

      const res = await fetch(`/api/auth/user/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        return { error: json?.error || `Failed to update user (${res.status})` }
      }

      const updated = await res.json()

      // Try to update Supabase auth user metadata and credentials so session reflects changes
      let supErrorMsg: string | null = null
      try {
        const supPayload: any = { data: { full_name: updated.name ?? undefined, avatarUrl: updated.avatarUrl ?? undefined } }
        if (data.email) supPayload.email = data.email
        if (data.password) supPayload.password = data.password

        const { error: supError } = await supabase.auth.updateUser(supPayload)
        if (supError) {
          console.warn('[auth-context] supabase updateUser error', supError)
          supErrorMsg = supError.message
        }
      } catch (e: any) {
        console.error('[auth-context] supabase updateUser threw', e)
        supErrorMsg = e?.message || 'Supabase update failed'
      }

      // update local user state immediately so UI reflects changes without a full reload
      setUser((prev) => ({ ...(prev as any), name: updated.name ?? prev?.name, avatarUrl: updated.avatarUrl ?? prev?.avatarUrl }))

      return supErrorMsg ? { ok: true, user: updated, warning: supErrorMsg } : { ok: true, user: updated }
    } catch (err: any) {
      console.error('[auth-context] updateUser error', err)
      return { error: err?.message || 'Update failed' }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}