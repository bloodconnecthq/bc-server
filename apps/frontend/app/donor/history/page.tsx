
import { BadgesGrid } from "@/components/donor/badges-grid";
import { DonationTimeline } from "@/components/donor/donation-timeline";
import { HistoryStats } from "@/components/donor/history-stats";

const donations = [
    {
        id: "DON-2841",
        date: "2025-12-18",
        center: "CNTS Cotonou",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: "7ème don 🎉",
    },
    {
        id: "DON-2654",
        date: "2025-09-02",
        center: "Collecte mobile — UAC",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: null,
    },
    {
        id: "DON-2490",
        date: "2025-05-14",
        center: "CNTS Cotonou",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: null,
    },
    {
        id: "DON-2201",
        date: "2025-01-20",
        center: "Antenne CNTS Porto-Novo",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: null,
    },
    {
        id: "DON-1987",
        date: "2024-09-08",
        center: "CNTS Cotonou",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: "Badge Argent obtenu 🥈",
    },
    {
        id: "DON-1654",
        date: "2024-05-22",
        center: "Collecte mobile — Dantokpa",
        volume: 450,
        bloodGroup: "O+",
        status: "validated" as const,
        badge: null,
    },
    {
        id: "DON-1203",
        date: "2024-01-10",
        center: "CNTS Cotonou",
        volume: 450,
        bloodGroup: "O+",
        status: "rejected" as const,
        badge: null,
    },
];

const allBadges = [
    {
        id: "first-blood",
        emoji: "🩸",
        label: "Premier Don",
        description: "Vous avez effectué votre tout premier don de sang",
        unlockedAt: "2024-01-10",
        unlocked: true,
        color: "bg-red-50 border-red-200",
    },
    {
        id: "bronze",
        emoji: "🥉",
        label: "Donneur Bronze",
        description: "3 dons effectués",
        unlockedAt: "2024-05-22",
        unlocked: true,
        color: "bg-orange-50 border-orange-200",
    },
    {
        id: "silver",
        emoji: "🥈",
        label: "Donneur Argent",
        description: "4 dons effectués",
        unlockedAt: "2024-09-08",
        unlocked: true,
        color: "bg-gray-50 border-gray-200",
    },
    {
        id: "regular",
        emoji: "📅",
        label: "Donneur Régulier",
        description: "3 dons dans la même année",
        unlockedAt: "2025-09-02",
        unlocked: true,
        color: "bg-blue-50 border-blue-200",
    },
    {
        id: "gold",
        emoji: "🥇",
        label: "Donneur Or",
        description: "10 dons effectués",
        unlockedAt: null,
        unlocked: false,
        color: "bg-amber-50 border-amber-200",
    },
    {
        id: "hero",
        emoji: "🦸",
        label: "Héros du Sang",
        description: "15 dons effectués",
        unlockedAt: null,
        unlocked: false,
        color: "bg-purple-50 border-purple-200",
    },
    {
        id: "platinum",
        emoji: "💎",
        label: "Donneur Platine",
        description: "25 dons effectués",
        unlockedAt: null,
        unlocked: false,
        color: "bg-indigo-50 border-indigo-200",
    },
    {
        id: "lifesaver",
        emoji: "❤️",
        label: "Sauveur de vies",
        description: "Estimé 21+ vies sauvées",
        unlockedAt: null,
        unlocked: false,
        color: "bg-rose-50 border-rose-200",
    },
];

export default function HistoryPage() {
    const validated = donations.filter((d) => d.status === "validated").length;

    return (
        <div className="space-y-8 ">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Historique & Badges</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Retrouvez tous vos dons et récompenses
                </p>
            </div>


            <HistoryStats
                total={donations.length}
                validated={validated}
                totalMl={validated * 450}
                badgesUnlocked={allBadges.filter((b) => b.unlocked).length}
            />

            <div className="grid grid-cols-5 gap-6">

                <div className="col-span-3">
                    <DonationTimeline donations={donations} />
                </div>


                <div className="col-span-2">
                    <BadgesGrid badges={allBadges} />
                </div>
            </div>
        </div>
    );
}