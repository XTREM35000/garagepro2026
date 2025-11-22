"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import {
  Menu,
  LayoutDashboard,
  Wrench,
  PackageSearch,
  FileText,
  Camera,
  Users,
  Settings,
  Shield,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet,
  CreditCard,
  DollarSign,
  Globe,
  Box,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";

/* ───────────────────────── NAVIGATION GROUPS ───────────────────────── */

const groupedNav = [
  {
    group: "Général",
    items: [
      {
        key: "dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
    ],
  },
  {
    group: "Atelier",
    items: [
      {
        key: "interventions",
        label: "Interventions",
        icon: Wrench,
        href: "/dashboard/interventions",
      },
      {
        key: "atelier",
        label: "Atelier",
        icon: PackageSearch,
        href: "/dashboard/atelier",
      },
      {
        key: "stock",
        label: "Stock",
        icon: PackageSearch,
        href: "/dashboard/stock",
      },
      {
        key: "photos",
        label: "Photos véhicules",
        icon: Camera,
        href: "/dashboard/photos",
      },
    ],
  },
  {
    group: "Facturation",
    items: [
      {
        key: "factures",
        label: "Facturation",
        icon: FileText,
        href: "/dashboard/facturation",
      },
      {
        key: "caisse",
        label: "Caisse",
        icon: Wallet,
        href: "/dashboard/caisse",
      },
    ],
  },
  {
    group: "CRM",
    items: [
      {
        key: "clients",
        label: "Clients",
        icon: Users,
        href: "/dashboard/clients",
      },
    ],
  },
  {
    group: "Administration",
    items: [
      {
        key: "settings",
        label: "Paramètres",
        icon: Settings,
        href: "/tenant/settings",
      },
      {
        key: "admin",
        label: "Administration",
        icon: Settings,
        href: "/dashboard/admin",
      },
      {
        key: "super",
        label: "Super Admin",
        icon: ShieldCheck,
        href: "/dashboard/super",
      },
    ],
  },
];

/* ───────────────────────── COMPONENT ───────────────────────── */

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const renderItem = (item: any) => {
    const active = pathname?.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link key={item.key} href={item.href}>
        <motion.div
          whileHover={{ x: 4 }}
          className={`
            group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all
            ${active
              ? "bg-green-600 text-white shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/50"
            }
          `}
        >
          <div
            className={`
              flex items-center justify-center w-9 h-9 rounded-xl transition
              ${active
                ? "bg-white/20"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }
            `}
          >
            <Icon size={18} />
          </div>

          {!collapsed && (
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          )}
        </motion.div>
      </Link>
    );
  };

  /* ───────────────────────── RENDER ───────────────────────── */

  return (
    <>
      {/* TOPBAR MOBILE */}
      <div className="md:hidden flex items-center justify-between bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b px-4 py-2 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <AnimatedLogoGarage size={36} animated showText={false} />
          <span className="font-semibold text-gray-800 dark:text-gray-100">Garage</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="toggle-theme"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          <button
            aria-label="open-menu"
            onClick={() => setOpenMobile(true)}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* SIDEBAR DESKTOP */}
      <aside
        className={`
          hidden md:flex flex-col h-screen border-r shadow-lg 
          bg-white/70 dark:bg-gray-900/70 backdrop-blur 
          transition-all duration-300
          ${collapsed ? "w-[90px]" : "w-[260px]"}
        `}
      >
        {/* LOGO + COLLAPSE BTN */}
        <div className="p-4 flex items-center justify-between border-b">
          <AnimatedLogoGarage size={42} animated showText={!collapsed} />

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {groupedNav.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <div className="px-2 pb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {group.group}
                </div>
              )}

              <div className="space-y-1">{group.items.map((item) => renderItem(item))}</div>
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={toggleTheme}
            className="
              w-full flex items-center gap-3 px-3 py-2 rounded-xl
              bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            <Shield size={18} />
            {!collapsed && (
              <span className="text-sm flex-1">Thème : {theme === "dark" ? "Sombre" : "Clair"}</span>
            )}
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {openMobile && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMobile(false)}
            />

            <motion.aside
              className="
                fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900
                shadow-xl z-50 p-5 flex flex-col
              "
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
                {groupedNav.map((group) => (
                  <div key={group.group}>
                    <div className="px-2 pb-1 text-xs font-bold text-gray-500 uppercase">
                      {group.group}
                    </div>

                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.key} href={item.href}>
                            <div
                              className="
                                flex items-center gap-3 px-3 py-2 rounded-xl
                                hover:bg-gray-200 dark:hover:bg-gray-800
                              "
                            >
                              <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <Icon size={18} />
                              </div>

                              <span className="font-medium">{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
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
