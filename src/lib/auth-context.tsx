import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@/types/supabase'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
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
})

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // Vérifie la session initiale
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        // map Supabase SDK user to our AuthUser shape
        const u = session?.user
        setUser(u ? { id: u.id, email: u.email ?? null, app_metadata: (u as any).app_metadata ?? null } : null)
      } catch (err) {
        console.error('Session check failed:', err)
      }
    }

    void checkSession()

    // Écoute les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const u = (session as any)?.user
      setUser(u ? { id: u.id, email: u.email ?? null, app_metadata: u.app_metadata ?? null } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
  }

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
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