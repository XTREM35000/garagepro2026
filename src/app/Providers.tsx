"use client"

import { AuthProvider } from '@/lib/auth-context'
import SplashRoot from './SplashRoot'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SplashRoot>{children}</SplashRoot>
    </AuthProvider>
  )
}
