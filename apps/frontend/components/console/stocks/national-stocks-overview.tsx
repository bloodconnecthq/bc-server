interface GroupTotal {
  group: string;
  total: number;
}

interface NationalStocksOverviewProps {
  total: number;
  critical: number;
  low: number;
  groupTotals: GroupTotal[];
}

const groupColors: Record<string, { bg: string; text: string; bar: string }> = {
  "O+":  { bg: "bg-red-50",    text: "text-red-700",    bar: "bg-red-500"    },
  "O-":  { bg: "bg-red-100",   text: "text-red-800",    bar: "bg-red-700"    },
  "A+":  { bg: "bg-blue-50",   text: "text-blue-700",   bar: "bg-blue-500"   },
  "A-":  { bg: "bg-blue-100",  text: "text-blue-800",   bar: "bg-blue-700"   },
  "B+":  { bg: "bg-green-50",  text: "text-green-700",  bar: "bg-green-500"  },
  "B-":  { bg: "bg-green-100", text: "text-green-800",  bar: "bg-green-700"  },
  "AB+": { bg: "bg-amber-50",  text: "text-amber-700",  bar: "bg-amber-500"  },
  "AB-": { bg: "bg-amber-100", text: "text-amber-800",  bar: "bg-amber-700"  },
};

export function NationalStocksOverview({
  total,
  critical,
  low,
  groupTotals,
}: NationalStocksOverviewProps) {
  const maxGroup = Math.max(...groupTotals.map((g) => g.total));

  return (
    <div className="space-y-4">
      {/* Stats globales */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total poches national",
            value: total.toLocaleString(),
            sub: "tous groupes et départements",
            bg: "bg-red-50", text: "text-red-600", emoji: "🩸",
          },
          {
            label: "Départements critiques",
            value: critical,
            sub: "intervention urgente requise",
            bg: "bg-red-50", text: "text-red-600", emoji: "🚨",
          },
          {
            label: "Départements en stock faible",
            value: low,
            sub: "surveillance renforcée",
            bg: "bg-amber-50", text: "text-amber-600", emoji: "⚠️",
          },
        ].map((s) => (
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

      {/* Totaux par groupe sanguin */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Répartition nationale par groupe sanguin
        </h2>
        <div className="grid grid-cols-8 gap-3">
          {groupTotals.map(({ group, total: groupTotal }) => {
            const colors = groupColors[group];
            const pct = Math.round((groupTotal / maxGroup) * 100);
            const isLow = groupTotal < 100;

            return (
              <div key={group} className="flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-xl p-3 text-center border ${
                    isLow ? "border-red-200" : "border-transparent"
                  } ${colors.bg}`}
                >
                  <p className={`text-lg font-black ${colors.text}`}>
                    {groupTotal}
                  </p>
                  <p className={`text-xs font-bold ${colors.text} mt-0.5`}>
                    {group}
                  </p>
                </div>
                {/* Mini barre */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isLow && (
                  <span className="text-xs text-red-500 font-semibold">⚠️</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}