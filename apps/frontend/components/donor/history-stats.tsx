interface HistoryStatsProps {
  total: number;
  validated: number;
  totalMl: number;
  badgesUnlocked: number;
}

export function HistoryStats({
  total,
  validated,
  totalMl,
  badgesUnlocked,
}: HistoryStatsProps) {
  const stats = [
    {
      label: "Dons effectués",
      value: validated,
      sub: `${total} au total`,
      color: "text-red-600",
      bg: "bg-red-50",
      emoji: "🩸",
    },
    {
      label: "Volume total collecté",
      value: `${(totalMl / 1000).toFixed(1)}L`,
      sub: `${totalMl} ml`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      emoji: "💧",
    },
    {
      label: "Vies potentielles sauvées",
      value: validated * 3,
      sub: "3 par don en moyenne",
      color: "text-green-600",
      bg: "bg-green-50",
      emoji: "❤️",
    },
    {
      label: "Badges débloqués",
      value: badgesUnlocked,
      sub: "sur 8 disponibles",
      color: "text-purple-600",
      bg: "bg-purple-50",
      emoji: "🏅",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl p-5 border border-gray-100"
        >
          <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
            {s.emoji}
          </div>
          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
          <p className="text-xs text-gray-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}