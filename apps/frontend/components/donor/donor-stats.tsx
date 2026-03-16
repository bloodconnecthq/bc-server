interface Badge {
  label: string;
  color: string;
  emoji: string;
}

interface DonorStatsProps {
  totalDonations: number;
  badge: Badge;
  lastDonationDate: string;
  nextEligibleDate: string;
  isEligible: boolean;
  daysLeft: number;
}

const BADGE_THRESHOLDS = [
  { label: "Bronze", min: 1, max: 3, color: "bg-orange-500" },
  { label: "Argent", min: 4, max: 9, color: "bg-gray-400" },
  { label: "Or", min: 10, max: 24, color: "bg-amber-500" },
  { label: "Platine", min: 25, max: 50, color: "bg-purple-500" },
];

export function DonorStats({
  totalDonations,
  badge,
  isEligible,
  daysLeft,
}: DonorStatsProps) {
  // Calcul progression vers prochain badge
  const current = BADGE_THRESHOLDS.find(
    (b) => totalDonations >= b.min && totalDonations <= b.max
  ) || BADGE_THRESHOLDS[BADGE_THRESHOLDS.length - 1];

  const next = BADGE_THRESHOLDS.find((b) => b.min > totalDonations);
  const progress = next
    ? Math.round(((totalDonations - current.min) / (next.min - current.min)) * 100)
    : 100;

  return (
    <div className="space-y-4 h-full">
      {/* Badge actuel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Niveau actuel
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{badge.emoji}</span>
          <div>
            <p className="text-lg font-bold text-gray-900">{badge.label}</p>
            <p className="text-xs text-gray-500">{totalDonations} dons effectués</p>
          </div>
        </div>

        {next && (
          <>
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Progression vers {next.label}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${current.color}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {next.min - totalDonations} don(s) restant(s) pour{" "}
              <span className="font-medium text-gray-700">{next.label}</span>
            </p>
          </>
        )}

        {!next && (
          <div className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-2 rounded-xl">
            🎉 Niveau maximum atteint !
          </div>
        )}
      </div>

      {/* Statut don */}
      <div
        className={`rounded-2xl p-5 border ${
          isEligible
            ? "bg-green-50 border-green-200"
            : "bg-white border-gray-100"
        }`}
      >
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          Statut
        </p>
        {isEligible ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm font-bold text-green-700">
                Éligible au don
              </p>
            </div>
            <p className="text-xs text-green-600">
              Vous pouvez donner votre sang dès aujourd'hui !
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <p className="text-sm font-bold text-gray-900">
                {daysLeft} jours restants
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Période de repos entre deux dons
            </p>
          </div>
        )}
      </div>

      {/* Impact */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <p className="text-xs text-red-400 uppercase tracking-wider mb-2">
          Votre impact
        </p>
        <p className="text-3xl font-black text-red-600">
          {totalDonations * 3}
        </p>
        <p className="text-xs text-red-500 mt-1">
          vies potentiellement sauvées
        </p>
        <p className="text-xs text-red-400 mt-2">
          Chaque don peut sauver jusqu'à 3 personnes
        </p>
      </div>
    </div>
  );
}