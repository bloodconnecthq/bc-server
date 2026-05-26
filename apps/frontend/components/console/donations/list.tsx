"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  SearchNormal1, Drop, TickCircle, CloseCircle, Clock,
  Hospital, Profile2User, Calendar, Warning2,
} from "iconsax-reactjs";
import type { DonAPI } from "@/lib/api/consoleApi";

type Statut = "en_attente" | "valide" | "rejete";

const STATUT_CFG: Record<Statut, { label: string; bg: string; text: string; icon: typeof TickCircle }> = {
  valide:     { label: "Validé",     bg: "bg-green-50",  text: "text-green-700",  icon: TickCircle  },
  en_attente: { label: "En attente", bg: "bg-amber-50",  text: "text-amber-700",  icon: Clock       },
  rejete:     { label: "Rejeté",     bg: "bg-red-50",    text: "text-red-700",    icon: CloseCircle },
};

const FILTERS: { label: string; value: string }[] = [
  { label: "Tous", value: "tous" },
  { label: "Validés", value: "valide" },
  { label: "En attente", value: "en_attente" },
  { label: "Rejetés", value: "rejete" },
];

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function fmtDate(d: string | null) {
  if (!d) return null;
  const diff = new Date(d).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return { label: "Expirée", danger: true };
  if (days <= 7) return { label: `${days}j restants`, danger: true };
  return { label: new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), danger: false };
}

interface Props {
  dons: DonAPI[];
  loading: boolean;
  onValidate: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  actionId: string | null;
}

export function ConsoleDonationsList({ dons, loading, onValidate, onReject, actionId }: Props) {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("tous");
  const [selected, setSelected] = useState<DonAPI | null>(null);

  const filtered = dons.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      (d.nomDonneur?.toLowerCase() ?? "").includes(q) ||
      (d.donneur?.codeDonneur?.toLowerCase() ?? "").includes(q) ||
      (d.donneur?.groupeSanguin?.toLowerCase() ?? "").includes(q) ||
      (d.hopital?.nom?.toLowerCase() ?? "").includes(q) ||
      d.id.toLowerCase().includes(q);
    const matchStatut = statutFilter === "tous" || d.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1 size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher un don…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatutFilter(f.value)}
              className={clsx("px-3 py-2 rounded-xl text-xs font-medium transition-all",
                statutFilter === f.value
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
              )}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden min-w-0">
          {/* Header */}
          <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Groupe</div>
            <div className="col-span-2">Donneur</div>
            <div className="col-span-3">Centre</div>
            <div className="col-span-2">Agent</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Expiration</div>
            <div className="col-span-1 text-center">Statut</div>
          </div>

          <div className="divide-y divide-gray-50">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 px-5 py-4 items-center gap-2">
                {[1, 2, 3, 2, 2, 1, 1].map((span, j) => (
                  <div key={j} className={`col-span-${span} h-5 bg-gray-100 rounded-lg animate-pulse`} />
                ))}
              </div>
            ))}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                <Drop size={32} color="#d1d5db" className="mx-auto mb-2" />
                Aucun don trouvé
              </div>
            )}

            {!loading && filtered.map((don) => {
              const cfg = STATUT_CFG[don.statut] ?? STATUT_CFG.en_attente;
              const StatusIcon = cfg.icon;
              const expiry = fmtDate(don.dateExpiration);
              const isSelected = selected?.id === don.id;

              return (
                <div key={don.id}
                  onClick={() => setSelected(isSelected ? null : don)}
                  className={clsx(
                    "grid grid-cols-12 px-5 py-3.5 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    isSelected && "bg-red-50"
                  )}>
                  {/* Groupe sanguin */}
                  <div className="col-span-1">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-black text-red-600">{don.donneur?.groupeSanguin ?? "—"}</span>
                    </div>
                  </div>

                  {/* Donneur */}
                  <div className="col-span-2 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{don.nomDonneur || "—"}</p>
                    <p className="text-xs text-gray-400 font-mono truncate">{don.donneur?.codeDonneur ?? "—"}</p>
                  </div>

                  {/* Centre */}
                  <div className="col-span-3 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Hospital size={12} color="#9ca3af" className="shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{don.hopital?.nom ?? "—"}</span>
                    </div>
                    {don.hopital?.commune && (
                      <p className="text-xs text-gray-400 truncate pl-4">{don.hopital.commune}</p>
                    )}
                  </div>

                  {/* Agent */}
                  <div className="col-span-2 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Profile2User size={12} color="#9ca3af" className="shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{don.agent?.nomComplet ?? "—"}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} color="#9ca3af" className="shrink-0" />
                      <span className="text-xs text-gray-500">{fmt(don.dateDon)}</span>
                    </div>
                  </div>

                  {/* Expiration */}
                  <div className="col-span-1">
                    {expiry ? (
                      <div className={clsx("flex items-center gap-1", expiry.danger ? "text-red-500" : "text-gray-400")}>
                        {expiry.danger && <Warning2 size={11} className="shrink-0" />}
                        <span className="text-xs font-medium">{expiry.label}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* Statut */}
                  <div className="col-span-1 flex justify-center">
                    <span className={clsx("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", cfg.bg, cfg.text)}>
                      <StatusIcon size={11} variant="Bold" />
                      <span className="hidden xl:inline">{cfg.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side detail panel */}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start sticky top-4">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Détail du don</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Statut badge */}
              {(() => {
                const cfg = STATUT_CFG[selected.statut] ?? STATUT_CFG.en_attente;
                const Icon = cfg.icon;
                return (
                  <span className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", cfg.bg, cfg.text)}>
                    <Icon size={13} variant="Bold" /> {cfg.label}
                  </span>
                );
              })()}

              {/* Groupe sanguin + volume */}
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-white">{selected.donneur?.groupeSanguin ?? "?"}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selected.donneur?.groupeSanguin ?? "—"}</p>
                  <p className="text-xs text-gray-500">{selected.volume ?? "—"} ml · {selected.typePoche ?? "—"}</p>
                  {selected.dateExpiration && (
                    <p className="text-xs text-gray-400">
                      Exp. {new Date(selected.dateExpiration).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>

              {/* Infos */}
              {[
                { label: "Donneur", value: selected.nomDonneur || "—", Icon: Profile2User },
                { label: "Code donneur", value: selected.donneur?.codeDonneur || "—", Icon: Profile2User },
                { label: "Centre", value: selected.hopital?.nom || "—", Icon: Hospital },
                { label: "Commune", value: selected.hopital?.commune || "—", Icon: Hospital },
                { label: "Agent", value: selected.agent?.nomComplet || "—", Icon: Profile2User },
                { label: "Date du don", value: fmt(selected.dateDon), Icon: Calendar },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <item.Icon size={11} color="#9ca3af" />
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 pl-4">{item.value}</p>
                </div>
              ))}

              {/* Actions pour dons en attente */}
              {selected.statut === "en_attente" && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onValidate(selected.id)}
                    disabled={actionId === selected.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    <TickCircle size={13} variant="Bold" /> Valider
                  </button>
                  <button
                    onClick={() => onReject(selected.id)}
                    disabled={actionId === selected.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <CloseCircle size={13} variant="Bold" /> Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
