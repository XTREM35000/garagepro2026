"use client"

import React, { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { User, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function UserMenu() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={motion.button}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-200 transition"
      >
        <img
          src={
            typeof user?.user_metadata?.avatarUrl === "string" && user.user_metadata.avatarUrl
              ? user.user_metadata.avatarUrl
              : typeof user?.user_metadata?.avatar_url === "string" && user.user_metadata.avatar_url
                ? user.user_metadata.avatar_url
                : "/placeholder.svg"
          }
          className="h-9 w-9 rounded-full border-2 border-green-500 object-cover"
        />
        <span className="text-sm font-semibold text-gray-700">
          {user?.email || "Utilisateur"}
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-52 bg-white/80 backdrop-blur-xl shadow-xl border rounded-2xl py-2">
          <Menu.Item>
            {({ active }) => (
              <button onClick={() => router.push("/profile")}
                className={`flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl ${active ? "bg-gray-100" : ""
                  }`}
              >
                <User size={18} /> Profil
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={() => router.push("/settings")}
                className={`flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl ${active ? "bg-gray-100" : ""
                  }`}
              >
                <Settings size={18} /> Paramètres
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={signOut}
                className={`flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 rounded-xl ${active ? "bg-red-50" : ""
                  }`}
              >
                <LogOut size={18} /> Déconnexion
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
