"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useStocksResumeNational, useRapportStocks } from "@/lib/hooks/useConsole";
import { CriticalStocksBanner } from "@/components/console/stocks/critical-stocks-banner";
import { NationalStocksOverview } from "@/components/console/stocks/national-stocks-overview";
import { NationalStocksTable } from "@/components/console/stocks/stocks-table";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function NationalStocksPage() {
  const { token } = useAuth();
  const { data: resume, isLoading: loadingResume } = useStocksResumeNational(token);
  const { data: rapport, isLoading: loadingRapport } = useRapportStocks(token);

  const isLoading = loadingResume || loadingRapport;

  // Build group totals for the overview bar chart
  const groupTotals = BLOOD_GROUPS.map((g) => ({
    group: g,
    total: resume?.[g]?.quantiteTotale ?? 0,
  }));

  const total = groupTotals.reduce((s, g) => s + g.total, 0);
  const criticalGroups = BLOOD_GROUPS.filter((g) => (resume?.[g]?.critique ?? 0) > 0).length;
  const lowGroups = BLOOD_GROUPS.filter(
    (g) => (resume?.[g]?.faible ?? 0) > 0 && (resume?.[g]?.critique ?? 0) === 0
  ).length;

  // Map hospital-level stock data to the table format (reusing the dept-style table)
  const tableRows = (rapport?.parHopital ?? []).map((h) => {
    const stocksMap: Record<string, number> = {};
    for (const s of h.stocks) {
      stocksMap[s.groupeSanguin] = s.quantite;
    }
    const status =
      h.stocksCritiques > 0 ? ("critical" as const)
      : h.stocksFaibles > 0 ? ("low" as const)
      : ("ok" as const);
    return {
      department: h.nomHopital,
      capital: h.commune || "—",
      centers: 1,
      stocks: stocksMap,
      total: h.quantiteTotale,
      status,
    };
  });

  const criticalRows = tableRows.filter((r) => r.status === "critical");

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="h-10 bg-gray-100 rounded-xl w-64 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stocks nationaux</h1>
          <p className="text-sm text-gray-500 mt-1">
            Inventaire complet des produits sanguins — par établissement
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Exporter CSV
          </button>
        </div>
      </div>

      {criticalRows.length > 0 && <CriticalStocksBanner departments={criticalRows} />}

      <NationalStocksOverview
        total={total}
        critical={criticalGroups}
        low={lowGroups}
        groupTotals={groupTotals}
      />

      <NationalStocksTable departments={tableRows} bloodGroups={BLOOD_GROUPS} />
    </div>
  );
}
