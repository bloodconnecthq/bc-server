"use client"
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DonorCard } from "@/components/donor/donor-card";
import { DonorStats } from "@/components/donor/donor-stats";
import { NextDonationBanner } from "@/components/donor/next-donation-banner";
import { useAuth } from "../providers/auth-provider";
import { useDonor } from "@/lib/hooks/useDonor";
import { Drop } from "iconsax-reactjs";

function getBadge(count: number) {
    if (count >= 25) return { label: "Platine", color: "bg-purple-100 text-purple-700", emoji: "💎" };
    if (count >= 10) return { label: "Or", color: "bg-amber-100 text-amber-700", emoji: "🥇" };
    if (count >= 4) return { label: "Argent", color: "bg-gray-100 text-gray-600", emoji: "🥈" };
    return { label: "Bronze", color: "bg-orange-100 text-orange-700", emoji: "🥉" };
}

export default function DonorHome() {
    const { user, isLoading, token } = useAuth();
    const { donor, isLoading: donorLoading, error } = useDonor(token);

    if (donorLoading || isLoading) {
        return (
            <ProtectedRoute allowedRoles={['donneur']}>
                <div className="text-center space-y-4">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-200">
                        <Drop size={24} color="white" variant="Bold" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-6 h-6 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-gray-400 font-medium">Vérification du profil…</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !donor) {
        console.log("Erreur lors de la récupération du profil:", error);
        return (
            <ProtectedRoute allowedRoles={['donneur']}>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-red-600">Erreur: {error || 'Profil non trouvé'}</p>
                </div>
            </ProtectedRoute>
        );
    }

    const badge = getBadge(donor.totalDons);
    const today = new Date();
    const nextDate = new Date(donor.dateEligibiliteSuivante || '');
    const daysLeft = Math.ceil(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isEligible = daysLeft <= 0;

    const donorCardData = {
        id: donor.id,
        firstName: donor.utilisateur?.prenom || '',
        lastName: donor.utilisateur?.nom || '',
        bloodGroup: donor.groupeSanguin?.substring(0, donor.groupeSanguin.length - 1) || '',
        rhesus: donor.groupeSanguin?.substring(donor.groupeSanguin.length - 1) || '',
        totalDonations: donor.totalDons,
        lastDonationDate: donor.dateDernierDon || '',
        nextEligibleDate: donor.dateEligibiliteSuivante || '',
        commune: donor.utilisateur?.commune || '',
        phone: donor.utilisateur?.telephone || '',
        codeDonneur: donor.codeDonneur || '',
    };

    return (
        <ProtectedRoute allowedRoles={['donneur']}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ma carte de donneur</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Présentez cette carte lors de vos dons au centre de collecte
                    </p>
                </div>

                <NextDonationBanner
                    isEligible={isEligible}
                    daysLeft={daysLeft}
                    nextDate={donor.dateEligibiliteSuivante || ''}
                />

                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <DonorCard donor={donorCardData} badge={badge} />
                    </div>

                    <div className="col-span-2">
                        <DonorStats
                            totalDonations={donor.totalDons}
                            badge={badge}
                            lastDonationDate={donor.dateDernierDon || ''}
                            nextEligibleDate={donor.dateEligibiliteSuivante || ''}
                            isEligible={isEligible}
                            daysLeft={daysLeft}
                        />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}