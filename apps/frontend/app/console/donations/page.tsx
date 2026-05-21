import { ConsoleDonationsList } from "@/components/console/donations/list";
import { ConsoleDonationsStats } from "@/components/console/donations/stats";

const donations = [
    {
        id: "DON-2841",
        donorName: "Koffi Agossou",
        donorId: "BC-2024-08412",
        bloodGroup: "O+",
        volume: 450,
        date: "2026-03-16T10:32:00",
        center: "CNTS Cotonou",
        department: "Littoral",
        agent: "Dr. Hounkpè",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-27",
    },
    {
        id: "DON-2840",
        donorName: "Mèdéssè Dossou",
        donorId: "BC-2024-07234",
        bloodGroup: "A+",
        volume: 450,
        date: "2026-03-16T09:15:00",
        center: "CNTS Cotonou",
        department: "Littoral",
        agent: "Dr. Hounkpè",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-27",
    },
    {
        id: "DON-2839",
        donorName: "Fèmi Hounkpè",
        donorId: "BC-2023-05891",
        bloodGroup: "B-",
        volume: 450,
        date: "2026-03-15T16:48:00",
        center: "CNTS Cotonou",
        department: "Littoral",
        agent: "Inf. Tossou",
        status: "pending" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: true, syphilis: false },
        expiresAt: "2026-04-26",
    },
    {
        id: "DON-2838",
        donorName: "Roland Tossou",
        donorId: "BC-2024-09102",
        bloodGroup: "AB+",
        volume: 450,
        date: "2026-03-15T14:20:00",
        center: "Antenne Porto-Novo",
        department: "Ouémé",
        agent: "Dr. Ahounou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-26",
    },
    {
        id: "DON-2837",
        donorName: "Adjoua Kpèdé",
        donorId: "BC-2024-06543",
        bloodGroup: "O-",
        volume: 450,
        date: "2026-03-15T11:05:00",
        center: "CNTS Cotonou",
        department: "Littoral",
        agent: "Inf. Tossou",
        status: "rejected" as const,
        tests: { hiv: true, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "",
    },
    {
        id: "DON-2836",
        donorName: "Brice Sènou",
        donorId: "BC-2023-04321",
        bloodGroup: "A-",
        volume: 450,
        date: "2026-03-14T15:30:00",
        center: "Antenne Porto-Novo",
        department: "Ouémé",
        agent: "Dr. Ahounou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-25",
    },
    {
        id: "DON-2835",
        donorName: "Céleste Gbénou",
        donorId: "BC-2024-08899",
        bloodGroup: "B+",
        volume: 450,
        date: "2026-03-14T10:10:00",
        center: "CNTS Cotonou",
        department: "Littoral",
        agent: "Dr. Hounkpè",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-25",
    },
    {
        id: "DON-2834",
        donorName: "Théodore Akpovi",
        donorId: "BC-2023-03210",
        bloodGroup: "O+",
        volume: 450,
        date: "2026-03-13T08:45:00",
        center: "Collecte UAC",
        department: "Atlantique",
        agent: "Inf. Tossou",
        status: "pending" as const,
        tests: { hiv: false, hepatiteB: true, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-24",
    },
    {
        id: "DON-2833",
        donorName: "Aminatou Chabi",
        donorId: "BC-2024-05432",
        bloodGroup: "AB-",
        volume: 450,
        date: "2026-03-12T14:00:00",
        center: "Antenne Natitingou",
        department: "Atacora",
        agent: "Dr. Sawadogo",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-23",
    },
    {
        id: "DON-2832",
        donorName: "Rodrigue Amoussou",
        donorId: "BC-2024-04567",
        bloodGroup: "O-",
        volume: 450,
        date: "2026-03-11T09:30:00",
        center: "Antenne Porto-Novo",
        department: "Ouémé",
        agent: "Inf. Amoussou",
        status: "validated" as const,
        tests: { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
        expiresAt: "2026-04-22",
    },
];

export default function ConsoleDonationsPage() {
    const validated = donations.filter((d) => d.status === "validated").length;
    const pending = donations.filter((d) => d.status === "pending").length;
    const rejected = donations.filter((d) => d.status === "rejected").length;
    const expiringSoon = donations.filter((d) => {
        if (!d.expiresAt) return false;
        const diff = new Date(d.expiresAt).getTime() - new Date().getTime();
        return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Poches de sang</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Suivi national de toutes les poches collectées
                    </p>
                </div>
                <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Exporter CSV
                </button>
            </div>

            <ConsoleDonationsStats
                total={donations.length}
                validated={validated}
                pending={pending}
                rejected={rejected}
                expiringSoon={expiringSoon}
            />

            <ConsoleDonationsList donations={donations} />
        </div>
    );
}