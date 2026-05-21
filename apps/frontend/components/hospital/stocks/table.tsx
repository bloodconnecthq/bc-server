"use client";

import { useState } from "react";
import clsx from "clsx";
import { Button } from "@heroui/react";

type StockStatus = "ok" | "low" | "critical";

interface Stock {
    group: string;
    available: number;
    capacity: number;
    lastUpdated: string;
    status: StockStatus;
    expiringIn7Days: number;
}

const statusConfig: { [key in StockStatus]: { label: string; badge: string; bar: string } } = {
    ok: {
        label: "Normal",
        badge: "bg-green-50 text-green-700",
        bar: "bg-green-500",
    },
    low: {
        label: "Faible",
        badge: "bg-amber-50 text-amber-700",
        bar: "bg-amber-500",
    },
    critical: {
        label: "Critique",
        badge: "bg-red-50 text-red-700",
        bar: "bg-red-500",
    },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function StocksTable({ stocks }: { stocks: Stock[] }) {
    const [sortBy, setSortBy] = useState<"group" | "available" | "status">("status");

    const sorted = [...stocks].sort((a, b) => {
        if (sortBy === "available") return a.available - b.available;
        if (sortBy === "status") {
            const order = { critical: 0, low: 1, ok: 2 };
            return order[a.status] - order[b.status];
        }
        return a.group.localeCompare(b.group);
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                    Détail par groupe sanguin
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Trier par</span>
                    {(["status", "available", "group"] as const).map((s) => (
                        <Button
                            key={s}
                            onClick={() => setSortBy(s)}
                            className={clsx(
                                "text-xs font-medium px-2.5 py-1 rounded-full transition-all",
                                sortBy === s
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                        >
                            {s === "status" ? "Statut" : s === "available" ? "Quantité" : "Groupe"}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-gray-50">
                {sorted.map((stock) => {
                    const config = statusConfig[stock.status];
                    const pct = Math.round((stock.available / stock.capacity) * 100);

                    return (
                        <div
                            key={stock.group}
                            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                            { }
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-red-600">
                                    {stock.group}
                                </span>
                            </div>

                            { }
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {stock.available} poches
                                        </span>
                                        {stock.expiringIn7Days > 0 && (
                                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                                                ⏰ {stock.expiringIn7Days} exp. bientôt
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={clsx(
                                            "text-xs font-medium px-2.5 py-0.5 rounded-full",
                                            config.badge
                                        )}
                                    >
                                        {config.label}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full rounded-full", config.bar)}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {pct}% · MAJ {formatDate(stock.lastUpdated)}
                                </p>
                            </div>

                            { }
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    variant="outline" 
                                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                                    Modifier
                                </Button>
                                {stock.status !== "ok" && (
                                    <Button className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                                        Alerter
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}