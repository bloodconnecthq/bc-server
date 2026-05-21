"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Chart2,
  Drop,
  Notification,
  Setting2,
  LogoutCurve,
  Hospital,
  ClipboardText,
} from "iconsax-reactjs";

const navItems = [
  {
    label: "Tableau de bord",
    href: "/hospital",
    icon: Chart2,
  },
  {
    label: "Stocks sanguins",
    href: "/hospital/stocks",
    icon: Drop,
  },
  {
    label: "Dons enregistrés",
    href: "/hospital/donations",
    icon: ClipboardText,
  },
  {
    label: "Alertes",
    href: "/hospital/alerts",
    icon: Notification,
  },
  {
    label: "Paramètres",
    href: "/hospital/settings",
    icon: Setting2,
  },
];

export function HospitalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <Drop size={18} color="white" variant="Bold" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Blood-Connect</p>
            <p className="text-xs text-gray-400">Espace Hôpital</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-red-50 text-red-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                size={18}
                variant={isActive ? "Bold" : "Linear"}
                color={isActive ? "#dc2626" : "currentColor"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Hospital size={14} color="#dc2626" variant="Bold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">CHU de Cotonou</p>
            <p className="text-xs text-gray-400">Administrateur</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogoutCurve size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}