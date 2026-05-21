"use client"

import { BadgesGrid } from "@/components/donor/badges-grid";
import { DonationTimeline } from "@/components/donor/donation-timeline";
import { HistoryStats } from "@/components/donor/history-stats";
import { useAuth } from "../../providers/auth-provider";
import { useDonorHistory } from "@/lib/hooks/useDonorHistory";
import { useDonor } from "@/lib/hooks/useDonor";

const getBadges = (totalDons: number) => {
    const baseBadges = [
        {
            id: "first-blood",
            emoji: "🩸",
            label: "Premier Don",
            description: "Vous avez effectué votre tout premier don de sang",
            unlockedAt: null,
            unlocked: totalDons >= 1,
            color: "bg-red-50 border-red-200",
        },
        {
            id: "bronze",
            emoji: "🥉",
            label: "Donneur Bronze",
            description: "4 dons effectués",
            unlockedAt: null,
            unlocked: totalDons >= 4,
            color: "bg-orange-50 border-orange-200",
        },
        {
            id: "silver",
            emoji: "🥈",
            label: "Donneur Argent",
            description: "4 dons effectués",
            unlockedAt: null,
            unlocked: totalDons >= 4,
            color: "bg-gray-50 border-gray-200",
        },
        {
            id: "gold",
            emoji: "🥇",
            label: "Donneur Or",
            description: "10 dons effectués",
            unlockedAt: null,
            unlocked: totalDons >= 10,
            color: "bg-amber-50 border-amber-200",
        },
        {
            id: "platinum",
            emoji: "💎",
            label: "Donneur Platine",
            description: "25 dons effectués",
            unlockedAt: null,
            unlocked: totalDons >= 25,
            color: "bg-indigo-50 border-indigo-200",
        },
    ];
    return baseBadges;
};

export default function HistoryPage() {
    const { token, isLoading } = useAuth();
    const { donations, isLoading: donationsLoading, error: donationsError } = useDonorHistory(token);
    const { donor, isLoading: donorLoading } = useDonor(token);

    if (isLoading || donationsLoading || donorLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600">Chargement de l'historique...</p>
            </div>
        );
    }

    if (donationsError || !donor) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-600">
                    Erreur: {donationsError || 'Historique non trouvé'}
                </p>
            </div>
        );
    }

    // Transformer les données du backend pour les composants
    const transformedDonations = donations
        .filter((d) => d.statut === 'valide') // Seulement les dons validés
        .map((d) => ({
            id: d.id,
            date: new Date(d.dateDon).toISOString().split('T')[0],
            center: d.hopital?.nom || 'Centre inconnu',
            volume: d.volume,
            bloodGroup: donor.groupeSanguin || 'Inconnu',
            status: d.statut === 'valide' ? ('validated' as const) : ('rejected' as const),
            badge: null,
        }));

    const allBadges = getBadges(donor.totalDons);
    const validated = transformedDonations.length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Historique & Badges</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Retrouvez tous vos dons et récompenses
                </p>
            </div>

            <HistoryStats
                total={donor.totalDons}
                validated={validated}
                totalMl={validated * 450}
                badgesUnlocked={allBadges.filter((b) => b.unlocked).length}
            />

            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <DonationTimeline donations={transformedDonations} />
                </div>

                <div className="col-span-2">
                    <BadgesGrid badges={allBadges} />
                </div>
            </div>
        </div>
    );
}