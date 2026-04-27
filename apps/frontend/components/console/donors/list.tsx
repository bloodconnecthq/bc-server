"use client";

import { useState } from "react";
import { Button, Chip, Alert } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import clsx from "clsx";

type DonorStatus = "active" | "suspended" | "inactive";
type BadgeLevel = "none" | "bronze" | "silver" | "gold" | "platinum";

interface Donor {
    id: string;
    firstName: string;
    lastName: string;
    bloodGroup: string;
    phone: string;
    email: string;
    commune: string;
    department: string;
    totalDonations: number;
    lastDonation: string;
    nextEligible: string;
    badge: BadgeLevel;
    status: DonorStatus;
    registeredAt: string;
}

const statusConfig: { [key in DonorStatus]: { label: string; color: "success" | "warning" | "default" } } = {
    active: { label: "Actif", color: "success" },
    suspended: { label: "Suspendu", color: "warning" },
    inactive: { label: "Inactif", color: "default" },
};

const badgeConfig: { [key in BadgeLevel]: { emoji: string; label: string } } = {
    none: { emoji: "—", label: "Aucun" },
    bronze: { emoji: "🥉", label: "Bronze" },
    silver: { emoji: "🥈", label: "Argent" },
    gold: { emoji: "🥇", label: "Or" },
    platinum: { emoji: "💎", label: "Platine" },
};

const filters = ["Tous", "Actifs", "Éligibles", "Suspendus", "Inactifs"];

function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function isEligible(nextEligible: string) {
    if (!nextEligible) return false;
    return new Date(nextEligible) <= new Date();
}

