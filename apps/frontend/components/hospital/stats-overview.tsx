import { Drop, People, TickCircle, Warning2 } from "iconsax-reactjs";

const stats = [
  {
    label: "Total poches disponibles",
    value: "151",
    change: "+12 cette semaine",
    positive: true,
    icon: Drop,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Dons enregistrés ce mois",
    value: "89",
    change: "+23% vs mois dernier",
    positive: true,
    icon: TickCircle,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Donneurs actifs",
    value: "234",
    change: "+8 nouveaux",
    positive: true,
    icon: People,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Alertes en cours",
    value: "2",
    change: "B- et AB- critiques",
    positive: false,
    icon: Warning2,
    color: "bg-amber-50 text-amber-600",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={16} variant="Bold" color="currentColor" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.positive ? "text-green-600" : "text-red-500"}`}>
              {stat.change}
            </p>
          </div>
        );
      })}
    </div>
  );
}