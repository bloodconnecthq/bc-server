const activities = [
  {
    id: "1",
    type: "donation",
    text: "Nouveau don enregistré — O+ au CNTS Cotonou",
    time: "Il y a 5 min",
    emoji: "🩸",
    color: "bg-red-50",
  },
  {
    id: "2",
    type: "request",
    text: "Demande d'accès — Dr. Gbénou (CHU Cotonou)",
    time: "Il y a 18 min",
    emoji: "🔐",
    color: "bg-purple-50",
  },
  {
    id: "3",
    type: "alert",
    text: "Stock critique B- — Département Mono",
    time: "Il y a 32 min",
    emoji: "🚨",
    color: "bg-red-50",
  },
  {
    id: "4",
    type: "campaign",
    text: "Campagne UAC lancée — Abomey-Calavi",
    time: "Il y a 1h",
    emoji: "📢",
    color: "bg-blue-50",
  },
  {
    id: "5",
    type: "hospital",
    text: "Nouvel hôpital enregistré — CS Lokossa",
    time: "Il y a 2h",
    emoji: "🏥",
    color: "bg-green-50",
  },
  {
    id: "6",
    type: "donation",
    text: "12 dons validés — Antenne Parakou",
    time: "Il y a 3h",
    emoji: "✅",
    color: "bg-green-50",
  },
  {
    id: "7",
    type: "alert",
    text: "Stock faible AB- — Département Ouémé",
    time: "Il y a 4h",
    emoji: "⚠️",
    color: "bg-amber-50",
  },
  {
    id: "8",
    type: "request",
    text: "Demande d'accès — Inf. Amoussou (Porto-Novo)",
    time: "Il y a 5h",
    emoji: "🔐",
    color: "bg-purple-50",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Activité récente
        </h2>
        <button className="text-xs text-red-600 font-medium hover:underline">
          Voir tout
        </button>
      </div>

      <div className="divide-y divide-gray-50 max-h-120 overflow-y-auto">
        {activities.map((a) => (
          <div
            key={a.id}
            className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 ${a.color} rounded-xl flex items-center justify-center text-sm shrink-0`}
            >
              {a.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 leading-relaxed">
                {a.text}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}