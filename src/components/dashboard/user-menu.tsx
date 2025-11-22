
"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`/api/auth/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data ?? null);
        }
      } catch (err) {
        // ignore
      }
    };
    void loadProfile();
  }, [user?.id]);

  const initials = (profile?.name || user?.user_metadata?.full_name || user?.name || user?.email || "U").toString().split(" ").map((s: string) => s[0]).slice(0, 2).join("");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center gap-3 rounded-full p-1 hover:bg-gray-100">
          {(profile?.avatarUrl || profile?.avatar_url || user?.user_metadata?.avatarUrl || user?.user_metadata?.avatar_url) ? (
            <img
              src={profile?.avatarUrl || profile?.avatar_url || user?.user_metadata?.avatarUrl || user?.user_metadata?.avatar_url || "/placeholder.svg"}
              alt={(profile?.name || user?.user_metadata?.full_name || user?.name || user?.email) ?? 'avatar'}
              className="h-9 w-9 rounded-full object-cover border-2 border-green-500"
            />
          ) : (
            <div className="h-9 w-9 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">
              {initials}
            </div>
          )}

          <span className="hidden sm:block text-sm font-medium text-gray-700">{profile?.name || user?.user_metadata?.full_name || user?.email || "Utilisateur"}</span>
        </Menu.Button>
      </div>

      <Transition as={Fragment} enter="transition ease-out duration-150" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur border rounded-2xl py-2 shadow-xl z-50">
          <Menu.Item>
            {({ active }) => (
              <button onClick={() => router.push("/profile")} className={`flex items-center gap-3 px-4 py-2 w-full text-left ${active ? "bg-gray-100" : ""}`}>
                <UserIcon className="h-5 w-5 text-gray-600" /> Mon profil
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button onClick={() => router.push("/tenant/settings")} className={`flex items-center gap-3 px-4 py-2 w-full text-left ${active ? "bg-gray-100" : ""}`}>
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" /> Paramètres
              </button>
            )}
          </Menu.Item>

          <div className="border-t my-2" />

          <Menu.Item>
            {({ active }) => (
              <button onClick={async () => { await signOut(); router.push("/auth"); }} className={`flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 ${active ? "bg-red-50" : ""}`}>
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" /> Déconnexion
              </button>
            )}
          </Menu.Item>

        </Menu.Items>
      </Transition>
    </Menu>
  );
}
