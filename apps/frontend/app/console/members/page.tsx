import { MemberRequests } from "@/components/console/members/requests";

const requests = [
    {
        id: "REQ-001",
        name: "Dr. Céleste Gbénou",
        email: "gbenou@chu-cotonou.bj",
        role: "Médecin",
        hospital: "CHU de Cotonou",
        hospitalId: "h2",
        requestedAt: "2026-03-16T07:30:00",
        status: "pending" as const,
        message: "Je souhaite accéder au système pour gérer les transfusions du service de chirurgie.",
    },
    {
        id: "REQ-002",
        name: "Inf. Rodrigue Amoussou",
        email: "amoussou@hz-portonovo.bj",
        role: "Infirmier",
        hospital: "Hôpital de Zone Porto-Novo",
        hospitalId: "h4",
        requestedAt: "2026-03-15T14:20:00",
        status: "pending" as const,
        message: "Demande d'accès pour enregistrement des dons et suivi des stocks.",
    },
    {
        id: "REQ-003",
        name: "Tech. Brice Kpénou",
        email: "kpenou@cs-godomey.bj",
        role: "Technicien de laboratoire",
        hospital: "Centre de Santé Godomey",
        hospitalId: "h5",
        requestedAt: "2026-03-15T09:00:00",
        status: "pending" as const,
        message: "Accès nécessaire pour la qualification biologique des dons.",
    },
    {
        id: "REQ-004",
        name: "Dr. Fatou Sawadogo",
        email: "sawadogo@cnts-parakou.bj",
        role: "Médecin",
        hospital: "Antenne CNTS Parakou",
        hospitalId: "h3",
        requestedAt: "2026-03-10T11:15:00",
        status: "approved" as const,
        message: "Renfort médical pour la campagne de collecte de mars.",
    },
    {
        id: "REQ-005",
        name: "Inf. Théodore Wabi",
        email: "wabi@hz-lokossa.bj",
        role: "Infirmier",
        hospital: "Hôpital de Zone Lokossa",
        hospitalId: "h7",
        requestedAt: "2026-03-08T16:40:00",
        status: "rejected" as const,
        message: "Demande d'accès pour gestion des stocks de l'hôpital.",
    },
    {
        id: "REQ-006",
        name: "Dr. Aminatou Chabi",
        email: "chabi@cnts-natitingou.bj",
        role: "Médecin",
        hospital: "Antenne CNTS Natitingou",
        hospitalId: "h6",
        requestedAt: "2026-03-05T08:00:00",
        status: "approved" as const,
        message: "Intégration dans l'équipe médicale de l'antenne nord.",
    },
];

export default function MembersPage() {
    const pending = requests.filter((r) => r.status === "pending").length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Demandes d'accès
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {pending} demande{pending > 1 ? "s" : ""} en attente de validation
                </p>
            </div>

            { }
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "En attente", value: pending, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", emoji: "⏳" },
                    { label: "Approuvées", value: approved, bg: "bg-green-50", text: "text-green-600", border: "border-green-200", emoji: "✅" },
                    { label: "Rejetées", value: rejected, bg: "bg-red-50", text: "text-red-600", border: "border-red-200", emoji: "❌" },
                ].map((s) => (
                    <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border}`}>
                        <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
                            {s.emoji}
                        </div>
                        <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                        <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <MemberRequests requests={requests} />
        </div>
    );
}