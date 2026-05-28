"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { useHopitaux, useRapportStocks, useRapportHopitaux } from "@/lib/hooks/useConsole";
import {
  createHopital,
  updateHopital,
  updateHopitalStatut,
  deleteHopital,
  type HopitalAPI,
  type RapportStocksAPI,
  type HospitalPayload,
} from "@/lib/api/consoleApi";
import { HospitalsStats } from "@/components/console/hospitals/stats";
import { HospitalsList } from "@/components/console/hospitals/list";
import { HospitalModal } from "@/components/console/hospitals/hospital-modal";

function toStockStatus(h: { stocksCritiques: number; stocksFaibles: number; quantiteTotale: number }) {
  if (h.stocksCritiques > 0) return "critical" as const;
  if (h.stocksFaibles > 0)   return "low"      as const;
  return "ok" as const;
}

function mapHospital(
  h: HopitalAPI,
  stockInfo?: RapportStocksAPI["parHopital"][0],
  activite?: { totalMembres: number; totalDons: number }
) {
  return {
    id:          h.id,
    name:        h.nom,
    type:        (h.type ?? "hopital") as any,
    commune:     h.commune     || "",
    department:  h.departement || "",
    address:     h.adresse     || "",
    phone:       h.telephone   || "",
    email:       h.email       || "",
    members:     activite?.totalMembres ?? 0,
    donations:   activite?.totalDons    ?? 0,
    stock:       stockInfo?.quantiteTotale ?? 0,
    status:      (h.estActif ? "active" : "inactive") as "active" | "inactive",
    stockStatus: stockInfo ? toStockStatus(stockInfo) : ("ok" as const),
    createdAt:   h.createdAt || "",
  };
}

export default function HospitalsPage() {
  const { token } = useAuth();
  const { data: hopitaux, isLoading, error, refetch } = useHopitaux(token);
  const { data: rapportStocks }   = useRapportStocks(token);
  const { data: rapportHopitaux } = useRapportHopitaux(token);

  // "new" = create mode, HopitalAPI object = edit mode, null = closed
  const [modalTarget, setModalTarget] = useState<HopitalAPI | "new" | null>(null);

  const stockMap = Object.fromEntries(
    (rapportStocks?.parHopital ?? []).map((h) => [h.hopitalId, h])
  );

  const activiteMap = Object.fromEntries(
    (rapportHopitaux?.parActivite ?? []).map((h) => [h.hopitalId, h])
  );

  const hospitals = (hopitaux ?? []).map((h) =>
    mapHospital(h, stockMap[h.id], activiteMap[h.id])
  );

  const active       = hospitals.filter((h) => h.status === "active").length;
  const inactive     = hospitals.filter((h) => h.status === "inactive").length;
  const critical     = hospitals.filter((h) => h.stockStatus === "critical").length;
  const totalMembers = (rapportHopitaux?.parActivite ?? []).reduce(
    (sum, h) => sum + h.totalMembres, 0
  );

  // Find the raw HopitalAPI for a mapped hospital (to pass to modal for editing)
  const findRawHopital = (id: string): HopitalAPI | null =>
    (hopitaux ?? []).find((h) => h.id === id) ?? null;

  const handleSave = async (data: HospitalPayload, id?: string) => {
    if (!token) return;
    if (id) {
      await updateHopital(id, data, token);
    } else {
      await createHopital(data, token);
    }
    refetch();
  };

  const handleStatusChange = async (id: string, estActif: boolean) => {
    if (!token) return;
    await updateHopitalStatut(id, estActif, token);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteHopital(id, token);
    refetch();
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (!token) return;
    await Promise.all(ids.map((id) => deleteHopital(id, token)));
    refetch();
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hôpitaux & Centres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tous les établissements affiliés au CNTS
          </p>
        </div>
        <button
          onClick={() => setModalTarget("new")}
          className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          + Ajouter un établissement
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <HospitalsStats
          active={active}
          inactive={inactive}
          critical={critical}
          totalMembers={totalMembers}
        />
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm">
          Erreur : {error}
        </div>
      ) : (
        <HospitalsList
          hospitals={hospitals}
          isLoading={isLoading}
          onEdit={(h) => {
            const raw = findRawHopital(h.id);
            if (raw) setModalTarget(raw);
          }}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Create / Edit modal */}
      <HospitalModal
        hospital={modalTarget}
        onClose={() => setModalTarget(null)}
        onSave={handleSave}
      />
    </div>
  );
}
