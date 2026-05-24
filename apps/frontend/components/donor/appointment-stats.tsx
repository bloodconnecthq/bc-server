"use client";

import { Clock, TickCircle, Calendar } from "iconsax-reactjs";

interface Props {
  planifie: number;
  confirme: number;
  effectue: number;
}

const stats = [
  {
    key: "planifie" as const,
    label: "Planifiés",
    icon: Clock,
    iconColor: "#f59e0b",
    bg: "bg-amber-50",
    textColor: "text-amber-500",
  },
  {
    key: "confirme" as const,
    label: "Confirmés",
    icon: TickCircle,
    iconColor: "#16a34a",
    bg: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    key: "effectue" as const,
    label: "Effectués",
    icon: Calendar,
    iconColor: "#dc2626",
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
];

export function AppointmentStats({ planifie, confirme, effectue }: Props) {
  const values = { planifie, confirme, effectue };

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ key, label, icon: Icon, iconColor, bg, textColor }) => (
        <div
          key={key}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
        >
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
            <Icon size={20} color={iconColor} variant="Bold" />
          </div>
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-2xl font-bold ${textColor}`}>{values[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
