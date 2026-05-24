"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useDonneurs, useRapportDonneurs } from "@/lib/hooks/useConsole";
import { updateDoneurStatut, updateDoneurAdmin, deleteDonneur } from "@/lib/api/consoleApi";
import { DonorsStats } from "@/components/console/donors/stats";
import { DonorsList } from "@/components/console/donors/list";
import type { DonneurAPI } from "@/lib/api/consoleApi";

const BADGE_MAP = {
  aucun: "none", bronze: "bronze", argent: "silver", or: "gold", platine: "platinum",
} as const;

const STATUT_MAP = {
  actif: "active", inactif: "inactive", suspendu: "suspended",
} as const;

export function mapDonor(d: DonneurAPI) {
  return {
    _id: d.id,
    id: d.codeDonneur || d.id,
    firstName: d.utilisateur?.prenom || "",
    lastName: d.utilisateur?.nom || "",
    bloodGroup: d.groupeSanguin || "?",
    phone: d.utilisateur?.telephone || "",
    email: d.utilisateur?.email || "",
    commune: d.utilisateur?.commune || "",
    department: d.utilisateur?.departement || "",
    totalDonations: d.totalDons,
    lastDonation: d.dateDernierDon || "",
    nextEligible: d.dateEligibiliteSuivante || "",
    badge: (BADGE_MAP[d.niveauBadge] ?? "none") as "none" | "bronze" | "silver" | "gold" | "platinum",
    status: (STATUT_MAP[d.statut] ?? "inactive") as "active" | "suspended" | "inactive",
    registeredAt: d.creeLe || "",
  };
}

export default function DonorsPage() {
  const { token } = useAuth();
  const { data: donneurs, isLoading, error, refetch } = useDonneurs(token);
  const { data: rapport } = useRapportDonneurs(token);

  const donors = (donneurs ?? []).map(mapDonor);

  const handleStatusChange = async (id: string, estActif: boolean) => {
    if (!token) return;
    await updateDoneurStatut(id, estActif, token);
    refetch();
  };

  const handleEdit = async (id: string, data: Record<string, string>) => {
    if (!token) return;
    await updateDoneurAdmin(id, data, token);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteDonneur(id, token);
    refetch();
  };

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

      {isLoading ? (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <DonorsStats
          total={rapport?.total ?? donors.length}
          active={rapport?.actifs ?? donors.filter((d) => d.status === "active").length}
          suspended={donors.filter((d) => d.status === "suspended").length}
          inactive={rapport?.inactifs ?? donors.filter((d) => d.status === "inactive").length}
          eligible={rapport?.eligibles ?? donors.filter((d) => d.nextEligible && new Date(d.nextEligible) <= new Date()).length}
        />
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm">
          Erreur : {error}
        </div>
      ) : (
        <DonorsList
          donors={donors}
          isLoading={isLoading}
          token={token}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
