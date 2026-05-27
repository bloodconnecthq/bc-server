"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { RecentActivity } from "@/components/console/recent-activity";
import { NationalStats } from "@/components/console/stats/national-stats";
import { NationalStocksMap } from "@/components/console/stats/national-stocks-maps";
import { TopHospitals } from "@/components/console/stats/top-hospital";
import {
  getRapportDonneurs,
  getDonStats,
  getHopitaux,
  getStocksResumeNational,
  getDemandesAcces,
  getRapportStocks,
  getRapportHopitaux,
  getDons,
  type HopitalAPI,
  type DemandeAccesAPI,
  type DonAPI,
  type ResumeNationalAPI,
} from "@/lib/api/consoleApi";

type StockStatus = "ok" | "low" | "critical";

function fmtRel(d: string | null | undefined) {
  if (!d) return "";
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

export default function ConsoleDashboard() {
  const { token } = useAuth();
  const authToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const [statsData, setStatsData] = useState<{
    donneursActifs: number;
    pochesCollectees: number;
    centresActifs: number;
    groupesCritiques: number;
    demandesEnAttente: number;
    donsEnAttente: number;
  } | null>(null);

  const [departments, setDepartments] = useState<
    { name: string; poches: number; centers: number; status: StockStatus }[]
  >([]);

  const [topHospitals, setTopHospitals] = useState<
    {
      id: string;
      name: string;
      commune: string | null;
      type: string | null;
      donations: number;
      stock: number;
      members: number;
      status: StockStatus;
    }[]
  >([]);

  const [activities, setActivities] = useState<
    { id: string; type: string; text: string; time: string; emoji: string; color: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) return;
    setIsLoading(true);
    setError(null);

    Promise.all([
      getRapportDonneurs(authToken).catch(() => null),
      getDonStats(authToken).catch(() => null),
      getHopitaux(authToken).catch((): HopitalAPI[] => []),
      getStocksResumeNational(authToken).catch((): ResumeNationalAPI => ({})),
      getDemandesAcces(authToken).catch((): DemandeAccesAPI[] => []),
      getRapportStocks(authToken).catch(() => null),
      getRapportHopitaux(authToken).catch(() => null),
      getDons(authToken).catch((): DonAPI[] => []),
    ])
      .then(
        ([
          rapportDonneurs,
          donStats,
          hopitaux,
          resumeNational,
          demandes,
          rapportStocks,
          rapportHopitaux,
          dons,
        ]) => {
          // ── KPIs
          const centresActifs = hopitaux.filter((h) => h.estActif).length;
          const groupesCritiques = Object.values(resumeNational).filter(
            (v) => v.critique > 0
          ).length;
          const demandesEnAttente = demandes.filter((d) => d.statut === "en_attente").length;

          setStatsData({
            donneursActifs: rapportDonneurs?.actifs ?? 0,
            pochesCollectees: donStats?.valides ?? 0,
            centresActifs,
            groupesCritiques,
            demandesEnAttente,
            donsEnAttente: donStats?.enAttente ?? 0,
          });

          // ── Stocks par département: group parHopital by departement
          const hopMap = new Map(hopitaux.map((h) => [h.id, h.departement]));
          const deptAcc = new Map<
            string,
            { poches: number; centers: number; crit: number; faib: number }
          >();
          for (const h of rapportStocks?.parHopital ?? []) {
            const dept = hopMap.get(h.hopitalId) ?? (h as any).commune ?? "Inconnu";
            const ex = deptAcc.get(dept) ?? { poches: 0, centers: 0, crit: 0, faib: 0 };
            deptAcc.set(dept, {
              poches: ex.poches + h.quantiteTotale,
              centers: ex.centers + 1,
              crit: ex.crit + h.stocksCritiques,
              faib: ex.faib + h.stocksFaibles,
            });
          }
          setDepartments(
            Array.from(deptAcc.entries()).map(([name, d]) => ({
              name,
              poches: d.poches,
              centers: d.centers,
              status: (d.crit > 0 ? "critical" : d.faib > 0 ? "low" : "ok") as StockStatus,
            }))
          );

          // ── Top hôpitaux: sort parActivite by totalDons, join with stocks
          const sMap = new Map(
            (rapportStocks?.parHopital ?? []).map((h) => [h.hopitalId, h])
          );
          const tMap = new Map(hopitaux.map((h) => [h.id, h.type]));
          setTopHospitals(
            [...(rapportHopitaux?.parActivite ?? [])]
              .sort((a, b) => b.totalDons - a.totalDons)
              .slice(0, 8)
              .map((h) => {
                const s = sMap.get(h.hopitalId);
                return {
                  id: h.hopitalId,
                  name: h.nom,
                  commune: h.commune,
                  type: tMap.get(h.hopitalId) ?? null,
                  donations: h.totalDons,
                  stock: s?.quantiteTotale ?? 0,
                  members: h.totalMembres,
                  status: (
                    (s?.stocksCritiques ?? 0) > 0
                      ? "critical"
                      : (s?.stocksFaibles ?? 0) > 0
                      ? "low"
                      : "ok"
                  ) as StockStatus,
                };
              })
          );

          // ── Activité récente: merge recent dons + demandes, sorted by date
          type WithTs = {
            id: string;
            type: string;
            text: string;
            time: string;
            emoji: string;
            color: string;
            _ts: number;
          };

          const fromDons: WithTs[] = [...dons]
            .sort(
              (a, b) =>
                new Date(b.creeLe ?? "").getTime() - new Date(a.creeLe ?? "").getTime()
            )
            .slice(0, 6)
            .map((d) => ({
              id: `don-${d.id}`,
              type: "donation",
              text: `Don ${d.donneur?.groupeSanguin ?? ""} — ${d.hopital?.nom ?? "Centre inconnu"}`,
              time: fmtRel(d.creeLe),
              emoji: "🩸",
              color: "bg-red-50",
              _ts: new Date(d.creeLe ?? "").getTime(),
            }));

          const fromDemandes: WithTs[] = [...demandes]
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
            )
            .slice(0, 5)
            .map((d) => ({
              id: `req-${d.id}`,
              type: "request",
              text: `Demande d'accès — ${d.nomDemandeur}${d.hopital ? ` (${d.hopital.nom})` : ""}`,
              time: fmtRel(d.createdAt),
              emoji: "🔐",
              color: "bg-purple-50",
              _ts: new Date(d.createdAt ?? "").getTime(),
            }));

          setActivities(
            [...fromDons, ...fromDemandes]
              .sort((a, b) => b._ts - a._ts)
              .slice(0, 8)
              .map(({ _ts, ...rest }) => rest)
          );
        }
      )
      .catch((e) => setError(e?.message ?? "Erreur de chargement"))
      .finally(() => setIsLoading(false));
  }, [authToken]);

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble nationale</h1>
          <p className="text-sm text-gray-500 mt-1">
            Centre National de Transfusion Sanguine — Bénin · {today}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Système opérationnel</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <NationalStats data={statsData} isLoading={isLoading} />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <NationalStocksMap departments={departments} isLoading={isLoading} />
        </div>
        <div className="col-span-2">
          <RecentActivity activities={activities} isLoading={isLoading} />
        </div>
      </div>

      <TopHospitals hospitals={topHospitals} isLoading={isLoading} />
    </div>
  );
}
