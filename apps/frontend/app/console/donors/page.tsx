import { DonorsList } from "@/components/console/donors/list";
import { DonorsStats } from "@/components/console/donors/stats";

const donors = [
  {
    id: "BC-2024-08412",
    firstName: "Koffi",
    lastName: "Agossou",
    bloodGroup: "O+",
    phone: "+229 97 45 12 38",
    email: "koffi.agossou@gmail.com",
    commune: "Cotonou",
    department: "Littoral",
    totalDonations: 7,
    lastDonation: "2025-12-18",
    nextEligible: "2026-03-18",
    badge: "silver" as const,
    status: "active" as const,
    registeredAt: "2024-01-10",
  },
  {
    id: "BC-2024-07234",
    firstName: "Mèdéssè",
    lastName: "Dossou",
    bloodGroup: "A+",
    phone: "+229 96 32 11 45",
    email: "m.dossou@gmail.com",
    commune: "Cotonou",
    department: "Littoral",
    totalDonations: 4,
    lastDonation: "2026-03-16",
    nextEligible: "2026-06-14",
    badge: "silver" as const,
    status: "active" as const,
    registeredAt: "2024-02-14",
  },
  {
    id: "BC-2023-05891",
    firstName: "Fèmi",
    lastName: "Hounkpè",
    bloodGroup: "B-",
    phone: "+229 95 78 23 67",
    email: "femi.hounkpe@yahoo.fr",
    commune: "Abomey-Calavi",
    department: "Atlantique",
    totalDonations: 12,
    lastDonation: "2025-11-20",
    nextEligible: "2026-02-18",
    badge: "gold" as const,
    status: "active" as const,
    registeredAt: "2023-06-01",
  },
  {
    id: "BC-2024-09102",
    firstName: "Roland",
    lastName: "Tossou",
    bloodGroup: "AB+",
    phone: "+229 97 11 44 89",
    email: "roland.tossou@gmail.com",
    commune: "Porto-Novo",
    department: "Ouémé",
    totalDonations: 2,
    lastDonation: "2026-03-15",
    nextEligible: "2026-06-13",
    badge: "bronze" as const,
    status: "active" as const,
    registeredAt: "2024-03-20",
  },
  {
    id: "BC-2024-06543",
    firstName: "Adjoua",
    lastName: "Kpèdé",
    bloodGroup: "O-",
    phone: "+229 96 55 33 21",
    email: "adjoua.kpede@gmail.com",
    commune: "Parakou",
    department: "Borgou",
    totalDonations: 1,
    lastDonation: "2026-03-15",
    nextEligible: "2026-06-13",
    badge: "bronze" as const,
    status: "suspended" as const,
    registeredAt: "2024-04-05",
  },
  {
    id: "BC-2023-04321",
    firstName: "Brice",
    lastName: "Sènou",
    bloodGroup: "A-",
    phone: "+229 97 88 12 34",
    email: "brice.senou@gmail.com",
    commune: "Cotonou",
    department: "Littoral",
    totalDonations: 28,
    lastDonation: "2026-02-10",
    nextEligible: "2026-05-10",
    badge: "platinum" as const,
    status: "active" as const,
    registeredAt: "2023-01-15",
  },
  {
    id: "BC-2024-08899",
    firstName: "Céleste",
    lastName: "Gbénou",
    bloodGroup: "B+",
    phone: "+229 95 44 67 89",
    email: "celeste.gbenou@gmail.com",
    commune: "Abomey-Calavi",
    department: "Atlantique",
    totalDonations: 6,
    lastDonation: "2026-03-14",
    nextEligible: "2026-06-12",
    badge: "silver" as const,
    status: "active" as const,
    registeredAt: "2024-02-28",
  },
  {
    id: "BC-2023-03210",
    firstName: "Théodore",
    lastName: "Akpovi",
    bloodGroup: "O+",
    phone: "+229 96 22 55 78",
    email: "t.akpovi@gmail.com",
    commune: "Bohicon",
    department: "Zou",
    totalDonations: 0,
    lastDonation: "",
    nextEligible: "",
    badge: "none" as const,
    status: "inactive" as const,
    registeredAt: "2023-08-10",
  },
];

export default function DonorsPage() {
  const active = donors.filter((d) => d.status === "active").length;
  const suspended = donors.filter((d) => d.status === "suspended").length;
  const inactive = donors.filter((d) => d.status === "inactive").length;
  const eligible = donors.filter((d) => {
    if (!d.nextEligible) return false;
    return new Date(d.nextEligible) <= new Date();
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donneurs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tous les donneurs enregistrés sur Blood-Connect
          </p>
        </div>
        <button className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
          Exporter CSV
        </button>
      </div>

      <DonorsStats
        active={active}
        suspended={suspended}
        inactive={inactive}
        eligible={eligible}
        total={donors.length}
      />

      <DonorsList donors={donors} />
    </div>
  );
}