export function DonorsList({ donors }: { donors: Donor[] }) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("Tous");
    const [selected, setSelected] = useState<Donor | null>(null);
    const [items, setItems] = useState(donors);
    const [lastAction, setLastAction] = useState<string | null>(null);

    const filtered = items.filter((d) => {
        const matchSearch =
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase()) ||
            d.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
            d.commune.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            activeFilter === "Tous" ||
            (activeFilter === "Actifs" && d.status === "active") ||
            (activeFilter === "Éligibles" && isEligible(d.nextEligible)) ||
            (activeFilter === "Suspendus" && d.status === "suspended") ||
            (activeFilter === "Inactifs" && d.status === "inactive");

        return matchSearch && matchFilter;
    });

    const handleSuspend = (id: string) => {
        setItems((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "suspended" as DonorStatus } : d
            )
        );
        setLastAction("Donneur suspendu avec succès.");
        setTimeout(() => setLastAction(null), 3000);
    };

    const handleActivate = (id: string) => {
        setItems((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "active" as DonorStatus } : d
            )
        );
        setLastAction("Donneur réactivé avec succès.");
        setTimeout(() => setLastAction(null), 3000);
    };

    return (
        <div className="space-y-4">
            
            {lastAction && (
                <Alert status="success">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{lastAction}</Alert.Title>
                    </Alert.Content>
                </Alert>
            )}

            
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                    <SearchNormal1
                        size={15}
                        color="#9ca3af"
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un donneur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {filters.map((f) => (
                        <Button
                            key={f}
                            size="sm"
                            variant={activeFilter === f ? "primary" : "outline"}
                            onPress={() => setActiveFilter(f)}
                            className={clsx(
                                "rounded-full text-xs",
                                activeFilter === f && "bg-red-600 border-red-600 text-white"
                            )}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6">
                
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    
                    <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-3">Donneur</div>
                        <div className="col-span-1 text-center">Groupe</div>
                        <div className="col-span-2">Commune</div>
                        <div className="col-span-1 text-center">Dons</div>
                        <div className="col-span-1 text-center">Badge</div>
                        <div className="col-span-2">Dernier don</div>
                        <div className="col-span-1 text-center">Statut</div>
                        <div className="col-span-1"></div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                Aucun donneur trouvé
                            </div>
                        )}
                        {filtered.map((donor) => {
                            const sConfig = statusConfig[donor.status];
                            const bConfig = badgeConfig[donor.badge];
                            const eligible = isEligible(donor.nextEligible);

                            return (
                                <div
                                    key={donor.id}
                                    onClick={() => setSelected(donor)}
                                    className={clsx(
                                        "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                                        selected?.id === donor.id && "bg-red-50"
                                    )}
                                >
                                    
                                    <div className="col-span-3">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {donor.firstName} {donor.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 font-mono">{donor.id}</p>
                                    </div>

                                    
                                    <div className="col-span-1 flex justify-center">
                                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                            <span className="text-xs font-bold text-red-600">
                                                {donor.bloodGroup}
                                            </span>
                                        </div>
                                    </div>

                                    
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600">{donor.commune}</p>
                                        <p className="text-xs text-gray-400">{donor.department}</p>
                                    </div>

                                    
                                    <div className="col-span-1 text-center">
                                        <p className="text-sm font-bold text-gray-900">
                                            {donor.totalDonations}
                                        </p>
                                    </div>

                                    
                                    <div className="col-span-1 text-center">
                                        <span title={bConfig.label} className="text-lg">
                                            {bConfig.emoji}
                                        </span>
                                    </div>

                                    
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-600">
                                            {formatDate(donor.lastDonation)}
                                        </p>
                                        {eligible && (
                                            <span className="text-xs text-green-600 font-medium">
                                                ● Éligible
                                            </span>
                                        )}
                                    </div>

                                    
                                    <div className="col-span-1 flex justify-center">
                                        <Chip size="sm" color={sConfig.color}>
                                            {sConfig.label}
                                        </Chip>
                                    </div>

                                    
                                    <div className="col-span-1" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                
                {selected && (
                    <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Profil donneur
                            </h3>
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-400 hover:text-gray-600 text-lg"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-5 py-4 space-y-4">
                            
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <span className="text-sm font-bold text-red-600">
                                        {selected.firstName[0]}{selected.lastName[0]}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {selected.firstName} {selected.lastName}
                                    </p>
                                    <p className="text-xs font-mono text-gray-400">{selected.id}</p>
                                </div>
                            </div>

                            
                            <div className="flex gap-2">
                                <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                                    <p className="text-xl font-black text-red-600">
                                        {selected.bloodGroup}
                                    </p>
                                    <p className="text-xs text-red-400">Groupe</p>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-xl">{badgeConfig[selected.badge].emoji}</p>
                                    <p className="text-xs text-gray-400">{badgeConfig[selected.badge].label}</p>
                                </div>
                                <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-xl font-black text-blue-600">
                                        {selected.totalDonations}
                                    </p>
                                    <p className="text-xs text-blue-400">Dons</p>
                                </div>
                            </div>

                            
                            {[
                                { label: "Téléphone", value: selected.phone },
                                { label: "Email", value: selected.email },
                                { label: "Commune", value: `${selected.commune} · ${selected.department}` },
                                { label: "Inscrit le", value: formatDate(selected.registeredAt) },
                                { label: "Dernier don", value: formatDate(selected.lastDonation) },
                                {
                                    label: "Prochain don éligible",
                                    value: selected.nextEligible
                                        ? formatDate(selected.nextEligible)
                                        : "—",
                                },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                                </div>
                            ))}

                            
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Statut</p>
                                <Chip
                                    size="sm"
                                    color={statusConfig[selected.status].color}
                                >
                                    {statusConfig[selected.status].label}
                                </Chip>
                            </div>

                            
                            <div className="flex gap-2 pt-2">
                                {selected.status === "active" ? (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        fullWidth
                                        onPress={() => {
                                            handleSuspend(selected.id);
                                            setSelected(null);
                                        }}
                                        className="rounded-xl text-xs"
                                    >
                                        Suspendre le compte
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        fullWidth
                                        onPress={() => {
                                            handleActivate(selected.id);
                                            setSelected(null);
                                        }}
                                        className="rounded-xl text-xs bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Réactiver le compte
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}