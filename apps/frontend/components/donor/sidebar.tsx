"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
    Drop,
    Card,
    ClipboardText,
    Location,
    Notification,
    Setting2,
    LogoutCurve,
} from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

const navItems = [
    { label: "Ma carte", href: "/donor", icon: Card },
    { label: "Historique", href: "/donor/history", icon: ClipboardText },
    { label: "Centres proches", href: "/donor/centers", icon: Location },
    {label: "Rendez-Vous", href: "/donor/appointments", icon: Card},
    { label: "Notifications", href: "/donor/notifications", icon: Notification },
    { label: "Paramètres", href: "/donor/settings", icon: Setting2 },
];

export function DonorSidebar() {
    const pathname = usePathname();
    const { user, isLoading, deconnexion } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            router.replace('/auth/signin');
        } else if (user.role !== 'donneur') {
            // Send non-donors to their own dashboard, not /console
            if (user.role === 'infirmier' || user.role === 'medecin' || user.role === 'admin_hopital') {
                router.replace('/hospital');
            } else if (user.role === 'super_admin') {
                router.replace('/console/donors');
            } else {
                router.replace('/auth/signin');
            }
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        await deconnexion();
        router.push("/auth/signin")
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                        <Drop size={18} color="white" variant="Bold" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">eBloodSys</p>
                        <p className="text-xs text-gray-400">Espace Donneur</p>
                    </div>
                </div>
            </div>

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

            <div className="px-3 py-4 border-t border-gray-100 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2.5">
                    <img
                        src={user?.photoProfil || "https://placehold.net/avatar-5.svg"}
                        alt={user?.nomComplet || "Avatar"}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.net/avatar-5.svg"; }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                            {user?.nomComplet || user?.email}
                        </p>
                        <p className="text-xs text-gray-400">Donneur  {user?.estActif ? 'Actif' : 'Inactif'}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogoutCurve size={18} />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}