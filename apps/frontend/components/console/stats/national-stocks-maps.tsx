"use client";

import clsx from "clsx";

const departments = [
  { name: "Littoral", capital: "Cotonou", status: "critical" as const, poches: 151, centers: 8 },
  { name: "Ouémé", capital: "Porto-Novo", status: "low" as const, poches: 89, centers: 5 },
  { name: "Borgou", capital: "Parakou", status: "ok" as const, poches: 203, centers: 6 },
  { name: "Atlantique", capital: "Abomey-Calavi", status: "ok" as const, poches: 178, centers: 7 },
  { name: "Zou", capital: "Abomey", status: "low" as const, poches: 64, centers: 4 },
  { name: "Collines", capital: "Savalou", status: "ok" as const, poches: 112, centers: 3 },
  { name: "Mono", capital: "Lokossa", status: "critical" as const, poches: 28, centers: 2 },
  { name: "Couffo", capital: "Aplahoué", status: "low" as const, poches: 45, centers: 2 },
  { name: "Atacora", capital: "Natitingou", status: "ok" as const, poches: 134, centers: 4 },
  { name: "Donga", capital: "Djougou", status: "ok" as const, poches: 98, centers: 3 },
  { name: "Alibori", capital: "Kandi", status: "low" as const, poches: 52, centers: 2 },
  { name: "Plateau", capital: "Pobè", status: "ok" as const, poches: 87, centers: 3 },
];

const statusConfig = {
  ok: { label: "Normal", dot: "bg-green-500", badge: "bg-green-50 text-green-700", row: "" },
  low: { label: "Faible", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700", row: "bg-amber-50/40" },
  critical: { label: "Critique", dot: "bg-red-500", badge: "bg-red-50 text-red-700", row: "bg-red-50/40" },
};

export function NationalStocksMap() {
  const total = departments.reduce((s, d) => s + d.poches, 0);
  const criticals = departments.filter((d) => d.status === "critical");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Stocks par département
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {total.toLocaleString()} poches au total · 12 départements
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(["ok", "low", "critical"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${statusConfig[s].dot}`} />
              <span className="text-xs text-gray-500">{statusConfig[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerte critique */}
      {criticals.length > 0 && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <span className="text-sm">🚨</span>
          <p className="text-xs text-red-700 font-medium">
            {criticals.map((d) => d.name).join(", ")} — stocks critiques
          </p>
        </div>
      )}

      {/* Tableau */}
      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
        {departments
          .sort((a, b) => {
            const order = { critical: 0, low: 1, ok: 2 };
            return order[a.status] - order[b.status];
          })
          .map((dept) => {
            const config = statusConfig[dept.status];
            const max = Math.max(...departments.map((d) => d.poches));
            const pct = Math.round((dept.poches / max) * 100);

            return (
              <div
                key={dept.name}
                className={clsx(
                  "px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors",
                  config.row
                )}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        {dept.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {dept.capital}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {dept.poches} poches
                      </span>
                      <span
                        className={clsx(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          config.badge
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full",
                        dept.status === "critical"
                          ? "bg-red-500"
                          : dept.status === "low"
                          ? "bg-amber-500"
                          : "bg-green-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">{dept.centers} centres</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}