import React from 'react'
import AuthCard from '@/components/auth/auth-card'

export const metadata = {
  title: 'Auth - SaaS Manager',
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <AuthCard />
    </div>
  )
}

