"use client";

import { useState } from "react";
import clsx from "clsx";
import {
    Drop,
    Warning2,
    Award,
    Brodcast,
    TickCircle,
} from "iconsax-reactjs";
import { Button } from "@heroui/react";

type NotifType = "eligible" | "urgent" | "badge" | "campaign" | "confirm";

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

interface TypeConfig {
    icon: any;
    bg: string;
    iconColor: string;
    label: string;
}

const typeConfig: { [key in NotifType]: TypeConfig } = {
    eligible: {
        icon: Drop,
        bg: "bg-green-50",
        iconColor: "#16a34a",
        label: "Éligibilité",
    },
    urgent: {
        icon: Warning2,
        bg: "bg-red-50",
        iconColor: "#dc2626",
        label: "Urgence",
    },
    badge: {
        icon: Award,
        bg: "bg-purple-50",
        iconColor: "#7c3aed",
        label: "Badge",
    },
    campaign: {
        icon: Brodcast,
        bg: "bg-blue-50",
        iconColor: "#2563eb",
        label: "Campagne",
    },
    confirm: {
        icon: TickCircle,
        bg: "bg-gray-50",
        iconColor: "#16a34a",
        label: "Confirmation",
    },
};

const filters = ["Toutes", "Urgences", "Éligibilité", "Badges", "Campagnes"];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function NotificationsList({
    notifications,
}: {
    notifications: Notification[];
}) {
    const [activeFilter, setActiveFilter] = useState("Toutes");
    const [items, setItems] = useState(notifications);

    const filtered = items.filter((n) => {
        if (activeFilter === "Toutes") return true;
        if (activeFilter === "Urgences") return n.type === "urgent";
        if (activeFilter === "Éligibilité") return n.type === "eligible";
        if (activeFilter === "Badges") return n.type === "badge";
        if (activeFilter === "Campagnes") return n.type === "campaign";
        return true;
    });

    const markRead = (id: string) => {
        setItems((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <div className="space-y-4">

            <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                    <Button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            activeFilter === f
                                ? "bg-red-600 text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
                        )}
                    >
                        {f}
                    </Button>
                ))}
            </div>


            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        Aucune notification dans cette catégorie
                    </div>
                )}

                {filtered.map((notif) => {
                    const config = typeConfig[notif.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={notif.id}
                            onClick={() => markRead(notif.id)}
                            className={clsx(
                                "flex gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm",
                                notif.read
                                    ? "bg-white border-gray-100"
                                    : "bg-white border-red-100 ring-1 ring-red-50"
                            )}
                        >

                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                    config.bg
                                )}
                            >
                                <Icon size={18} color={config.iconColor} variant="Bold" />
                            </div>


                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {!notif.read && (
                                                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                                            )}
                                            <p className="text-sm font-semibold text-gray-900">
                                                {notif.title}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400">
                                        {formatDate(notif.date)}
                                    </span>
                                    <span className="text-gray-200">·</span>
                                    <span
                                        className={clsx(
                                            "text-xs font-medium px-2 py-0.5 rounded-full",
                                            config.bg
                                        )}
                                        style={{ color: config.iconColor }}
                                    >
                                        {config.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}