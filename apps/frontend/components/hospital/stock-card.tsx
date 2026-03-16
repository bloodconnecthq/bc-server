import clsx from "clsx";

type StockStatus = "ok" | "low" | "critical";

interface StockCardProps {
  group: string;
  level: number;
  units: number;
  status: StockStatus;
}

const statusConfig = {
  ok: {
    bar: "bg-green-500",
    badge: "bg-green-50 text-green-700",
    label: "Normal",
  },
  low: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    label: "Faible",
  },
  critical: {
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700",
    label: "Critique",
  },
};

export function StockCard({ group, level, units, status }: StockCardProps) {
  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <span className="text-sm font-bold text-red-600">{group}</span>
        </div>
        <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", config.badge)}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-gray-900">{units}</span>
          <span className="text-xs text-gray-400 mb-1">poches</span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all", config.bar)}
            style={{ width: `${level}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{level}% de capacité</p>
      </div>
    </div>
  );
}