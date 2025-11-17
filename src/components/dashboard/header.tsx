"use client"

import React from 'react'
import UserMenu from './user-menu'

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white border-b px-6 h-16">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 md:hidden">☰</button>
        <div className="text-lg font-bold">SaaS Manager</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm text-gray-600">Demo Tenant</div>
        <UserMenu name="Super Admin" avatarUrl={null} />
      </div>
    </header>
  )
}
