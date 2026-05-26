"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  SearchNormal1, Edit2, Trash, TickCircle, CloseCircle,
  Lock, People, ShieldTick, Hospital, User,
} from "iconsax-reactjs";
import type { UserAPI } from "@/lib/api/consoleApi";

const ROLE_CFG: Record<string, { label: string; bg: string; text: string }> = {
  donneur:       { label: "Donneur",       bg: "bg-red-50",     text: "text-red-700"     },
  medecin:       { label: "Médecin",       bg: "bg-blue-50",    text: "text-blue-700"    },
  infirmier:     { label: "Infirmier",     bg: "bg-teal-50",    text: "text-teal-700"    },
  admin_hopital: { label: "Admin Hôpital", bg: "bg-purple-50",  text: "text-purple-700"  },
  super_admin:   { label: "Super Admin",   bg: "bg-gray-100",   text: "text-gray-700"    },
};

const ROLE_FILTERS = ["Tous", "donneur", "medecin", "infirmier", "admin_hopital", "super_admin"];
const STATUT_FILTERS = ["Tous", "actif", "inactif"];

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function initials(u: UserAPI) {
  const name = u.nomComplet || `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || u.email;
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

interface Props {
  users: UserAPI[];
  loading: boolean;
  onEdit: (u: UserAPI) => void;
  onDelete: (u: UserAPI) => void;
  onToggleStatut: (u: UserAPI) => void;
  onResetPassword: (u: UserAPI) => void;
  actionId: string | null;
  // Controlled filters
  search: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleChange: (v: string) => void;
  statutFilter: string;
  onStatutChange: (v: string) => void;
}

export function UsersList({
  users, loading, onEdit, onDelete, onToggleStatut, onResetPassword, actionId,
  search, onSearchChange, roleFilter, onRoleChange, statutFilter, onStatutChange,
}: Props) {
  const [selected, setSelected] = useState<UserAPI | null>(null);

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1 size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher un utilisateur…"
            value={search} onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>

        <div className="flex gap-2">
          {ROLE_FILTERS.map((r) => (
            <button key={r} onClick={() => onRoleChange(r)}
              className={clsx("px-3 py-2 rounded-xl text-xs font-medium transition-all",
                roleFilter === r ? "bg-red-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
              )}>
              {r === "Tous" ? "Tous rôles" : (ROLE_CFG[r]?.label ?? r)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {STATUT_FILTERS.map((s) => (
            <button key={s} onClick={() => onStatutChange(s)}
              className={clsx("px-3 py-2 rounded-xl text-xs font-medium transition-all",
                statutFilter === s ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              )}>
              {s === "Tous" ? "Tous statuts" : s === "actif" ? "Actifs" : "Inactifs"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Utilisateur</div>
            <div className="col-span-2">Rôle</div>
            <div className="col-span-3">Hôpital</div>
            <div className="col-span-1 text-center">Statut</div>
            <div className="col-span-1 text-center">Inscrit le</div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-50">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 px-6 py-4 items-center gap-2">
                {[4, 2, 3, 1, 1, 1].map((span, j) => (
                  <div key={j} className={`col-span-${span} h-5 bg-gray-100 rounded-lg animate-pulse`} />
                ))}
              </div>
            ))}

            {!loading && users.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                <People size={32} color="#d1d5db" className="mx-auto mb-2" />
                Aucun utilisateur trouvé
              </div>
            )}

            {!loading && users.map((u) => {
              const cfg = ROLE_CFG[u.role] ?? ROLE_CFG.donneur;
              const isSelected = selected?.id === u.id;
              return (
                <div key={u.id} onClick={() => setSelected(isSelected ? null : u)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-3.5 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    isSelected && "bg-red-50"
                  )}>
                  {/* Avatar + nom */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                      u.estActif ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400"
                    )}>
                      {initials(u)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {u.nomComplet || `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || "—"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>

                  {/* Rôle */}
                  <div className="col-span-2">
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", cfg.bg, cfg.text)}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Hôpital */}
                  <div className="col-span-3">
                    {u.hopital ? (
                      <div className="flex items-center gap-1.5">
                        <Hospital size={12} color="#6b7280" />
                        <span className="text-xs text-gray-600 truncate">{u.hopital.nom}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* Statut */}
                  <div className="col-span-1 flex justify-center">
                    <div className={clsx("w-2 h-2 rounded-full", u.estActif ? "bg-green-500" : "bg-gray-300")} />
                  </div>

                  {/* Date */}
                  <div className="col-span-1 text-center">
                    <span className="text-xs text-gray-400">{fmt(u.creeLe)}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-1 pr-1" onClick={(e) => e.stopPropagation()}>
                    <button title="Modifier" onClick={() => onEdit(u)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button title="Supprimer" onClick={() => onDelete(u)}
                      disabled={actionId === u.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                      <Trash size={13} />
                    </button>
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
              <h3 className="text-sm font-semibold text-gray-900">Détails</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Avatar + nom */}
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black",
                  selected.estActif ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400"
                )}>
                  {initials(selected)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selected.nomComplet || `${selected.prenom ?? ""} ${selected.nom ?? ""}`.trim() || "—"}
                  </p>
                  <p className="text-xs text-gray-400">{selected.email}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {(() => {
                  const cfg = ROLE_CFG[selected.role] ?? ROLE_CFG.donneur;
                  return (
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", cfg.bg, cfg.text)}>
                      {cfg.label}
                    </span>
                  );
                })()}
                <span className={clsx(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  selected.estActif ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                )}>
                  {selected.estActif ? "Actif" : "Inactif"}
                </span>
              </div>

              {/* Infos */}
              {[
                { label: "Téléphone", value: selected.telephone || "—" },
                { label: "Commune",   value: selected.commune   || "—" },
                { label: "Inscrit le", value: fmt(selected.creeLe) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}

              {selected.hopital && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Hôpital</p>
                  <div className="flex items-center gap-1.5">
                    <Hospital size={13} color="#6b7280" />
                    <p className="text-sm font-medium text-gray-900">{selected.hopital.nom}</p>
                  </div>
                </div>
              )}

              {/* Actions panel */}
              <div className="space-y-2 pt-1">
                <button onClick={() => { onEdit(selected); setSelected(null); }}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                  <Edit2 size={13} /> Modifier
                </button>

                <button onClick={() => onToggleStatut(selected)} disabled={actionId === selected.id}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50",
                    selected.estActif
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}>
                  {selected.estActif ? <CloseCircle size={13} variant="Bold" /> : <TickCircle size={13} variant="Bold" />}
                  {selected.estActif ? "Désactiver le compte" : "Activer le compte"}
                </button>

                <button onClick={() => { onResetPassword(selected); setSelected(null); }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-colors">
                  <Lock size={13} variant="Bold" /> Réinitialiser le mot de passe
                </button>

                <button onClick={() => { onDelete(selected); setSelected(null); }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                  <Trash size={13} variant="Bold" /> Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
