'use client';

import { DonationsStats } from "@/components/hospital/donations/stats";
import { DonationsTable } from "@/components/hospital/donations/table";
import { useHospitalDashboard } from "@/lib/hooks/useHospitalDashboard";
import { useAuth } from "@/app/providers/auth-provider";

const donations = [
    {
        id: "DON-2841",
        donorName: "Koffi Agossou",
        donorId: "BC-2024-08412",
        bloodGroup: "O+",
        volume: 450,
        date: "2026-03-16T10:32:00",
        agent: "Dr. Hounkpè",
        center: "CNTS Cotonou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2840",
        donorName: "Mèdéssè Dossou",
        donorId: "BC-2024-07234",
        bloodGroup: "A+",
        volume: 450,
        date: "2026-03-16T09:15:00",
        agent: "Dr. Hounkpè",
        center: "CNTS Cotonou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2839",
        donorName: "Fèmi Hounkpè",
        donorId: "BC-2023-05891",
        bloodGroup: "B-",
        volume: 450,
        date: "2026-03-15T16:48:00",
        agent: "Inf. Tossou",
        center: "CNTS Cotonou",
        status: "pending" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: true, syphilis: false },
    },
    {
        id: "DON-2838",
        donorName: "Roland Tossou",
        donorId: "BC-2024-09102",
        bloodGroup: "AB+",
        volume: 450,
        date: "2026-03-15T14:20:00",
        agent: "Dr. Ahounou",
        center: "CNTS Cotonou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2837",
        donorName: "Adjoua Kpèdé",
        donorId: "BC-2024-06543",
        bloodGroup: "O-",
        volume: 450,
        date: "2026-03-15T11:05:00",
        agent: "Inf. Tossou",
        center: "CNTS Cotonou",
        status: "rejected" as const,
        tests: { hiv: true, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2836",
        donorName: "Brice Sènou",
        donorId: "BC-2023-04321",
        bloodGroup: "A-",
        volume: 450,
        date: "2026-03-14T15:30:00",
        agent: "Dr. Ahounou",
        center: "Antenne Porto-Novo",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2835",
        donorName: "Céleste Gbénou",
        donorId: "BC-2024-08899",
        bloodGroup: "B+",
        volume: 450,
        date: "2026-03-14T10:10:00",
        agent: "Dr. Hounkpè",
        center: "CNTS Cotonou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    },
    {
        id: "DON-2834",
        donorName: "Théodore Akpovi",
        donorId: "BC-2023-03210",
        bloodGroup: "O+",
        volume: 450,
        date: "2026-03-13T08:45:00",
        agent: "Inf. Tossou",
        center: "Collecte UAC",
        status: "pending" as const,
        tests: { hiv: false, hepatiteB: true, hepatiteC: false, syphilis: false },
    },
];

export default function DonationsPage() {
    const { user } = useAuth();
    const { donations: apiDonations, isLoading: loading, donationsError } = useHospitalDashboard();

    // Convertir les données API au format attendu par les composants
    const donationsData = apiDonations?.map(don => ({
        id: `DON-${don.id}`,
        donorName: don.donneur?.codeDonneur || "Anonyme",
        donorId: don.donneur?.codeDonneur ? `BC-${don.donneur.codeDonneur}` : `BC-${don.id}`,
        bloodGroup: don.donneur?.groupeSanguin || 'O+',
        volume: don.volume ?? 450,
        date: don.dateDon || don.creeLe || new Date().toISOString(),
        agent: don.agent?.nomComplet || user?.nomComplet || "Agent inconnu",
        center: "CNTS Cotonou",
        status: don.statut === 'valide' ? "validated" as const : don.statut === 'en_attente' ? "pending" as const : "rejected" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
    })) || [];

    const validated = donationsData.filter((d) => d.status === "validated").length;
    const pending = donationsData.filter((d) => d.status === "pending").length;
    const rejected = donationsData.filter((d) => d.status === "rejected").length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Chargement des dons...</p>
                </div>
            </div>
        );
    }

    if (donationsError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Erreur lors du chargement des dons</p>
                    <p className="text-sm text-gray-500 mt-2">{donationsError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dons enregistrés</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Suivi et validation des dons de sang
                    </p>
                </div>
                <button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
                    + Enregistrer un don
                </button>
            </div>

            <DonationsStats
                total={donationsData.length}
                validated={validated}
                pending={pending}
                rejected={rejected}
            />

            <DonationsTable donations={donationsData} />
        </div>
    );
}