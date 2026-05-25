"use client";

import { useState } from "react";
import clsx from "clsx";
import type { RapportHopitauxAPI } from "@/lib/api/consoleApi";

// ── Data helpers ─────────────────────────────────────────────────────────────

const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];

function parseMonthlyData(parMois: Record<string, number> | null | undefined, limit = 8) {
  if (!parMois) return [];
  return Object.entries(parMois)
    .filter(([k]) => k !== "inconnu" && /^\d{4}-\d{2}$/.test(k))
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-limit)
    .map(([key, val]) => {
      const [, month] = key.split("-");
      return { label: MONTHS_FR[parseInt(month) - 1] ?? key, value: val };
    });
}

const BG_COLORS: Record<string, string> = {
  "O+": "bg-red-500",   "O-": "bg-red-300",
  "A+": "bg-blue-500",  "A-": "bg-blue-300",
  "B+": "bg-emerald-500","B-": "bg-emerald-300",
  "AB+":"bg-amber-500", "AB-":"bg-amber-300",
};
const TEXT_COLORS: Record<string, string> = {
  "O+": "text-red-600",   "O-": "text-red-400",
  "A+": "text-blue-600",  "A-": "text-blue-400",
  "B+": "text-emerald-600","B-": "text-emerald-400",
  "AB+":"text-amber-600", "AB-":"text-amber-400",
};

function parseBloodGroups(parGroupe: Record<string, number> | null | undefined) {
  if (!parGroupe) return [];
  const total = Object.values(parGroupe).reduce((a, b) => a + b, 0);
  return Object.entries(parGroupe)
    .sort(([, a], [, b]) => b - a)
    .map(([group, count]) => ({
      group,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
      bg: BG_COLORS[group] ?? "bg-gray-400",
      text: TEXT_COLORS[group] ?? "text-gray-600",
    }));
}

function parseHospitalActivity(parActivite: RapportHopitauxAPI["parActivite"] | null | undefined) {
  if (!parActivite || parActivite.length === 0) return [];
  const sorted = [...parActivite].sort((a, b) => b.totalDons - a.totalDons).slice(0, 7);
  const max = sorted[0]?.totalDons || 1;
  return sorted.map((h) => ({
    name: h.nom,
    donations: h.totalDons,
    members: h.totalMembres,
    pct: max > 0 ? Math.round((h.totalDons / max) * 100) : 0,
  }));
}

// ── Types ────────────────────────────────────────────────────────────────────

type ChartView = "donations" | "groups" | "hospitals" | "status";

