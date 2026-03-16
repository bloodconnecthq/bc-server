import { AlertsList } from "@/components/hospital/alerts/list";
import { AlertsStats } from "@/components/hospital/alerts/stats";

const alerts = [
    {
        id: "ALT-001",
        type: "critical" as const,
        bloodGroup: "B-",
        title: "Stock critique — B-",
        message: "Le stock de sang B- est tombé à 4 poches. Un approvisionnement urgent est nécessaire.",
        date: "2026-03-16T07:45:00",
        read: false,
        resolved: false,
        triggeredBy: "Système automatique",
    },
    {
        id: "ALT-002",
        type: "critical" as const,
        bloodGroup: "AB-",
        title: "Stock critique — AB-",
        message: "Il ne reste que 2 poches de AB-. Ce groupe est rare et très demandé en chirurgie.",
        date: "2026-03-15T18:20:00",
        read: false,
        resolved: false,
        triggeredBy: "Système automatique",
    },
    {
        id: "ALT-003",
        type: "low" as const,
        bloodGroup: "O-",
        title: "Stock faible — O-",
        message: "Le stock O- est en dessous du seuil minimal (6 poches). Pensez à lancer une campagne ciblée.",
        date: "2026-03-15T10:00:00",
        read: true,
        resolved: false,
        triggeredBy: "Système automatique",
    },
    {
        id: "ALT-004",
        type: "expiry" as const,
        bloodGroup: "A+",
        title: "Expiration imminente — A+",
        message: "4 poches de A+ arrivent à expiration dans moins de 7 jours. Priorisez leur utilisation.",
        date: "2026-03-14T09:30:00",
        read: true,
        resolved: false,
        triggeredBy: "Système automatique",
    },
    {
        id: "ALT-005",
        type: "low" as const,
        bloodGroup: "A-",
        title: "Stock faible — A-",
        message: "9 poches de A- disponibles, en dessous du seuil de 15 poches recommandé.",
        date: "2026-03-13T14:15:00",
        read: true,
        resolved: false,
        triggeredBy: "Dr. Hounkpè",
    },
    {
        id: "ALT-006",
        type: "critical" as const,
        bloodGroup: "O-",
        title: "Stock critique — O- résolu",
        message: "Le stock O- avait atteint 0 poche. Une collecte d'urgence a permis de reconstituer le stock.",
        date: "2026-03-10T11:00:00",
        read: true,
        resolved: true,
        triggeredBy: "Système automatique",
    },
    {
        id: "ALT-007",
        type: "expiry" as const,
        bloodGroup: "B+",
        title: "Expiration — B+ résolu",
        message: "6 poches de B+ arrivées à expiration ont été utilisées en priorité lors des interventions du jour.",
        date: "2026-03-08T16:00:00",
        read: true,
        resolved: true,
        triggeredBy: "Inf. Tossou",
    },
];

export default function AlertsPage() {
    const active = alerts.filter((a) => !a.resolved);
    const critical = active.filter((a) => a.type === "critical").length;
    const low = active.filter((a) => a.type === "low").length;
    const expiry = active.filter((a) => a.type === "expiry").length;
    const resolved = alerts.filter((a) => a.resolved).length;

    return (
        <div className="space-y-8 max-w-">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {active.length} alerte{active.length > 1 ? "s" : ""} active{active.length > 1 ? "s" : ""}
                    </p>
                </div>
                <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Créer une alerte manuelle
                </button>
            </div>

            <AlertsStats
                critical={critical}
                low={low}
                expiry={expiry}
                resolved={resolved}
            />

            <AlertsList alerts={alerts} />
        </div>
    );
}