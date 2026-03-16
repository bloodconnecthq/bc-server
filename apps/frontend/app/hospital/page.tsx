import { StockCard } from "@/components/hospital/stock-card";
import { StatsOverview } from "@/components/hospital/stats-overview";
import { RecentDonations } from "@/components/hospital/recent-donations";
import { AlertsBanner } from "@/components/hospital/alerts-banner";

// Données statiques — seront remplacées par l'API
const bloodStocks = [
  { group: "A+", level: 72, units: 36, status: "ok" as const },
  { group: "A-", level: 18, units: 9, status: "low" as const },
  { group: "B+", level: 85, units: 42, status: "ok" as const },
  { group: "B-", level: 8, units: 4, status: "critical" as const },
  { group: "AB+", level: 60, units: 30, status: "ok" as const },
  { group: "AB-", level: 5, units: 2, status: "critical" as const },
  { group: "O+", level: 45, units: 22, status: "ok" as const },
  { group: "O-", level: 12, units: 6, status: "low" as const },
];

const recentDonations = [
  { id: "DON-2841", donor: "K. Agossou", group: "O+", date: "Aujourd'hui, 10h32", status: "validated" as const },
  { id: "DON-2840", donor: "M. Dossou", group: "A+", date: "Aujourd'hui, 09h15", status: "validated" as const },
  { id: "DON-2839", donor: "F. Hounkpé", group: "B-", date: "Hier, 16h48", status: "pending" as const },
  { id: "DON-2838", donor: "R. Tossou", group: "AB+", date: "Hier, 14h20", status: "validated" as const },
  { id: "DON-2837", donor: "A. Kpèdé", group: "O-", date: "Hier, 11h05", status: "rejected" as const },
];

export default function HospitalDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">
            CHU de Cotonou — Mise à jour le 16 mars 2026
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors">
          + Enregistrer un don
        </button>
      </div>

      {/* Alertes urgentes */}
      <AlertsBanner
        alerts={[
          { group: "B-", message: "Stock critique — 4 poches restantes" },
          { group: "AB-", message: "Stock critique — 2 poches restantes" },
        ]}
      />

      {/* Stats globales */}
      <StatsOverview />

      {/* Stocks par groupe sanguin */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Stocks sanguins par groupe
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {bloodStocks.map((stock) => (
            <StockCard key={stock.group} {...stock} />
          ))}
        </div>
      </div>

      {/* Dons récents */}
      <RecentDonations donations={recentDonations} />
    </div>
  );
}