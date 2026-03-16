import { DonorCard } from "@/components/donor/donor-card";
import { DonorStats } from "@/components/donor/donor-stats";
import { NextDonationBanner } from "@/components/donor/next-donation-banner";

const donor = {
    id: "BC-2024-08412",
    firstName: "Koffi",
    lastName: "Agossou",
    bloodGroup: "O",
    rhesus: "+",
    totalDonations: 7,
    lastDonationDate: "2025-12-18",
    nextEligibleDate: "2026-03-18",
    commune: "Cotonou",
    phone: "+229 97 45 12 38",
};

function getBadge(count: number) {
    if (count >= 25) return { label: "Platine", color: "bg-purple-100 text-purple-700", emoji: "💎" };
    if (count >= 10) return { label: "Or", color: "bg-amber-100 text-amber-700", emoji: "🥇" };
    if (count >= 4) return { label: "Argent", color: "bg-gray-100 text-gray-600", emoji: "🥈" };
    return { label: "Bronze", color: "bg-orange-100 text-orange-700", emoji: "🥉" };
}

export default function DonorHome() {
    const badge = getBadge(donor.totalDonations);
    const today = new Date();
    const nextDate = new Date(donor.nextEligibleDate);
    const daysLeft = Math.ceil(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isEligible = daysLeft <= 0;

    return (
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
                nextDate={donor.nextEligibleDate}
            />

            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <DonorCard donor={donor} badge={badge} />
                </div>

                <div className="col-span-2">
                    <DonorStats
                        totalDonations={donor.totalDonations}
                        badge={badge}
                        lastDonationDate={donor.lastDonationDate}
                        nextEligibleDate={donor.nextEligibleDate}
                        isEligible={isEligible}
                        daysLeft={daysLeft}
                    />
                </div>
            </div>
        </div>
    );
}