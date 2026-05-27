"use client";

import clsx from "clsx";

type StockStatus = "ok" | "low" | "critical";

interface DeptData {
  name: string;
  poches: number;
  centers: number;
  status: StockStatus;
}

interface Props {
  departments: DeptData[];
  isLoading: boolean;
}

const statusConfig = {
  ok:       { label: "Normal",  dot: "bg-green-500", badge: "bg-green-50 text-green-700",   row: "" },
  low:      { label: "Faible",  dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700",   row: "bg-amber-50/40" },
  critical: { label: "Critique",dot: "bg-red-500",   badge: "bg-red-50 text-red-700",       row: "bg-red-50/40" },
};

export function NationalStocksMap({ departments, isLoading }: Props) {
  const sorted = [...departments].sort((a, b) => {
    const order: Record<StockStatus, number> = { critical: 0, low: 1, ok: 2 };
    return order[a.status] - order[b.status];
  });

  const total = departments.reduce((s, d) => s + d.poches, 0);
  const criticals = departments.filter((d) => d.status === "critical");
  const max = Math.max(...departments.map((d) => d.poches), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Stocks par département</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isLoading ? "Chargement…" : `${total.toLocaleString("fr-FR")} poches · ${departments.length} département${departments.length > 1 ? "s" : ""}`}
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

      {!isLoading && criticals.length > 0 && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <span className="text-sm">🚨</span>
          <p className="text-xs text-red-700 font-medium">
            {criticals.map((d) => d.name).join(", ")} — stocks critiques
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-3 h-14 animate-pulse bg-gray-50/50" />
          ))
        ) : sorted.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            Aucune donnée de stock disponible
          </div>
        ) : (
          sorted.map((dept) => {
            const config = statusConfig[dept.status];
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
                    <span className="text-sm font-semibold text-gray-900">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {dept.poches.toLocaleString("fr-FR")} poches
                      </span>
                      <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", config.badge)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full",
                        dept.status === "critical" ? "bg-red-500"
                        : dept.status === "low" ? "bg-amber-500"
                        : "bg-green-500"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">{dept.centers} centre{dept.centers > 1 ? "s" : ""}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
