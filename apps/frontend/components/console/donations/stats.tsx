interface ConsoleDonationsStatsProps {
  total: number;
  validated: number;
  pending: number;
  rejected: number;
  expiringSoon: number;
}

export function ConsoleDonationsStats({
  total,
  validated,
  pending,
  rejected,
  expiringSoon,
}: ConsoleDonationsStatsProps) {
  const stats = [
    {
      label: "Total poches",
      value: total,
      sub: "ce mois-ci",
      bg: "bg-red-50",
      text: "text-red-600",
      emoji: "🩸",
    },
    {
      label: "Validées",
      value: validated,
      sub: `${Math.round((validated / total) * 100)}% du total`,
      bg: "bg-green-50",
      text: "text-green-600",
      emoji: "✅",
    },
    {
      label: "En attente",
      value: pending,
      sub: "tests en cours",
      bg: "bg-amber-50",
      text: "text-amber-600",
      emoji: "⏳",
    },
    {
      label: "Rejetées",
      value: rejected,
      sub: "tests positifs",
      bg: "bg-gray-50",
      text: "text-gray-500",
      emoji: "❌",
    },
    {
      label: "Expirent sous 7j",
      value: expiringSoon,
      sub: "à utiliser en priorité",
      bg: "bg-orange-50",
      text: "text-orange-600",
      emoji: "⏰",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
            {s.emoji}
          </div>
          <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
          <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
          <p className="text-xs text-gray-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}