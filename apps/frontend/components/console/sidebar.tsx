"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Chart2,
  Hospital,
  People,
  Drop,
  Brodcast,
  DocumentText,
  Setting2,
  LogoutCurve,
  ShieldTick,
  ClipboardText,
} from "iconsax-reactjs";

const navItems = [
  { label: "Vue d'ensemble", href: "/console", icon: Chart2 },
  { label: "Hôpitaux & Centres", href: "/console/hospitals", icon: Hospital },
  { label: "Demandes d'accès", href: "/console/members", icon: ShieldTick, badge: 3 },
  { label: "Stocks nationaux", href: "/console/stocks", icon: Drop },
  // { label: "Campagnes", href: "/console/campaigns", icon: Brodcast },
  { label: "Donneurs", href: "/console/donors", icon: People },
  { label: "Poches de sang", href: "/console/donations", icon: ClipboardText },
  { label: "Rapports", href: "/console/reports", icon: DocumentText },
];

export function ConsoleSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <Drop size={18} color="white" variant="Bold" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Blood-Connect</p>
            <p className="text-xs text-gray-400">Console CNTS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/console"
              ? pathname === "/console"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon
                size={18}
                variant={isActive ? "Bold" : "Linear"}
                color="currentColor"
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <Link
          href="/console/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <Setting2 size={18} />
          Paramètres
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
            <ShieldTick size={14} color="#f87171" variant="Bold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Super Admin</p>
            <p className="text-xs text-gray-500">CNTS Bénin</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900 hover:text-red-400 transition-all">
          <LogoutCurve size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}