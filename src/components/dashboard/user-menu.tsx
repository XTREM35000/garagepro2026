"use client"

import React from "react"
import { Menu, Transition } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Fragment } from "react"
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

export default function UserMenu({
  name,
  avatarUrl,
  role,
}: {
  name?: string | null
  avatarUrl?: string | null
  role?: string | null
}) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/auth")
    } catch (err) {
      console.error(err)
      router.push("/auth")
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* BUTTON (AVATAR + NAME) */}
      <Menu.Button as={motion.button}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition"
      >
        <div className="relative">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="avatar"
            className="h-9 w-9 rounded-full object-cover border-2 border-[#25D366]"
          />
          {/* Petite pastille de statut vert */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-[#25D366] rounded-full border border-white"></span>
        </div>

        {/* Nom du user (toujours visible) */}
        <span className="text-sm font-semibold text-gray-700">
          {name || "Utilisateur"}
        </span>

        {/* Rôle de l'utilisateur (si présent) */}
        {role && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">
            {role}
          </span>
        )}
      </Menu.Button>

      {/* DROPDOWN MENU */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-3 w-52 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl py-2 z-50"
        >
          {/* OPTION : Profil */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/profile")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-xl transition ${active ? "bg-gray-100" : ""
                  }`}
              >
                <UserIcon className="h-5 w-5 text-gray-600" />
                Profil
              </button>
            )}
          </Menu.Item>

          {/* OPTION : Paramètres */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => router.push("/tenant/settings")}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-xl transition ${active ? "bg-gray-100" : ""
                  }`}
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                Paramètres
              </button>
            )}
          </Menu.Item>

          {/* OPTION : Déconnexion */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 rounded-xl transition ${active ? "bg-red-50" : ""
                  }`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                Déconnexion
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
