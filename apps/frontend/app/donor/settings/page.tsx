"use client";

import { useState } from "react";
import clsx from "clsx";
import { User, Lock, Notification, Warning2 } from "iconsax-reactjs";
import { SettingsProfile } from "@/components/donor/settings-profile";
import { SettingsSecurity } from "@/components/donor/settings-security";
import { SettingsNotifications } from "@/components/donor/settings-notifications";
import { SettingsDanger } from "@/components/donor/settings-danger";

const TABS = [
    {
        id: "profil",
        label: "Mon profil",
        description: "Informations personnelles",
        Icon: User,
    },
    {
        id: "securite",
        label: "Sécurité",
        description: "Mot de passe",
        Icon: Lock,
    },
    {
        id: "notifications",
        label: "Notifications",
        description: "Préférences de notification",
        Icon: Notification,
    },
    {
        id: "danger",
        label: "Zone de danger",
        description: "Actions irréversibles",
        Icon: Warning2,
        danger: true,
    },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("profil");

    const activeTabDef = TABS.find((t) => t.id === activeTab)!;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Gérez votre profil et vos préférences
                </p>
            </div>

            <div className="flex gap-6 items-start">
                {/* Left nav */}
                <nav className="w-56 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {TABS.map((tab, i) => {
                        const Icon = tab.Icon;
                        const isActive = activeTab === tab.id;
                        const isDanger = "danger" in tab && tab.danger;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all",
                                    i < TABS.length - 1 && "border-b border-gray-50",
                                    isActive
                                        ? isDanger
                                            ? "bg-red-50"
                                            : "bg-red-50"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                        isActive
                                            ? "bg-red-100"
                                            : "bg-gray-100"
                                    )}
                                >
                                    <Icon
                                        size={16}
                                        variant={isActive ? "Bold" : "Linear"}
                                        color={isActive ? "#dc2626" : "#9ca3af"}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p
                                        className={clsx(
                                            "text-sm font-semibold truncate",
                                            isActive
                                                ? "text-red-600"
                                                : isDanger
                                                    ? "text-gray-700"
                                                    : "text-gray-700"
                                        )}
                                    >
                                        {tab.label}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{tab.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Content */}
                <div className="flex-1 w-full">
                    {/* Section breadcrumb */}
                    <div className="flex items-center gap-2 mb-4">
                        <activeTabDef.Icon size={15} color="#dc2626" variant="Bold" />
                        <span className="text-sm font-semibold text-gray-500">
                            {activeTabDef.label}
                        </span>
                    </div>

                    {activeTab === "profil" && <SettingsProfile />}
                    {activeTab === "securite" && <SettingsSecurity />}
                    {activeTab === "notifications" && <SettingsNotifications />}
                    {activeTab === "danger" && <SettingsDanger />}
                </div>
            </div>
        </div>
    );
}
