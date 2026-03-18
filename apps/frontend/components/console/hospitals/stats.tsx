interface HospitalsStatsProps {
  active: number;
  inactive: number;
  critical: number;
  totalMembers: number;
}

export function HospitalsStats({
  active,
  inactive,
  critical,
  totalMembers,
}: HospitalsStatsProps) {
  const stats = [
    {
      label: "Établissements actifs",
      value: active,
      sub: "connectés au système",
      bg: "bg-green-50",
      text: "text-green-600",
      emoji: "🏥",
    },
    {
      label: "Établissements inactifs",
      value: inactive,
      sub: "accès suspendu",
      bg: "bg-gray-50",
      text: "text-gray-600",
      emoji: "⏸️",
    },
    {
      label: "Stocks critiques",
      value: critical,
      sub: "nécessitent intervention",
      bg: "bg-red-50",
      text: "text-red-600",
      emoji: "🚨",
    },
    {
      label: "Total membres",
      value: totalMembers,
      sub: "médecins & agents",
      bg: "bg-blue-50",
      text: "text-blue-600",
      emoji: "👥",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
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