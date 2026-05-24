"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { useHopitaux, useRapportStocks } from "@/lib/hooks/useConsole";
import { HospitalsStats } from "@/components/console/hospitals/stats";
import { HospitalsList } from "@/components/console/hospitals/list";
import type { HopitalAPI, RapportStocksAPI } from "@/lib/api/consoleApi";

function toStockStatus(h: { stocksCritiques: number; stocksFaibles: number; quantiteTotale: number }) {
  if (h.stocksCritiques > 0) return "critical" as const;
  if (h.stocksFaibles > 0) return "low" as const;
  return "ok" as const;
}

function mapHospital(h: HopitalAPI, stockInfo?: RapportStocksAPI["parHopital"][0]) {
  return {
    id: h.id,
    name: h.nom,
    type: (h.type ?? "hopital") as any,
    commune: h.commune || "",
    department: h.departement || "",
    address: h.adresse || "",
    phone: h.telephone || "",
    email: h.email || "",
    members: 0,
    donations: 0,
    stock: stockInfo?.quantiteTotale ?? 0,
    status: (h.estActif ? "active" : "inactive") as "active" | "inactive",
    stockStatus: stockInfo ? toStockStatus(stockInfo) : ("ok" as const),
    createdAt: h.createdAt || "",
  };
}

export default function HospitalsPage() {
  const { token } = useAuth();
  const { data: hopitaux, isLoading, error } = useHopitaux(token);
  const { data: rapportStocks } = useRapportStocks(token);

  const stockMap = Object.fromEntries(
    (rapportStocks?.parHopital ?? []).map((h) => [h.hopitalId, h])
  );

  const hospitals = (hopitaux ?? []).map((h) => mapHospital(h, stockMap[h.id]));

  const active = hospitals.filter((h) => h.status === "active").length;
  const inactive = hospitals.filter((h) => h.status === "inactive").length;
  const critical = hospitals.filter((h) => h.stockStatus === "critical").length;
  const totalMembers = 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hôpitaux & Centres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion de tous les établissements affiliés au CNTS
          </p>
        </div>
        <button className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
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
        <HospitalsList hospitals={hospitals} isLoading={isLoading} />
      )}
    </div>
  );
}
