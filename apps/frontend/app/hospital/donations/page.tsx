import { DonationsStats } from "@/components/hospital/donations/stats";
import { DonationsTable } from "@/components/hospital/donations/table";

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
    const validated = donations.filter((d) => d.status === "validated").length;
    const pending = donations.filter((d) => d.status === "pending").length;
    const rejected = donations.filter((d) => d.status === "rejected").length;

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
                total={donations.length}
                validated={validated}
                pending={pending}
                rejected={rejected}
            />

            <DonationsTable donations={donations} />
        </div>
    );
}