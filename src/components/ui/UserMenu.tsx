"use client";

import React, { Fragment, useEffect, useState } from "react";
import Image from 'next/image'
import { Menu, Transition } from "@headlessui/react";
import { User, Settings, LogOut, Users, Image as ImageIcon, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  rolesAllowed: string[]; // array des rôles qui peuvent voir cette option
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Profil", icon: <User size={18} />, href: "/profile", rolesAllowed: ["viewer", "technicien", "caissier", "agent_photo", "comptable", "admin", "super_admin"] },
  { label: "Paramètres", icon: <Settings size={18} />, href: "/tenant/settings", rolesAllowed: ["admin", "super_admin"] },
  { label: "Gestion Agents", icon: <Users size={18} />, href: "/dashboard/agents", rolesAllowed: ["admin", "super_admin"] },
  { label: "Photos Véhicules", icon: <ImageIcon size={18} />, href: "/dashboard/photos_vehicules", rolesAllowed: ["agent_photo", "admin", "super_admin"] },
  { label: "Caisse", icon: <CreditCard size={18} />, href: "/dashboard/caisse", rolesAllowed: ["caissier", "admin", "super_admin"] },
  { label: "Factures", icon: <FileText size={18} />, href: "/dashboard/factures", rolesAllowed: ["comptable", "admin", "super_admin"] },
  { label: "Déconnexion", icon: <LogOut size={18} />, onClick: undefined, rolesAllowed: ["viewer", "technicien", "caissier", "agent_photo", "comptable", "admin", "super_admin"] },
];

export default function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/auth/user/${user.id}`);
        if (res.ok) setProfile(await res.json());
      } catch { }
    };
    void loadProfile();
  }, [user?.id]);

  const initials = (profile?.name || user?.user_metadata?.full_name || user?.name || user?.email || "U")
    .toString()
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("");

  const role = profile?.role || user?.user_metadata?.role || "viewer";

  const handleClick = (item: MenuItem) => {
    if (item.onClick) item.onClick();
    else if (item.href) router.push(item.href);
    else if (item.label === "Déconnexion") {
      void signOut().then(() => router.push("/auth"));
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={motion.button} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-200 transition">
        {profile?.avatarUrl || profile?.avatar_url || user?.user_metadata?.avatarUrl || user?.user_metadata?.avatar_url ? (
          <Image
            src={profile?.avatarUrl || profile?.avatar_url || user?.user_metadata?.avatarUrl || user?.user_metadata?.avatar_url || '/placeholder.svg'}
            alt={profile?.name || user?.user_metadata?.full_name || user?.email || 'avatar'}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover border-2 border-green-500"
          />
        ) : (
          <div className="h-9 w-9 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">{initials}</div>
        )}
        <span className="hidden sm:block text-sm font-semibold text-gray-700">{profile?.name || user?.user_metadata?.full_name || user?.email || "Utilisateur"}</span>
      </Menu.Button>

      <Transition as={Fragment} enter="transition duration-150" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
        <Menu.Items className="absolute right-0 mt-3 w-60 bg-white/80 backdrop-blur-xl shadow-xl border rounded-2xl py-2 z-50">
          {MENU_ITEMS.filter(item => item.rolesAllowed.includes(role)).map((item, idx) => (
            <Menu.Item key={idx}>
              {({ active }) => (
                <button
                  onClick={() => handleClick(item)}
                  className={`flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl ${active ? "bg-gray-100" : ""} ${item.label === "Déconnexion" ? "text-red-600" : ""}`}
                >
                  {item.icon} {item.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
