export function NationalStats() {
  const stats = [
    {
      label: "Donneurs actifs",
      value: "12 847",
      change: "+234 ce mois",
      positive: true,
      emoji: "🩸",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      label: "Poches collectées",
      value: "3 241",
      change: "+12% vs mars 2025",
      positive: true,
      emoji: "💉",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Centres actifs",
      value: "47",
      change: "12 départements",
      positive: true,
      emoji: "🏥",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Groupes en rupture",
      value: "3",
      change: "B-, AB-, O-",
      positive: false,
      emoji: "⚠️",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Demandes en attente",
      value: "3",
      change: "accès membres",
      positive: false,
      emoji: "🔐",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Campagnes actives",
      value: "5",
      change: "2 cette semaine",
      positive: true,
      emoji: "📢",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
            {s.emoji}
          </div>
          <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
          <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
          <p className={`text-xs mt-0.5 ${s.positive ? "text-green-600" : "text-red-500"}`}>
            {s.change}
          </p>
        </div>
      ))}
    </div>
  );
}