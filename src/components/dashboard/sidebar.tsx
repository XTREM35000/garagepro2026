"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/lib/auth-context";
import { mockReceptions } from '@/lib/mocks_reception';

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
  Home,
  BarChart3,
  Inbox,
  Clock,
  TrendingUp,
  AlertCircle,
  Truck,
  DollarSign,
  PlusSquare,
} from "lucide-react";

/* ---------------------------------------------
   GROUP COLORS - CONTRASTE FORT entre groupes
----------------------------------------------*/
const groupColors: Record<string, string> = {
  "Accueil": "from-emerald-500 to-emerald-700",           // VERT
  "Réception": "from-blue-500 to-blue-700",               // BLEU 
  "Atelier": "from-orange-500 to-orange-700",             // ORANGE
  "Interventions": "from-purple-500 to-purple-700",       // VIOLET
  "Stock": "from-indigo-500 to-indigo-700",               // INDIGO
  "Facturation": "from-amber-500 to-amber-700",           // JAUNE/OR
  "Administration": "from-rose-500 to-rose-700",          // ROSE
};

/* ---------------------------------------------
   MENU STRUCTURE - Groupes scindés + titres courts
----------------------------------------------*/
const groupedNav = [
  {
    group: "Accueil",
    color: groupColors["Accueil"],
    items: [
      { key: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard, href: "/dashboard", roles: [] },
      { key: "overview", label: "Vue Atelier", icon: BarChart3, href: "/dashboard/overview", roles: [] },
    ],
  },
  {
    group: "Réception",
    color: groupColors["Réception"],
    items: [
      { key: "reception", label: "Réception", icon: Inbox, href: "/dashboard/reception", roles: [] },
      { key: "reception_new", label: "Nouvelle réception", icon: PlusSquare, href: "/dashboard/reception/nouveau", roles: [] },
      { key: "clients", label: "Clients", icon: Users, href: "/dashboard/clients", roles: [] },
      { key: "photos", label: "Photos", icon: Camera, href: "/dashboard/photos_vehicules", roles: [] },
    ],
  },
  {
    group: "Atelier",
    color: groupColors["Atelier"],
    items: [
      { key: "file-attente", label: "File Attente", icon: Clock, href: "/dashboard/atelier/file-attente", roles: [] },
      { key: "en-cours", label: "En Cours", icon: Wrench, href: "/dashboard/atelier/en-cours", roles: [] },
      { key: "termines", label: "Terminés", icon: ClipboardList, href: "/dashboard/atelier/termines", roles: [] },
    ],
  },
  {
    group: "Interventions",
    color: groupColors["Interventions"],
    items: [
      { key: "interventions", label: "Interventions", icon: Wrench, href: "/dashboard/interventions", roles: [] },
      { key: "planning", label: "Planning", icon: Clock, href: "/dashboard/interventions/planning", roles: [] },
      { key: "historique", label: "Historique", icon: TrendingUp, href: "/dashboard/interventions/historique", roles: [] },
    ],
  },
  {
    group: "Stock",
    color: groupColors["Stock"],
    items: [
      { key: "stock", label: "Stock Pièces", icon: Package, href: "/dashboard/stock", roles: [] },
      { key: "commandes", label: "Commandes", icon: Truck, href: "/dashboard/stock/commandes", roles: [] },
      { key: "alertes", label: "Alertes", icon: AlertCircle, href: "/dashboard/stock/alertes", roles: [] },
    ],
  },
  {
    group: "Facturation",
    color: groupColors["Facturation"],
    items: [
      { key: "facturation", label: "Facturation", icon: FileText, href: "/dashboard/facturation", roles: [] },
      { key: "caisse", label: "Caisse", icon: Wallet, href: "/dashboard/caisse", roles: [] },
      { key: "factures", label: "Factures", icon: DollarSign, href: "/dashboard/factures", roles: [] },
    ],
  },
  {
    group: "Administration",
    color: groupColors["Administration"],
    items: [
      { key: "equipe", label: "Équipe", icon: Users, href: "/dashboard/equipe", roles: ["admin", "super_admin"] },
      { key: "parametres", label: "Paramètres", icon: Settings, href: "/tenant/settings", roles: ["super_admin", "admin"] },
      { key: "super-admin", label: "Super Admin", icon: ShieldCheck, href: "/dashboard/super", roles: ["super_admin"] },
    ],
  },
];

