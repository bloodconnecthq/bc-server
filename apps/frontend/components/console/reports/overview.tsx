const kpis = [
  {
    label: "Dons collectés",
    value: "3 241",
    change: "+12%",
    period: "vs mars 2025",
    positive: true,
    emoji: "🩸",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    label: "Donneurs actifs",
    value: "12 847",
    change: "+234",
    period: "nouveaux ce mois",
    positive: true,
    emoji: "👥",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Taux de fidélisation",
    value: "68%",
    change: "+5pts",
    period: "vs année dernière",
    positive: true,
    emoji: "📈",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    label: "Taux de rejet",
    value: "4.2%",
    change: "-1.1pts",
    period: "amélioration",
    positive: true,
    emoji: "✅",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    label: "Stock moyen national",
    value: "263",
    change: "-18",
    period: "poches / département",
    positive: false,
    emoji: "📦",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    label: "Départements critiques",
    value: "2",
    change: "Littoral, Mono",
    period: "intervention urgente",
    positive: false,
    emoji: "🚨",
    bg: "bg-red-50",
    text: "text-red-600",
  },
];

export function ReportsOverview() {
  return (
    <div className="grid grid-cols-6 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className={`w-9 h-9 ${k.bg} rounded-xl flex items-center justify-center text-lg mb-3`}>
            {k.emoji}
          </div>
          <p className={`text-2xl font-black ${k.text}`}>{k.value}</p>
          <p className="text-xs font-medium text-gray-700 mt-1">{k.label}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-xs font-semibold ${k.positive ? "text-green-600" : "text-red-500"}`}>
              {k.change}
            </span>
            <span className="text-xs text-gray-400">{k.period}</span>
          </div>
        </div>
      ))}
    </div>
  );
}