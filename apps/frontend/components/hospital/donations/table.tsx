"use client";

import { useState } from "react";
import clsx from "clsx";
import { SearchNormal1, Eye } from "iconsax-reactjs";

type DonationStatus = "validated" | "pending" | "rejected";

interface Tests {
    hiv: boolean;
    hepatiteB: boolean;
    hepatiteC: boolean;
    syphilis: boolean;
}

interface Donation {
    id: string;
    donorName: string;
    donorId: string;
    bloodGroup: string;
    volume: number;
    date: string;
    agent: string;
    center: string;
    status: DonationStatus;
    tests: Tests;
}

const statusConfig: { [key in DonationStatus]: { label: string; badge: string } } = {
    validated: { label: "Validé", badge: "bg-green-50 text-green-700" },
    pending: { label: "En attente", badge: "bg-amber-50 text-amber-700" },
    rejected: { label: "Rejeté", badge: "bg-red-50 text-red-600" },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const filters = ["Tous", "Validés", "En attente", "Rejetés"];

export function DonationsTable({ donations }: { donations: Donation[] }) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("Tous");
    const [selected, setSelected] = useState<Donation | null>(null);

    const filtered = donations.filter((d) => {
        const matchSearch =
            d.donorName.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase()) ||
            d.bloodGroup.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            activeFilter === "Tous" ||
            (activeFilter === "Validés" && d.status === "validated") ||
            (activeFilter === "En attente" && d.status === "pending") ||
            (activeFilter === "Rejetés" && d.status === "rejected");

        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-4">

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                    <SearchNormal1
                        size={15}
                        color="#9ca3af"
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un don..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
                    />
                </div>
                <div className="flex gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={clsx(
                                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                                activeFilter === f
                                    ? "bg-red-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6">

                <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">

                    <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Groupe</div>
                        <div className="col-span-3">Donneur</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Centre</div>
                        <div className="col-span-2">Agent</div>
                        <div className="col-span-1">Statut</div>
                        <div className="col-span-1"></div>
                    </div>


                    <div className="divide-y divide-gray-50">
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                Aucun don trouvé
                            </div>
                        )}
                        {filtered.map((donation) => {
                            const config = statusConfig[donation.status];
                            return (
                                <div
                                    key={donation.id}
                                    onClick={() => setSelected(donation)}
                                    className={clsx(
                                        "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                                        selected?.id === donation.id && "bg-red-50"
                                    )}
                                >

                                    <div className="col-span-1">
                                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                            <span className="text-xs font-bold text-red-600">
                                                {donation.bloodGroup}
                                            </span>
                                        </div>
                                    </div>


                                    <div className="col-span-3">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {donation.donorName}
                                        </p>
                                        <p className="text-xs text-gray-400 font-mono">
                                            {donation.donorId}
                                        </p>
                                    </div>


                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600">
                                            {formatDate(donation.date)}
                                        </p>
                                    </div>


                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600 truncate">
                                            {donation.center}
                                        </p>
                                    </div>


                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600">{donation.agent}</p>
                                    </div>


                                    <div className="col-span-1">
                                        <span
                                            className={clsx(
                                                "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap",
                                                config.badge
                                            )}
                                        >
                                            {config.label}
                                        </span>
                                    </div>


                                    <div className="col-span-1 flex justify-end">
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Eye size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


                {selected && (
                    <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden self-start">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Détail du don
                            </h3>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-5 py-4 space-y-4">

                            <div className="flex items-center justify-between">
                                <p className="text-xs font-mono font-semibold text-gray-900">
                                    {selected.id}
                                </p>
                                <span
                                    className={clsx(
                                        "text-xs font-medium px-2.5 py-1 rounded-full",
                                        statusConfig[selected.status].badge
                                    )}
                                >
                                    {statusConfig[selected.status].label}
                                </span>
                            </div>


                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {selected.bloodGroup}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {selected.bloodGroup}
                                    </p>
                                    <p className="text-xs text-gray-500">{selected.volume} ml</p>
                                </div>
                            </div>


                            {[
                                { label: "Donneur", value: selected.donorName },
                                { label: "ID Donneur", value: selected.donorId },
                                { label: "Centre", value: selected.center },
                                { label: "Agent", value: selected.agent },
                                { label: "Date", value: formatDate(selected.date) },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}


                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                                    Résultats des tests
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {(
                                        [
                                            { key: "hiv", label: "VIH" },
                                            { key: "hepatiteB", label: "Hépatite B" },
                                            { key: "hepatiteC", label: "Hépatite C" },
                                            { key: "syphilis", label: "Syphilis" },
                                        ] as const
                                    ).map((test) => {
                                        const positive = selected.tests[test.key];
                                        return (
                                            <div
                                                key={test.key}
                                                className={clsx(
                                                    "flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium",
                                                    positive
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-green-50 text-green-700"
                                                )}
                                            >
                                                <span>{positive ? "✕" : "✓"}</span>
                                                {test.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            {selected.status === "pending" && (
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors">
                                        Valider
                                    </button>
                                    <button className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                                        Rejeter
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}