import clsx from "clsx";

type StockStatus = "ok" | "low" | "critical";

interface HospitalRow {
  id: string;
  name: string;
  commune: string | null;
  type: string | null;
  donations: number;
  stock: number;
  members: number;
  status: StockStatus;
}

interface Props {
  hospitals: HospitalRow[];
  isLoading: boolean;
}

const statusConfig: Record<StockStatus, { label: string; badge: string }> = {
  ok:       { label: "Normal",   badge: "bg-green-50 text-green-700" },
  low:      { label: "Faible",   badge: "bg-amber-50 text-amber-700" },
  critical: { label: "Critique", badge: "bg-red-50 text-red-700" },
};

export function TopHospitals({ hospitals, isLoading }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Centres les plus actifs</h2>
        <a href="/console/hospitals" className="text-xs text-red-600 font-medium hover:underline">
          Voir tous les centres →
        </a>
      </div>

      <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">Établissement</div>
        <div className="col-span-2 text-center">Type</div>
        <div className="col-span-2 text-center">Dons validés</div>
        <div className="col-span-2 text-center">Stock actuel</div>
        <div className="col-span-1 text-center">Membres</div>
        <div className="col-span-1 text-center">Statut</div>
      </div>

      <div className="divide-y divide-gray-50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 px-6 py-4 animate-pulse bg-gray-50/50" />
          ))
        ) : hospitals.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Aucune donnée d'activité disponible
          </div>
        ) : (
          hospitals.map((h, index) => {
            const config = statusConfig[h.status];
            return (
              <div
                key={h.id}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.commune ?? "—"}</p>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    {h.type ?? "—"}
                  </span>
                </div>

                <div className="col-span-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{h.donations.toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-400">dons</p>
                </div>

                <div className="col-span-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{h.stock.toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-400">poches</p>
                </div>

                <div className="col-span-1 text-center">
                  <p className="text-sm font-medium text-gray-700">{h.members}</p>
                </div>

                <div className="col-span-1 flex justify-center">
                  <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", config.badge)}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
