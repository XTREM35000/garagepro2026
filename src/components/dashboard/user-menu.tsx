"use client"

import React from 'react'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function UserMenu({ name, avatarUrl }: { name?: string | null; avatarUrl?: string | null }) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (err) {
      console.error('Sign out failed', err)
      // still redirect to auth page to clear local UI state
      router.push('/auth')
    }
  }

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="flex items-center gap-2 p-1 rounded hover:bg-gray-100">
          <img src={avatarUrl || '/avatar-placeholder.png'} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
          <span className="hidden sm:block text-sm font-medium">{name || 'Utilisateur'}</span>
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-1">
          <Menu.Item>
            {({ active }) => (
              <a className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`} href="/profile">Profil</a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`} href="/tenant/settings">Paramètres</a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={handleSignOut} className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>Se déconnecter</button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}
