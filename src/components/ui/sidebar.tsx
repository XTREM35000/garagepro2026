"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, X, ChevronLeft, ChevronRight } from "lucide-react";

type SidebarItem = {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
  rolesAllowed: string[];
};

type SidebarGroup = {
  group: string;
  items: SidebarItem[];
};

/* ───────────── DYNAMIQUE & RÔLES ───────────── */
const SIDEBAR_MENU: SidebarGroup[] = [
  {
    group: "Général",
    items: [
      { key: "dashboard", label: "Tableau de bord", icon: AnimatedLogoGarage, href: "/dashboard", rolesAllowed: ["VIEWER", "technicien", "caissier", "agent_photo", "comptable", "TENANT_ADMIN", "SUPER_ADMIN"] },
    ],
  },
  {
    group: "Atelier",
    items: [
      { key: "interventions", label: "Interventions", icon: AnimatedLogoGarage, href: "/dashboard/interventions", rolesAllowed: ["agent_photo", "technicien", "TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "atelier", label: "Atelier", icon: AnimatedLogoGarage, href: "/dashboard/atelier", rolesAllowed: ["TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "stock", label: "Stock", icon: AnimatedLogoGarage, href: "/dashboard/stock", rolesAllowed: ["TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "photos", label: "Photos véhicules", icon: AnimatedLogoGarage, href: "/dashboard/photos", rolesAllowed: ["agent_photo", "TENANT_ADMIN", "SUPER_ADMIN"] },
    ],
  },
  {
    group: "Facturation",
    items: [
      { key: "factures", label: "Facturation", icon: AnimatedLogoGarage, href: "/dashboard/facturation", rolesAllowed: ["comptable", "TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "caisse", label: "Caisse", icon: AnimatedLogoGarage, href: "/dashboard/caisse", rolesAllowed: ["caissier", "TENANT_ADMIN", "SUPER_ADMIN"] },
    ],
  },
  {
    group: "Administration",
    items: [
      { key: "settings", label: "Paramètres", icon: AnimatedLogoGarage, href: "/tenant/settings", rolesAllowed: ["TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "admin", label: "Administration", icon: AnimatedLogoGarage, href: "/dashboard/admin", rolesAllowed: ["TENANT_ADMIN", "SUPER_ADMIN"] },
      { key: "super", label: "Super Admin", icon: AnimatedLogoGarage, href: "/dashboard/super", rolesAllowed: ["SUPER_ADMIN"] },
    ],
  },
];

/* ───────────── COMPONENT ───────────── */

export default function Sidebar({ userRole }: { userRole: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const renderItem = (item: SidebarItem) => {
    if (!item.rolesAllowed.includes(userRole)) return null;
    const active = pathname?.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link key={item.key} href={item.href}>
        <motion.div
          whileHover={{ x: 4 }}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
            ${active ? "bg-green-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/50"}
          `}
        >
          <div
            className={`
              flex items-center justify-center w-9 h-9 rounded-xl transition
              ${active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}
            `}
          >
            <Icon size={18} />
          </div>
          {!collapsed && <span className="font-medium text-sm tracking-wide">{item.label}</span>}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className={`hidden md:flex flex-col h-screen border-r shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur transition-all duration-300 ${collapsed ? "w-[90px]" : "w-[260px]"}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <AnimatedLogoGarage size={42} animated showText={!collapsed} />
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {SIDEBAR_MENU.map((group) => (
            <div key={group.group}>
              {!collapsed && <div className="px-2 pb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{group.group}</div>}
              <div className="space-y-1">{group.items.map(renderItem)}</div>
            </div>
          ))}
        </nav>

        {/* FOOTER THEME */}
        <div className="p-4 border-t">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {!collapsed && <span className="flex-1 text-sm">Thème : {theme === "dark" ? "Sombre" : "Clair"}</span>}
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {openMobile && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenMobile(false)} />
            <motion.aside
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 p-5 flex flex-col"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260 }}
            >
              <div className="flex items-center justify-between mb-6">
                <AnimatedLogoGarage size={40} animated showText />
                <button onClick={() => setOpenMobile(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X />
                </button>
              </div>

              <nav className="space-y-6">
                {SIDEBAR_MENU.map((group) => (
                  <div key={group.group}>
                    <div className="px-2 pb-1 text-xs font-bold text-gray-500 uppercase">{group.group}</div>
                    <div className="space-y-1">{group.items.map(renderItem)}</div>
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