interface ChartsProps {
  rapportDons?: {
    total: number; valides: number; enAttente: number;
    rejetes: number; tauxValidation: number;
    parMois: Record<string, number>;
    parTypePoche: Record<string, number>;
  } | null;
  rapportDonneurs?: {
    parGroupeSanguin: Record<string, number>;
  } | null;
  rapportHopitaux?: {
    parActivite: RapportHopitauxAPI["parActivite"];
  } | null;
  isLoading?: boolean;
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-gray-300 space-y-2">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="20" width="8" height="16" rx="2" fill="currentColor" opacity=".4" />
        <rect x="16" y="12" width="8" height="24" rx="2" fill="currentColor" opacity=".6" />
        <rect x="28" y="6" width="8" height="30" rx="2" fill="currentColor" />
      </svg>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="space-y-3 py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-4 bg-gray-100 rounded animate-pulse" />
          <div
            className="h-6 bg-gray-100 rounded-lg animate-pulse"
            style={{ width: `${30 + i * 13}%` }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ReportsCharts({
  rapportDons, rapportDonneurs, rapportHopitaux, isLoading,
}: ChartsProps) {
  const [activeView, setActiveView] = useState<ChartView>("donations");

  const tabs: { key: ChartView; label: string }[] = [
    { key: "donations", label: "Dons / mois"        },
    { key: "groups",    label: "Groupes sanguins"   },
    { key: "hospitals", label: "Top établissements" },
    { key: "status",    label: "Statut des dons"    },
  ];

  const monthlyData  = parseMonthlyData(rapportDons?.parMois);
  const bloodGroups  = parseBloodGroups(rapportDonneurs?.parGroupeSanguin);
  const hospitals    = parseHospitalActivity(rapportHopitaux?.parActivite);
  const maxMonthly   = Math.max(...monthlyData.map((m) => m.value), 1);

  const donsTotal    = rapportDons?.total    || 0;
  const donsValides  = rapportDons?.valides  || 0;
  const donsAttente  = rapportDons?.enAttente || 0;
  const donsRejetes  = rapportDons?.rejetes  || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header + tabs */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Analyses & Tendances</h2>
          <p className="text-xs text-gray-400 mt-0.5">Données agrégées de la plateforme</p>
        </div>

        {/* Pill tab selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveView(t.key)}
              className={clsx(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                activeView === t.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 min-h-70">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <>
            {/* ── Tab 1 : Dons par mois ─────────────────────────────────── */}
            {activeView === "donations" && (
              <div>
                <p className="text-xs text-gray-400 mb-6">
                  Volume de dons collectés — {monthlyData.length} derniers mois enregistrés
                </p>
                {monthlyData.length === 0 ? (
                  <EmptyChart label="Aucune donnée de dons pour le moment" />
                ) : (
                  <>
                    <div className="flex items-end gap-3 h-48">
                      {monthlyData.map((m, i) => {
                        const pct = Math.round((m.value / maxMonthly) * 100);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            {/* Tooltip */}
                            <div className="relative flex flex-col items-center">
                              <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                                {m.value.toLocaleString("fr-FR")} dons
                              </span>
                              <p className="text-xs font-bold text-gray-700 mb-1">
                                {m.value > 999
                                  ? `${(m.value / 1000).toFixed(1)}k`
                                  : m.value}
                              </p>
                            </div>
                            <div className="w-full h-44 flex items-end">
                              <div
                                className="w-full bg-linear-to-t from-red-600 to-red-400 rounded-t-xl transition-all duration-500 group-hover:from-red-700 group-hover:to-red-500"
                                style={{ height: `${Math.max(pct, 4)}%`, minHeight: "6px" }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-linear-to-t from-red-600 to-red-400 rounded-sm" />
                        <span className="text-xs text-gray-500">Nombre de dons par mois</span>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">
                        Total: {(rapportDons?.total ?? 0).toLocaleString("fr-FR")} dons
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Tab 2 : Groupes sanguins ──────────────────────────────── */}
            {activeView === "groups" && (
              <div>
                <p className="text-xs text-gray-400 mb-5">
                  Répartition des donneurs par groupe sanguin
                </p>
                {bloodGroups.length === 0 ? (
                  <EmptyChart label="Aucune donnée de groupe sanguin" />
                ) : (
                  <div className="space-y-3">
                    {bloodGroups.map((g) => (
                      <div key={g.group} className="flex items-center gap-4">
                        <div className={clsx(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black text-sm",
                          g.bg.replace("bg-", "bg-").replace("-500", "-100").replace("-300", "-50"),
                          g.text
                        )}>
                          {g.group}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-gray-700">{g.group}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">
                                {g.count.toLocaleString("fr-FR")} donneurs
                              </span>
                              <span className="text-xs font-bold text-gray-900 w-10 text-right">
                                {g.pct}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={clsx("h-full rounded-full transition-all duration-700", g.bg)}
                              style={{ width: `${g.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab 3 : Top établissements ────────────────────────────── */}
            {activeView === "hospitals" && (
              <div>
                <p className="text-xs text-gray-400 mb-5">
                  Classement des établissements par volume de dons collectés
                </p>
                {hospitals.length === 0 ? (
                  <EmptyChart label="Aucune activité enregistrée" />
                ) : (
                  <div className="space-y-3">
                    {hospitals.map((h, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={clsx(
                          "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black",
                          i === 0 ? "bg-amber-100 text-amber-700"
                            : i === 1 ? "bg-gray-100 text-gray-500"
                            : i === 2 ? "bg-orange-50 text-orange-600"
                            : "bg-gray-50 text-gray-400"
                        )}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-gray-800 truncate max-w-45">
                              {h.name}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-400">{h.members} membres</span>
                              <span className="text-xs font-bold text-gray-900">
                                {h.donations.toLocaleString("fr-FR")} dons
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-red-500 to-red-400 rounded-full transition-all duration-700"
                              style={{ width: `${h.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab 4 : Statut des dons ───────────────────────────────── */}
            {activeView === "status" && (
              <div>
                <p className="text-xs text-gray-400 mb-6">
                  Répartition des dons par statut de traitement
                </p>
                {donsTotal === 0 ? (
                  <EmptyChart label="Aucun don enregistré" />
                ) : (
                  <>
                    {/* Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        {
                          label: "Validés",
                          value: donsValides,
                          pct: Math.round((donsValides / donsTotal) * 100),
                          bg: "bg-green-50",
                          text: "text-green-700",
                          bar: "bg-green-500",
                          emoji: "✅",
                        },
                        {
                          label: "En attente",
                          value: donsAttente,
                          pct: Math.round((donsAttente / donsTotal) * 100),
                          bg: "bg-amber-50",
                          text: "text-amber-700",
                          bar: "bg-amber-400",
                          emoji: "⏳",
                        },
                        {
                          label: "Rejetés",
                          value: donsRejetes,
                          pct: Math.round((donsRejetes / donsTotal) * 100),
                          bg: "bg-red-50",
                          text: "text-red-700",
                          bar: "bg-red-500",
                          emoji: "❌",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className={clsx("rounded-2xl p-5 text-center border border-transparent", s.bg)}
                        >
                          <p className="text-3xl mb-1">{s.emoji}</p>
                          <p className={clsx("text-3xl font-black", s.text)}>
                            {s.pct}%
                          </p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{s.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {s.value.toLocaleString("fr-FR")} dons
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Stacked bar */}
                    <div>
                      <div className="w-full h-4 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-green-500 h-full transition-all"
                          style={{ width: `${Math.round((donsValides / donsTotal) * 100)}%` }}
                        />
                        <div
                          className="bg-amber-400 h-full transition-all"
                          style={{ width: `${Math.round((donsAttente / donsTotal) * 100)}%` }}
                        />
                        <div
                          className="bg-red-500 h-full transition-all flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-6 mt-3">
                        {[
                          { color: "bg-green-500", label: "Validés"    },
                          { color: "bg-amber-400", label: "En attente" },
                          { color: "bg-red-500",   label: "Rejetés"    },
                        ].map((l) => (
                          <div key={l.label} className="flex items-center gap-1.5">
                            <div className={clsx("w-2.5 h-2.5 rounded-full shrink-0", l.color)} />
                            <span className="text-xs text-gray-500">{l.label}</span>
                          </div>
                        ))}
                        <span className="ml-auto text-xs font-semibold text-gray-700">
                          {donsTotal.toLocaleString("fr-FR")} dons au total
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
