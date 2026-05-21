import clsx from "clsx";

type DonationStatus = "validated" | "pending" | "rejected";

interface Donation {
  id: string;
  donor: string;
  group: string;
  date: string;
  status: DonationStatus;
}

const statusConfig = {
  validated: { label: "Validé", class: "bg-green-50 text-green-700" },
  pending: { label: "En attente", class: "bg-amber-50 text-amber-700" },
  rejected: { label: "Rejeté", class: "bg-red-50 text-red-700" },
};

export function RecentDonations({ donations }: { donations: Donation[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Dons récents</h2>
        <button className="text-xs text-red-600 font-medium hover:underline">
          Voir tout
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {donations.map((donation) => {
          const config = statusConfig[donation.status];
          return (
            <div
              key={donation.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">
                    {donation.group}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{donation.donor}</p>
                  <p className="text-xs text-gray-400">{donation.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-400">{donation.date}</p>
                <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", config.class)}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}