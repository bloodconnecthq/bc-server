"use client";

import { useAuth } from "@/app/providers/auth-provider";
import {
  useRapportDons,
  useRapportDonneurs,
  useRapportStocks,
  useRapportHopitaux,
} from "@/lib/hooks/useConsole";
import { ReportsOverview } from "@/components/console/reports/overview";
import { ReportsCharts }   from "@/components/console/reports/charts";
import { ReportsExports }  from "@/components/console/reports/exports";

export default function ReportsPage() {
  const { token } = useAuth();

  const { data: rapportDons,      isLoading: l1 } = useRapportDons(token);
  const { data: rapportDonneurs,  isLoading: l2 } = useRapportDonneurs(token);
  const { data: rapportStocks,    isLoading: l3 } = useRapportStocks(token);
  const { data: rapportHopitaux,  isLoading: l4 } = useRapportHopitaux(token);

  const isLoading = l1 || l2 || l3 || l4;

  const lastUpdate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Analyses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Statistiques nationales Blood-Connect en temps réel
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">
            Données à jour — {lastUpdate}
          </span>
        </div>
      </div>

      <ReportsOverview
        rapportDons={rapportDons}
        rapportDonneurs={rapportDonneurs}
        rapportStocks={rapportStocks}
        rapportHopitaux={rapportHopitaux}
        isLoading={isLoading}
      />

      <ReportsCharts
        rapportDons={rapportDons}
        rapportDonneurs={rapportDonneurs}
        rapportHopitaux={rapportHopitaux}
        isLoading={isLoading}
      />

      <ReportsExports />
    </div>
  );
}
