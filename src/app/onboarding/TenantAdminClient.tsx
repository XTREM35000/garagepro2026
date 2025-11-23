"use client"
import React from 'react'
import TenantAdminForm from '@/app/setup/tenant-admin-form'
import { useRouter } from 'next/navigation'

export default function TenantAdminClient() {
  const router = useRouter()

  return (
    <div className="max-w-md w-full">
      <TenantAdminForm onSuccess={() => router.push('/auth')} />
    </div>
  )
}