/* ---------------------------------------------
   COMPONENT
----------------------------------------------*/
export default function Sidebar({ openMobile: openMobileProp, setOpenMobile: setOpenMobileProp }: { openMobile?: boolean; setOpenMobile?: (v: boolean) => void } = {}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [internalOpenMobile, setInternalOpenMobile] = useState(false);

  const userRole = (user as any)?.role || "VIEWER";

  const canViewItem = (item: any) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  };

  const openMobile = typeof openMobileProp === 'boolean' ? openMobileProp : internalOpenMobile
  const setOpenMobile = setOpenMobileProp ?? setInternalOpenMobile

  React.useEffect(() => {
    if (setOpenMobileProp) return
    const handler = () => setInternalOpenMobile(true);
    document.addEventListener("open-mobile-sidebar", handler);
    return () => document.removeEventListener("open-mobile-sidebar", handler);
  }, [setOpenMobileProp]);

  React.useEffect(() => {
    if (!openMobile) return;
    setOpenMobile(false);
  }, [pathname, openMobile, setOpenMobile]);

  /* ----------- ICON 3D EFFECT ----------- */
  const icon3D = {
    initial: { rotateX: 0, rotateY: 0 },
    whileHover: { rotateX: 15, rotateY: -15, scale: 1.12 },
    transition: { type: "spring", stiffness: 220 },
  };

  /* ----------- RENDER ITEM ----------- */
  const renderItem = (item: any, group: any) => {
    const Icon = item.icon;
    const active = pathname?.startsWith(item.href);
    const receptionCount = mockReceptions.filter((r: any) => r.statut === 'EN_COURS').length;

    return (
      <Link key={item.key} href={item.href} onClick={() => setOpenMobile(false)}>
        <motion.div
          whileHover={{ scale: 1.03, x: 5 }}
          whileTap={{ scale: 0.97 }}
          className={`
            flex items-center gap-3 
            px-3 py-2 rounded-xl cursor-pointer 
            transition-all 
            ${active
              ? `bg-gradient-to-r ${group.color} text-white`
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
          `}
        >
          {/* ICON 3D */}
          <motion.div
            {...icon3D}
            className={`
              w-9 h-9 flex items-center justify-center 
              rounded-xl 
              ${active
                ? "bg-white/20 text-white"
                : `bg-gradient-to-tr ${group.color} text-white`
              }
            `}
          >
            <Icon size={20} strokeWidth={2.0} />
          </motion.div>

          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-sm tracking-wide min-w-0 truncate"
            >
              {item.label}
            </motion.span>
          )}
          {!collapsed && item.key === 'reception' && receptionCount > 0 && (
            <div className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-600 text-white">{receptionCount}</div>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <aside
        className={`
          hidden md:flex flex-col h-screen border-r shadow-2xl
          bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl
          transition-all duration-300
          ${collapsed ? "w-28" : "w-[240px]"}
        `}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b">
          <AnimatedLogoGarage size={36} animated showText={!collapsed} />
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto"> {/* Reduced space between groups */}
          {groupedNav.map((group) => (
            <div key={group.group} className="space-y-2">
              {/* Titre du groupe - PLUS COURT */}
              {!collapsed && (
                <div className="px-2 pb-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                  {group.group}
                </div>
              )}

              {/* Liste des items */}
              <div className="space-y-1"> {/* Reduced space between items */}
                {group.items.filter(canViewItem).map((item) => renderItem(item, group))}
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
              className="fixed top-0 left-0 h-full w-full max-w-[80vw] sm:w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", stiffness: 240 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">Menu</div>
                </div>
                <button onClick={() => setOpenMobile(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X />
                </button>
              </div>

              {/* Items */}
              <nav className="space-y-4"> {/* Reduced space on mobile too */}
                {groupedNav.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <div className="text-xs font-bold text-gray-500 uppercase px-2 truncate">{group.group}</div>
                    <div className="space-y-1"> {/* Reduced space between items */}
                      {group.items.filter(canViewItem).map((item) => renderItem(item, group))}
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