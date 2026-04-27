import { HospitalsList } from "@/components/console/hospitals/list";
import { HospitalsStats } from "@/components/console/hospitals/stats";

const hospitals = [
  {
    id: "h1",
    name: "CNTS Cotonou",
    type: "cnts" as const,
    commune: "Cotonou",
    department: "Littoral",
    address: "Avenue Jean-Paul II, Cotonou",
    phone: "+229 21 31 20 02",
    email: "cnts.cotonou@sante.bj",
    members: 12,
    donations: 342,
    stock: 151,
    status: "active" as const,
    stockStatus: "critical" as const,
    createdAt: "2024-01-10",
  },
  {
    id: "h2",
    name: "CHU de Cotonou",
    type: "chu" as const,
    commune: "Cotonou",
    department: "Littoral",
    address: "BP 386, Cotonou",
    phone: "+229 21 30 01 15",
    email: "chu.cotonou@sante.bj",
    members: 8,
    donations: 289,
    stock: 203,
    status: "active" as const,
    stockStatus: "ok" as const,
    createdAt: "2024-01-15",
  },
  {
    id: "h3",
    name: "Antenne CNTS Parakou",
    type: "antenne" as const,
    commune: "Parakou",
    department: "Borgou",
    address: "Avenue du Stade, Parakou",
    phone: "+229 23 61 07 44",
    email: "cnts.parakou@sante.bj",
    members: 6,
    donations: 198,
    stock: 178,
    status: "active" as const,
    stockStatus: "ok" as const,
    createdAt: "2024-02-01",
  },
  {
    id: "h4",
    name: "Hôpital de Zone Porto-Novo",
    type: "hopital" as const,
    commune: "Porto-Novo",
    department: "Ouémé",
    address: "Rue des Jardins, Porto-Novo",
    phone: "+229 20 21 43 78",
    email: "hz.portonovo@sante.bj",
    members: 5,
    donations: 145,
    stock: 89,
    status: "active" as const,
    stockStatus: "low" as const,
    createdAt: "2024-02-10",
  },
  {
    id: "h5",
    name: "Centre de Santé Godomey",
    type: "centre" as const,
    commune: "Abomey-Calavi",
    department: "Atlantique",
    address: "Carrefour Godomey",
    phone: "+229 97 55 44 33",
    email: "cs.godomey@sante.bj",
    members: 4,
    donations: 112,
    stock: 64,
    status: "active" as const,
    stockStatus: "low" as const,
    createdAt: "2024-03-05",
  },
  {
    id: "h6",
    name: "Antenne CNTS Natitingou",
    type: "antenne" as const,
    commune: "Natitingou",
    department: "Atacora",
    address: "Route de l'Hôpital, Natitingou",
    phone: "+229 23 82 11 44",
    email: "cnts.natitingou@sante.bj",
    members: 3,
    donations: 87,
    stock: 134,
    status: "active" as const,
    stockStatus: "ok" as const,
    createdAt: "2024-03-20",
  },
  {
    id: "h7",
    name: "Hôpital de Zone Lokossa",
    type: "hopital" as const,
    commune: "Lokossa",
    department: "Mono",
    address: "Quartier Administratif, Lokossa",
    phone: "+229 22 41 03 55",
    email: "hz.lokossa@sante.bj",
    members: 2,
    donations: 43,
    stock: 28,
    status: "inactive" as const,
    stockStatus: "critical" as const,
    createdAt: "2024-04-01",
  },
  {
    id: "h8",
    name: "Centre Mobile UAC",
    type: "mobile" as const,
    commune: "Abomey-Calavi",
    department: "Atlantique",
    address: "Université d'Abomey-Calavi",
    phone: "+229 21 36 00 74",
    email: "mobile.uac@sante.bj",
    members: 3,
    donations: 156,
    stock: 0,
    status: "active" as const,
    stockStatus: "ok" as const,
    createdAt: "2024-04-15",
  },
];

export default function HospitalsPage() {
  const active = hospitals.filter((h) => h.status === "active").length;
  const inactive = hospitals.filter((h) => h.status === "inactive").length;
  const critical = hospitals.filter((h) => h.stockStatus === "critical").length;
  const totalMembers = hospitals.reduce((s, h) => s + h.members, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hôpitaux & Centres
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tous les établissements affiliés au CNTS
          </p>
        </div>
        <button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
          + Ajouter un établissement
        </button>
      </div>

      <HospitalsStats
        active={active}
        inactive={inactive}
        critical={critical}
        totalMembers={totalMembers}
      />

      <HospitalsList hospitals={hospitals} />
    </div>
  );
}