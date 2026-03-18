import clsx from "clsx";

const hospitals = [
  {
    id: "1",
    name: "CNTS Cotonou",
    commune: "Cotonou",
    type: "CNTS",
    donations: 342,
    stock: 151,
    status: "critical" as const,
    members: 12,
  },
  {
    id: "2",
    name: "CHU de Cotonou",
    commune: "Cotonou",
    type: "CHU",
    donations: 289,
    stock: 203,
    status: "ok" as const,
    members: 8,
  },
  {
    id: "3",
    name: "Antenne CNTS Parakou",
    commune: "Parakou",
    type: "Antenne",
    donations: 198,
    stock: 178,
    status: "ok" as const,
    members: 6,
  },
  {
    id: "4",
    name: "Hôpital Zone Porto-Novo",
    commune: "Porto-Novo",
    type: "Hôpital",
    donations: 145,
    stock: 89,
    status: "low" as const,
    members: 5,
  },
  {
    id: "5",
    name: "Centre Santé Godomey",
    commune: "Abomey-Calavi",
    type: "Centre",
    donations: 112,
    stock: 64,
    status: "low" as const,
    members: 4,
  },
];

const statusConfig = {
  ok: { label: "Normal", badge: "bg-green-50 text-green-700" },
  low: { label: "Faible", badge: "bg-amber-50 text-amber-700" },
  critical: { label: "Critique", badge: "bg-red-50 text-red-700" },
};

export function TopHospitals() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Centres les plus actifs
        </h2>
        <a
          href="/console/hospitals"
          className="text-xs text-red-600 font-medium hover:underline"
        >
          Voir tous les centres →
        </a>
      </div>

      {/* En-tête colonnes */}
      <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">Établissement</div>
        <div className="col-span-2 text-center">Type</div>
        <div className="col-span-2 text-center">Dons ce mois</div>
        <div className="col-span-2 text-center">Stock actuel</div>
        <div className="col-span-1 text-center">Membres</div>
        <div className="col-span-1 text-center">Statut</div>
      </div>

      <div className="divide-y divide-gray-50">
        {hospitals.map((h, index) => {
          const config = statusConfig[h.status];
          return (
            <div
              key={h.id}
              className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
            >
              {/* Nom */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {h.name}
                  </p>
                  <p className="text-xs text-gray-400">{h.commune}</p>
                </div>
              </div>

              {/* Type */}
              <div className="col-span-2 text-center">
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                  {h.type}
                </span>
              </div>

              {/* Dons */}
              <div className="col-span-2 text-center">
                <p className="text-sm font-bold text-gray-900">{h.donations}</p>
                <p className="text-xs text-gray-400">dons</p>
              </div>

              {/* Stock */}
              <div className="col-span-2 text-center">
                <p className="text-sm font-bold text-gray-900">{h.stock}</p>
                <p className="text-xs text-gray-400">poches</p>
              </div>

              {/* Membres */}
              <div className="col-span-1 text-center">
                <p className="text-sm font-medium text-gray-700">{h.members}</p>
              </div>

              {/* Statut */}
              <div className="col-span-1 flex justify-center">
                <span
                  className={clsx(
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    config.badge
                  )}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}