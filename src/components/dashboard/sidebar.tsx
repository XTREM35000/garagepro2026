"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import { useTheme } from "@/hooks/use-theme";

import {
  LayoutDashboard,
  Wrench,
  Camera,
  FileText,
  Wallet,
  Users,
  Settings,
  ShieldCheck,
  Menu as MenuIcon,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  Package,
} from "lucide-react";

/* ---------------------------------------------
   GROUP COLORS (Très contrastés + visibles)
----------------------------------------------*/
const groupColors: Record<string, string> = {
  Général: "from-emerald-500 to-emerald-700",
  Atelier: "from-blue-500 to-blue-700",
  Facturation: "from-amber-500 to-amber-700",
  CRM: "from-violet-500 to-violet-700",
  Administration: "from-rose-500 to-rose-700",
};

/* ---------------------------------------------
   MENU STRUCTURE (rôles supprimés pour test)
----------------------------------------------*/
const groupedNav = [
  {
    group: "Général",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    ],
  },
  {
    group: "Atelier",
    items: [
      { key: "interventions", label: "Interventions", icon: ClipboardList, href: "/dashboard/interventions" },
      { key: "atelier", label: "Atelier", icon: Wrench, href: "/dashboard/atelier" },
      { key: "stock", label: "Stock", icon: Package, href: "/dashboard/stock" },
      { key: "photos", label: "Photos véhicules", icon: Camera, href: "/dashboard/photos" },
    ],
  },
  {
    group: "Facturation",
    items: [
      { key: "factures", label: "Factures", icon: FileText, href: "/dashboard/facturation" },
      { key: "caisse", label: "Caisse", icon: Wallet, href: "/dashboard/caisse" },
    ],
  },
  {
    group: "CRM",
    items: [
      { key: "clients", label: "Clients", icon: Users, href: "/dashboard/clients" },
    ],
  },
  {
    group: "Administration",
    items: [
      { key: "settings", label: "Paramètres", icon: Settings, href: "/tenant/settings" },
      { key: "super", label: "Super Admin", icon: ShieldCheck, href: "/dashboard/super" },
    ],
  },
];

/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/
export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  /* ----------- ICON 3D EFFECT ----------- */
  const icon3D = {
    initial: { rotateX: 0, rotateY: 0 },
    whileHover: { rotateX: 15, rotateY: -15, scale: 1.12 },
    transition: { type: "spring", stiffness: 220 },
  };

  /* ----------- RENDER ITEM ----------- */
  const renderItem = (item: any, group: string) => {
    const Icon = item.icon;
    const active = pathname?.startsWith(item.href);

    return (
      <Link key={item.key} href={item.href}>
        <motion.div
          whileHover={{ scale: 1.03, x: 5 }}
          whileTap={{ scale: 0.97 }}
          className={`
            flex items-center gap-3 
            px-3 py-2                          /* Hauteur réduite */
            rounded-xl cursor-pointer 
            transition-all 
            shadow-lg 
            border border-black/10 
            ${active
              ? `bg-gradient-to-r ${groupColors[group]} text-white`
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
          `}
        >
          {/* ICON 3D */}
          <motion.div
            {...icon3D}
            className={`
              w-10 h-10                         /* Taille icône plus visible */
              flex items-center justify-center 
              rounded-xl 
              shadow-md shadow-black/40         /* Vraie ombre 3D */
              ${active
                ? "bg-white/20 text-white"
                : `bg-gradient-to-tr ${groupColors[group]} text-white shadow-lg`
              }
            `}
          >
            <Icon size={22} strokeWidth={2.2} />
          </motion.div>

          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-sm tracking-wide"
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      </Link>
    );
  };

  /* ---------------------------------------------
     RETURN
  ----------------------------------------------*/
  return (
    <>
      {/* ---------------- MOBILE TOPBAR ---------------- */}
      <div className="md:hidden flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b px-4 py-2 sticky top-0 z-40">
        <AnimatedLogoGarage size={34} animated showText={false} />

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          <button onClick={() => setOpenMobile(true)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <aside
        className={`
          hidden md:flex flex-col h-screen border-r shadow-2xl
          bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl
          transition-all duration-300
          ${collapsed ? "w-[80px]" : "w-[260px]"}
        `}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b">
          <AnimatedLogoGarage size={40} animated showText={!collapsed} />
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {groupedNav.map((group) => (
            <div key={group.group} className="space-y-2">

              {/* Titre du groupe */}
              {!collapsed && (
                <div className="px-2 pb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {group.group}
                </div>
              )}

              {/* Liste des items */}
              <div className="space-y-3"> {/* ← ← ← ESPACE ENTRE LES OPTIONS */}
                {group.items.map((item) => renderItem(item, group.group))}
              </div>

            </div>
          ))}
        </nav>

        {/* Footer */}
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

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <AnimatePresence>
        {openMobile && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setOpenMobile(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 240 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <AnimatedLogoGarage size={40} animated showText />
                <button onClick={() => setOpenMobile(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X />
                </button>
              </div>

              {/* Items */}
              <nav className="space-y-6">
                {groupedNav.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <div className="text-xs font-bold text-gray-500 uppercase px-2">{group.group}</div>

                    {/* ESPACES SUR MOBILE AUSSI */}
                    <div className="space-y-3">
                      {group.items.map((item) => renderItem(item, group.group))}
                    </div>
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
