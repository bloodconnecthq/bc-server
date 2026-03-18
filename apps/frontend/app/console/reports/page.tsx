import { ReportsCharts } from "@/components/console/reports/charts";
import { ReportsExports } from "@/components/console/reports/exports";
import { ReportsOverview } from "@/components/console/reports/overview";

export default function ReportsPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Exports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Statistiques nationales et exports de données Blood-Connect
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-medium text-green-700">
            Données à jour — 16 mars 2026
          </span>
        </div>
      </div>

      <ReportsOverview />
      <ReportsCharts />
      <ReportsExports />
    </div>
  );
}