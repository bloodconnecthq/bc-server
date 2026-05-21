interface AppointmentsStatsProps {
  today: number;
  planifie: number;
  confirme: number;
  nonAssigne: number;
}

export function AppointmentsStats({
  today,
  planifie,
  confirme,
  nonAssigne,
}: AppointmentsStatsProps) {
  const stats = [
    {
      label: "RDV aujourd'hui",
      value: today,
      sub: "28 avril 2026",
      bg: "bg-blue-50",
      text: "text-blue-600",
      emoji: "📅",
    },
    {
      label: "Planifiés",
      value: planifie,
      sub: "en attente de confirmation",
      bg: "bg-amber-50",
      text: "text-amber-600",
      emoji: "⏳",
    },
    {
      label: "Confirmés",
      value: confirme,
      sub: "agent assigné",
      bg: "bg-green-50",
      text: "text-green-600",
      emoji: "✅",
    },
    {
      label: "Non assignés",
      value: nonAssigne,
      sub: "nécessitent un agent",
      bg: "bg-red-50",
      text: "text-red-600",
      emoji: "⚠️",
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