import clsx from "clsx";

type DonationStatus = "validated" | "pending" | "rejected";

interface Donation {
  id: string;
  date: string;
  center: string;
  volume: number;
  bloodGroup: string;
  status: DonationStatus;
  badge: string | null;
}

const statusConfig = {
  validated: {
    label: "Validé",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700",
  },
  pending: {
    label: "En attente",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  rejected: {
    label: "Rejeté",
    dot: "bg-red-300",
    badge: "bg-red-50 text-red-500",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DonationTimeline({ donations }: { donations: Donation[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Historique des dons
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {donations.length} entrées
        </p>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-100" />

          <div className="space-y-6">
            {donations.map((donation, index) => {
              const config = statusConfig[donation.status];
              return (
                <div key={donation.id} className="relative pl-10">
                  {/* Point sur la timeline */}
                  <div
                    className={clsx(
                      "absolute left-0 top-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                      donation.status === "validated"
                        ? "bg-green-500"
                        : donation.status === "rejected"
                        ? "bg-red-200"
                        : "bg-amber-400"
                    )}
                  >
                    <span className="text-white text-xs font-bold">
                      {donations.length - index}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    {/* Badge spécial si présent */}
                    {donation.badge && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full mb-2">
                        🏅 {donation.badge}
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {donation.center}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(donation.date)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={clsx(
                            "text-xs font-medium px-2.5 py-1 rounded-full",
                            config.badge
                          )}
                        >
                          {config.label}
                        </span>
                        {donation.status === "validated" && (
                          <span className="text-xs text-gray-400">
                            {donation.volume} ml · {donation.bloodGroup}
                          </span>
                        )}
                        {donation.status === "rejected" && (
                          <span className="text-xs text-red-400">
                            Non éligible ce jour
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}