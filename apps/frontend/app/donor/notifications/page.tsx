import { NotificationsList } from "@/components/donor/notifications-list";

const notifications = [
  {
    id: "1",
    type: "eligible" as const,
    title: "Vous êtes éligible au don !",
    message: "90 jours se sont écoulés depuis votre dernier don. Vous pouvez donner à nouveau.",
    date: "2026-03-16T08:00:00",
    read: false,
  },
  {
    id: "2",
    type: "urgent" as const,
    title: "Urgence sang O- à Cotonou",
    message: "Le CNTS Cotonou manque cruellement de sang O-. Votre don peut sauver des vies aujourd'hui.",
    date: "2026-03-15T14:30:00",
    read: false,
  },
  {
    id: "3",
    type: "badge" as const,
    title: "Badge débloqué 🥈",
    message: "Félicitations ! Vous avez obtenu le badge Donneur Argent après votre 4ème don.",
    date: "2026-03-10T10:15:00",
    read: true,
  },
  {
    id: "4",
    type: "campaign" as const,
    title: "Campagne de collecte — UAC",
    message: "Une collecte mobile est organisée à l'Université d'Abomey-Calavi le mercredi 20 mars de 08h à 13h.",
    date: "2026-03-08T09:00:00",
    read: true,
  },
  {
    id: "5",
    type: "confirm" as const,
    title: "Don enregistré avec succès",
    message: "Votre don du 18 décembre 2025 au CNTS Cotonou a été validé. Merci pour votre geste !",
    date: "2025-12-18T11:45:00",
    read: true,
  },
  {
    id: "6",
    type: "urgent" as const,
    title: "Urgence sang B- à Porto-Novo",
    message: "L'Hôpital de Zone de Porto-Novo recherche des donneurs B- en urgence.",
    date: "2025-12-10T16:20:00",
    read: true,
  },
  {
    id: "7",
    type: "campaign" as const,
    title: "Campagne de collecte — Dantokpa",
    message: "Collecte mobile au Marché Dantokpa le samedi 6 décembre. Venez nombreux !",
    date: "2025-12-01T08:00:00",
    read: true,
  },
];

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unread > 0
              ? `${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}`
              : "Tout est à jour"}
          </p>
        </div>
        {unread > 0 && (
          <button className="text-xs text-red-600 font-medium hover:underline">
            Tout marquer comme lu
          </button>
        )}
      </div>

      <NotificationsList notifications={notifications} />
    </div>
  );
}