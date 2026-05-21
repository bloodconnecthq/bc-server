import { CriticalStocksBanner } from "@/components/console/stocks/critical-stocks-banner";
import { NationalStocksOverview } from "@/components/console/stocks/national-stocks-overview";
import { NationalStocksTable } from "@/components/console/stocks/stocks-table";

const nationalStocks = [
  {
    department: "Littoral",
    capital: "Cotonou",
    centers: 8,
    stocks: { "A+": 142, "A-": 28, "B+": 167, "B-": 12, "AB+": 89, "AB-": 8, "O+": 198, "O-": 24 },
    total: 668,
    status: "critical" as const,
  },
  {
    department: "Atlantique",
    capital: "Abomey-Calavi",
    centers: 7,
    stocks: { "A+": 98, "A-": 22, "B+": 112, "B-": 18, "AB+": 67, "AB-": 14, "O+": 143, "O-": 19 },
    total: 493,
    status: "ok" as const,
  },
  {
    department: "Borgou",
    capital: "Parakou",
    centers: 6,
    stocks: { "A+": 87, "A-": 19, "B+": 94, "B-": 15, "AB+": 52, "AB-": 11, "O+": 121, "O-": 16 },
    total: 415,
    status: "ok" as const,
  },
  {
    department: "Ouémé",
    capital: "Porto-Novo",
    centers: 5,
    stocks: { "A+": 54, "A-": 9, "B+": 61, "B-": 7, "AB+": 32, "AB-": 4, "O+": 78, "O-": 8 },
    total: 253,
    status: "low" as const,
  },
  {
    department: "Zou",
    capital: "Abomey",
    centers: 4,
    stocks: { "A+": 38, "A-": 6, "B+": 44, "B-": 5, "AB+": 21, "AB-": 3, "O+": 57, "O-": 6 },
    total: 180,
    status: "low" as const,
  },
  {
    department: "Atacora",
    capital: "Natitingou",
    centers: 4,
    stocks: { "A+": 67, "A-": 14, "B+": 72, "B-": 11, "AB+": 38, "AB-": 9, "O+": 89, "O-": 13 },
    total: 313,
    status: "ok" as const,
  },
  {
    department: "Collines",
    capital: "Savalou",
    centers: 3,
    stocks: { "A+": 45, "A-": 8, "B+": 51, "B-": 6, "AB+": 27, "AB-": 4, "O+": 63, "O-": 7 },
    total: 211,
    status: "ok" as const,
  },
  {
    department: "Mono",
    capital: "Lokossa",
    centers: 2,
    stocks: { "A+": 12, "A-": 2, "B+": 14, "B-": 1, "AB+": 7, "AB-": 0, "O+": 18, "O-": 2 },
    total: 56,
    status: "critical" as const,
  },
  {
    department: "Couffo",
    capital: "Aplahoué",
    centers: 2,
    stocks: { "A+": 22, "A-": 4, "B+": 25, "B-": 3, "AB+": 13, "AB-": 2, "O+": 31, "O-": 4 },
    total: 104,
    status: "low" as const,
  },
  {
    department: "Donga",
    capital: "Djougou",
    centers: 3,
    stocks: { "A+": 41, "A-": 8, "B+": 47, "B-": 7, "AB+": 24, "AB-": 5, "O+": 58, "O-": 8 },
    total: 198,
    status: "ok" as const,
  },
  {
    department: "Alibori",
    capital: "Kandi",
    centers: 2,
    stocks: { "A+": 28, "A-": 5, "B+": 32, "B-": 4, "AB+": 16, "AB-": 2, "O+": 39, "O-": 5 },
    total: 131,
    status: "low" as const,
  },
  {
    department: "Plateau",
    capital: "Pobè",
    centers: 3,
    stocks: { "A+": 38, "A-": 7, "B+": 43, "B-": 6, "AB+": 22, "AB-": 4, "O+": 51, "O-": 7 },
    total: 178,
    status: "ok" as const,
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function NationalStocksPage() {
  const total = nationalStocks.reduce((s, d) => s + d.total, 0);
  const critical = nationalStocks.filter((d) => d.status === "critical");
  const low = nationalStocks.filter((d) => d.status === "low").length;

  const groupTotals = bloodGroups.map((g) => ({
    group: g,
    total: nationalStocks.reduce(
      (s, d) => s + (d.stocks[g as keyof typeof d.stocks] || 0),
      0
    ),
  }));

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stocks nationaux</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inventaire complet des produits sanguins — 12 départements
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Exporter CSV
          </button>
          <button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            + Mise à jour manuelle
          </button>
        </div>
      </div>

      {critical.length > 0 && (
        <CriticalStocksBanner departments={critical} />
      )}

      <NationalStocksOverview
        total={total}
        critical={critical.length}
        low={low}
        groupTotals={groupTotals}
      />

      <NationalStocksTable
        departments={nationalStocks}
        bloodGroups={bloodGroups}
      />
    </div>
  );
}