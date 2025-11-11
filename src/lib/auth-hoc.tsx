import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import type { AuthUser } from '@/types/supabase'

interface WithAuthProps {
  user: AuthUser
}

type LoadingSpinnerProps = {
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => (
  <div className="flex h-screen items-center justify-center">
    <div className={`h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900 ${className}`} />
  </div>
)

// HOC pour protéger les routes qui nécessitent l'authentification
export function withAuth<T extends object>(
  Component: React.ComponentType<T & WithAuthProps>
): React.FC<T> {
  return function WithAuth(props: T): JSX.Element | null {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/auth')
      }
    }, [loading, user, router])

    if (loading) {
      return <LoadingSpinner />
    }

    if (!user) {
      return null
    }

    return <Component {...props} user={user} />
  }
}

type UserRole = 'admin' | 'user' | 'premium'

interface WithRoleProps extends WithAuthProps {
  role: UserRole
}

// HOC pour les routes qui nécessitent un rôle spécifique
export function withRole<T extends object>(
  Component: React.ComponentType<T & WithRoleProps>,
  allowedRoles: UserRole[]
): React.FC<T> {
  return function WithRole(props: T): JSX.Element | null {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && (!user || !user.app_metadata?.role || !allowedRoles.includes(user.app_metadata.role as UserRole))) {
        router.replace('/')
      }
    }, [loading, user, router])

    if (loading) {
      return <LoadingSpinner />
    }

    if (!user || !user.app_metadata?.role || !allowedRoles.includes(user.app_metadata.role as UserRole)) {
      return null
    }

    return <Component {...props} user={user} role={user.app_metadata.role as UserRole} />
  }
}
