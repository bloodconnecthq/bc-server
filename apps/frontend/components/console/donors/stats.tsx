import { Drop, Health, TickCircle, Warning2, Pause, People } from "iconsax-reactjs";

interface DonorsStatsProps {
  active: number;
  suspended: number;
  inactive: number;
  eligible: number;
  total: number;
}

export function DonorsStats({ active, suspended, inactive, eligible, total }: DonorsStatsProps) {
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  const stats = [
    {
      label: "Total donneurs",
      value: total,
      sub: "inscrits sur la plateforme",
      bg: "bg-red-50",
      text: "text-red-600",
      icon: Drop,
      iconColor: "#dc2626",
    },
    {
      label: "Actifs",
      value: active,
      sub: `${pct}% du total`,
      bg: "bg-green-50",
      text: "text-green-600",
      icon: TickCircle,
      iconColor: "#16a34a",
    },
    {
      label: "Éligibles aujourd'hui",
      value: eligible,
      sub: "peuvent donner maintenant",
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: Health,
      iconColor: "#2563eb",
    },
    {
      label: "Suspendus",
      value: suspended,
      sub: "accès restreint",
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: Warning2,
      iconColor: "#d97706",
    },
    {
      label: "Inactifs",
      value: inactive,
      sub: "aucun don effectué",
      bg: "bg-gray-50",
      text: "text-gray-600",
      icon: Pause,
      iconColor: "#6b7280",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} color={s.iconColor} variant="Bold" />
            </div>
            <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
