import { Drop, TickCircle, Clock, CloseCircle } from "iconsax-reactjs";

interface DonationsStatsProps {
  total: number;
  validated: number;
  pending: number;
  rejected: number;
}

export function DonationsStats({ total, validated, pending, rejected }: DonationsStatsProps) {
  const stats = [
    {
      label: "Total ce mois",
      value: total,
      sub: "dons enregistrés",
      bg: "bg-red-50",
      text: "text-red-600",
      icon: Drop,
      iconColor: "#dc2626",
    },
    {
      label: "Validés",
      value: validated,
      sub: total > 0 ? `${Math.round((validated / total) * 100)}% du total` : "—",
      bg: "bg-green-50",
      text: "text-green-600",
      icon: TickCircle,
      iconColor: "#16a34a",
    },
    {
      label: "En attente",
      value: pending,
      sub: "résultats de tests",
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: Clock,
      iconColor: "#d97706",
    },
    {
      label: "Rejetés",
      value: rejected,
      sub: "tests positifs",
      bg: "bg-gray-50",
      text: "text-gray-600",
      icon: CloseCircle,
      iconColor: "#6b7280",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
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
