"use client";

import { Drop, TickCircle, CloseCircle, Clock, Warning2 } from "iconsax-reactjs";

interface Props {
  total: number;
  valides: number;
  enAttente: number;
  rejetes: number;
  tauxValidation: number;
  loading?: boolean;
}

export function ConsoleDonationsStats({ total, valides, enAttente, rejetes, tauxValidation, loading }: Props) {
  const stats = [
    {
      label: "Total dons",
      value: total,
      sub: "enregistrés",
      bg: "bg-red-50",
      text: "text-red-600",
      icon: Drop,
    },
    {
      label: "Validés",
      value: valides,
      sub: `${tauxValidation}% du total`,
      bg: "bg-green-50",
      text: "text-green-600",
      icon: TickCircle,
    },
    {
      label: "En attente",
      value: enAttente,
      sub: "tests en cours",
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: Clock,
    },
    {
      label: "Rejetés",
      value: rejetes,
      sub: "tests positifs",
      bg: "bg-gray-50",
      text: "text-gray-500",
      icon: CloseCircle,
    },
    {
      label: "Taux validation",
      value: `${tauxValidation}%`,
      sub: "validés / total",
      bg: "bg-blue-50",
      text: "text-blue-600",
      icon: Warning2,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            {loading ? (
              <div className="space-y-2">
                <div className="h-8 w-12 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={17} className={s.text} variant="Bold" />
                  </div>
                </div>
                <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
