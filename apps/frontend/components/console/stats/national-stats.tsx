import { Drop, Health, Hospital, Danger, ShieldTick, ClipboardText } from "iconsax-reactjs";

interface StatsData {
  donneursActifs: number;
  pochesCollectees: number;
  centresActifs: number;
  groupesCritiques: number;
  demandesEnAttente: number;
  donsEnAttente: number;
}

interface Props {
  data: StatsData | null;
  isLoading: boolean;
}

export function NationalStats({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Donneurs actifs",
      value: data?.donneursActifs ?? 0,
      sub: "profils enregistrés",
      positive: true,
      icon: Drop,
      iconColor: "#dc2626",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      label: "Poches validées",
      value: data?.pochesCollectees ?? 0,
      sub: `${data?.donsEnAttente ?? 0} en attente`,
      positive: (data?.donsEnAttente ?? 0) === 0,
      icon: Health,
      iconColor: "#2563eb",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Centres actifs",
      value: data?.centresActifs ?? 0,
      sub: "tous départements",
      positive: true,
      icon: Hospital,
      iconColor: "#16a34a",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Groupes critiques",
      value: data?.groupesCritiques ?? 0,
      sub: (data?.groupesCritiques ?? 0) === 0 ? "stocks normaux" : "stock(s) en alerte",
      positive: (data?.groupesCritiques ?? 0) === 0,
      icon: Danger,
      iconColor: "#d97706",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Demandes en attente",
      value: data?.demandesEnAttente ?? 0,
      sub: "accès membres",
      positive: (data?.demandesEnAttente ?? 0) === 0,
      icon: ShieldTick,
      iconColor: "#7c3aed",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Dons à valider",
      value: data?.donsEnAttente ?? 0,
      sub: "en cours de traitement",
      positive: (data?.donsEnAttente ?? 0) === 0,
      icon: ClipboardText,
      iconColor: "#4f46e5",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} color={s.iconColor} variant="Bold" />
            </div>
            <p className={`text-2xl font-black ${s.text}`}>{s.value.toLocaleString("fr-FR")}</p>
            <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
            <p className={`text-xs mt-0.5 ${s.positive ? "text-green-600" : "text-red-500"}`}>
              {s.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
