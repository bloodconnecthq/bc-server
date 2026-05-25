import clsx from "clsx";

interface OverviewProps {
  rapportDons?: {
    total: number; valides: number; enAttente: number;
    rejetes: number; tauxValidation: number;
  } | null;
  rapportDonneurs?: {
    total: number; actifs: number; inactifs: number;
    eligibles: number; ayantDonne: number;
  } | null;
  rapportStocks?: { totalPoches: number; hopitauxEnCrise: number } | null;
  rapportHopitaux?: { total: number; actifs: number; inactifs: number } | null;
  isLoading?: boolean;
}

export function ReportsOverview({
  rapportDons, rapportDonneurs, rapportStocks, rapportHopitaux, isLoading,
}: OverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  const tauxRejet = rapportDons && rapportDons.total > 0
    ? Math.round((rapportDons.rejetes / rapportDons.total) * 100)
    : 0;

  const kpis = [
    {
      label: "Dons collectés",
      value: (rapportDons?.total ?? 0).toLocaleString("fr-FR"),
      badge: rapportDons ? `${rapportDons.valides} validés` : "—",
      badgeOk: true,
      emoji: "🩸",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      label: "Taux de validation",
      value: `${rapportDons?.tauxValidation ?? 0}%`,
      badge: `${rapportDons?.enAttente ?? 0} en attente`,
      badgeOk: (rapportDons?.tauxValidation ?? 0) >= 70,
      emoji: "✅",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Donneurs inscrits",
      value: (rapportDonneurs?.total ?? 0).toLocaleString("fr-FR"),
      badge: `${rapportDonneurs?.actifs ?? 0} actifs`,
      badgeOk: true,
      emoji: "👥",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Éligibles maintenant",
      value: (rapportDonneurs?.eligibles ?? 0).toLocaleString("fr-FR"),
      badge: `sur ${rapportDonneurs?.ayantDonne ?? 0} ayant déjà donné`,
      badgeOk: true,
      emoji: "💉",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Poches en stock",
      value: (rapportStocks?.totalPoches ?? 0).toLocaleString("fr-FR"),
      badge: rapportStocks?.hopitauxEnCrise
        ? `${rapportStocks.hopitauxEnCrise} sites en crise`
        : "Stocks corrects",
      badgeOk: !rapportStocks?.hopitauxEnCrise,
      emoji: "📦",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Établissements actifs",
      value: (rapportHopitaux?.actifs ?? 0).toLocaleString("fr-FR"),
      badge: `${rapportHopitaux?.inactifs ?? 0} inactifs`,
      badgeOk: (rapportHopitaux?.inactifs ?? 0) === 0,
      emoji: "🏥",
      bg: "bg-teal-50",
      text: "text-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
          <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3", k.bg)}>
            {k.emoji}
          </div>
          <p className={clsx("text-2xl font-black", k.text)}>{k.value}</p>
          <p className="text-xs font-semibold text-gray-700 mt-1">{k.label}</p>
          <p className={clsx(
            "text-xs mt-0.5 font-medium",
            k.badgeOk ? "text-gray-400" : "text-red-500"
          )}>
            {k.badge}
          </p>
        </div>
      ))}
    </div>
  );
}
