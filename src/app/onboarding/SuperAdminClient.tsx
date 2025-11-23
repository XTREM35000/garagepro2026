"use client"
import React from 'react'
import SuperAdminForm from '@/app/setup/super-admin-form'
import { useRouter } from 'next/navigation'

export default function SuperAdminClient() {
  const router = useRouter()

  return (
    <div className="max-w-md w-full">
      <SuperAdminForm onSuccess={() => router.push('/onboarding/tenant-admin')} />
    </div>
  )
}
