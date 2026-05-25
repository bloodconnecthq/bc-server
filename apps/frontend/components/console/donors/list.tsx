"use client";

import { useState } from "react";
import { Chip } from "@heroui/react";
import { SearchNormal1, Edit2, Trash, Warning2 } from "iconsax-reactjs";
import clsx from "clsx";
import { EditDonorModal } from "./edit-modal";
import type { UpdateDonneurPayload } from "@/lib/api/consoleApi";

type DonorStatus = "active" | "suspended" | "inactive";
type BadgeLevel = "none" | "bronze" | "silver" | "gold" | "platinum";

interface Donor {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  phone: string;
  email: string;
  commune: string;
  department: string;
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  badge: BadgeLevel;
  status: DonorStatus;
  registeredAt: string;
}

interface DonorsListProps {
  donors: Donor[];
  isLoading?: boolean;
  token?: string | null;
  onStatusChange?: (id: string, estActif: boolean) => Promise<void>;
  onEdit?: (id: string, data: UpdateDonneurPayload) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const statusConfig: Record<DonorStatus, { label: string; color: "success" | "warning" | "default" }> = {
  active:    { label: "Actif",     color: "success"  },
  suspended: { label: "Suspendu",  color: "warning"  },
  inactive:  { label: "Inactif",   color: "default"  },
};

const badgeConfig: Record<BadgeLevel, { emoji: string; label: string }> = {
  none:     { emoji: "—",  label: "Aucun"   },
  bronze:   { emoji: "🥉", label: "Bronze"  },
  silver:   { emoji: "🥈", label: "Argent"  },
  gold:     { emoji: "🥇", label: "Or"      },
  platinum: { emoji: "💎", label: "Platine" },
};

const filters = ["Tous", "Actifs", "Éligibles", "Suspendus", "Inactifs"];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function isEligible(nextEligible: string) {
  if (!nextEligible) return false;
  return new Date(nextEligible) <= new Date();
}

export function DonorsList({ donors, isLoading, onStatusChange, onEdit, onDelete }: DonorsListProps) {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selected, setSelected]         = useState<Donor | null>(null);
  const [editTarget, setEditTarget]     = useState<Donor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
  const [pendingId, setPendingId]       = useState<string | null>(null);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = donors.filter((d) => {
    const matchSearch =
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
      d.commune.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "Tous" ||
      (activeFilter === "Actifs"    && d.status === "active")    ||
      (activeFilter === "Éligibles" && isEligible(d.nextEligible)) ||
      (activeFilter === "Suspendus" && d.status === "suspended") ||
      (activeFilter === "Inactifs"  && d.status === "inactive");

    return matchSearch && matchFilter;
  });

  const realId = (d: Donor) => d._id ?? d.id;

  const handleStatusAction = async (donor: Donor, activate: boolean) => {
    const id = realId(donor);
    setPendingId(id);
    try {
      await onStatusChange?.(id, activate);
      showToast(activate ? "Compte réactivé avec succès." : "Compte suspendu avec succès.");
      setSelected(null);
    } catch (err: any) {
      showToast(err?.message ?? "Une erreur est survenue", "error");
    } finally {
      setPendingId(null);
    }
  };

  const handleEdit = async (id: string, data: UpdateDonneurPayload) => {
    await onEdit?.(id, data);
    showToast("Donneur modifié avec succès.");
    if (selected && realId(selected) === id) setSelected(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = realId(deleteTarget);
    setDeletePending(true);
    try {
      await onDelete?.(id);
      showToast("Donneur supprimé avec succès.");
      setDeleteTarget(null);
      if (selected && realId(selected) === id) setSelected(null);
    } catch (err: any) {
      showToast(err?.message ?? "Erreur lors de la suppression", "error");
    } finally {
      setDeletePending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border",
          toast.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          {toast.type === "error" && <Warning2 size={16} className="shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1 size={15} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un donneur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                activeFilter === f
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Donneur</div>
            <div className="col-span-1 text-center">Groupe</div>
            <div className="col-span-2">Commune</div>
            <div className="col-span-1 text-center">Dons</div>
            <div className="col-span-1 text-center">Badge</div>
            <div className="col-span-2">Dernier don</div>
            <div className="col-span-1 text-center">Statut</div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Aucun donneur trouvé</div>
            )}
            {filtered.map((donor) => {
              const sConfig = statusConfig[donor.status];
              const bConfig = badgeConfig[donor.badge];
              const eligible = isEligible(donor.nextEligible);
              const dId = realId(donor);

              return (
                <div
                  key={donor._id ?? donor.id}
                  onClick={() => setSelected(donor)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === donor.id && "bg-red-50"
                  )}
                >
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-gray-900">{donor.firstName} {donor.lastName}</p>
                    <p className="text-xs text-gray-400 font-mono">{donor.id}</p>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">{donor.bloodGroup}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">{donor.commune || "—"}</p>
                    <p className="text-xs text-gray-400">{donor.department || "—"}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-gray-900">{donor.totalDonations}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <span title={bConfig.label} className="text-lg">{bConfig.emoji}</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600">{formatDate(donor.lastDonation)}</p>
                    {eligible && <span className="text-xs text-green-600 font-medium">● Éligible</span>}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Chip size="sm" color={sConfig.color}>{sConfig.label}</Chip>
                  </div>
                  <div
                    className="col-span-1 flex justify-end gap-1 pr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      title="Modifier"
                      onClick={() => setEditTarget(donor)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      title="Supprimer"
                      onClick={() => setDeleteTarget(donor)}
                      disabled={pendingId === dId}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start sticky top-4">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Profil donneur</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600">
                    {selected.firstName[0]}{selected.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selected.firstName} {selected.lastName}</p>
                  <p className="text-xs font-mono text-gray-400">{selected.id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-red-600">{selected.bloodGroup}</p>
                  <p className="text-xs text-red-400">Groupe</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl">{badgeConfig[selected.badge].emoji}</p>
                  <p className="text-xs text-gray-400">{badgeConfig[selected.badge].label}</p>
                </div>
                <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-blue-600">{selected.totalDonations}</p>
                  <p className="text-xs text-blue-400">Dons</p>
                </div>
              </div>

              {[
                { label: "Téléphone",   value: selected.phone || "—" },
                { label: "Email",       value: selected.email },
                { label: "Localisation", value: [selected.commune, selected.department].filter(Boolean).join(" · ") || "—" },
                { label: "Inscrit le",  value: formatDate(selected.registeredAt) },
                { label: "Dernier don", value: formatDate(selected.lastDonation) },
                { label: "Prochain don", value: selected.nextEligible ? formatDate(selected.nextEligible) : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{item.value}</p>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Statut</p>
                <Chip size="sm" color={statusConfig[selected.status].color}>
                  {statusConfig[selected.status].label}
                </Chip>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setEditTarget(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={13} />
                  Modifier le profil
                </button>

                {selected.status === "active" && (
                  <button
                    disabled={pendingId === realId(selected)}
                    onClick={() => handleStatusAction(selected, false)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-amber-50 text-amber-700 text-xs font-semibold rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {pendingId === realId(selected) ? "..." : "Suspendre le compte"}
                  </button>
                )}

                {selected.status === "suspended" && (
                  <button
                    disabled={pendingId === realId(selected)}
                    onClick={() => handleStatusAction(selected, true)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    {pendingId === realId(selected) ? "..." : "Réactiver le compte"}
                  </button>
                )}

                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash size={13} />
                  Supprimer le donneur
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <EditDonorModal
        donor={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
      />

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <Trash size={18} color="#dc2626" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Supprimer le donneur</h3>
                <p className="text-xs text-gray-500">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Vous êtes sur le point de supprimer définitivement le donneur{" "}
              <span className="font-semibold text-gray-900">
                {deleteTarget.firstName} {deleteTarget.lastName}
              </span>{" "}
              ({deleteTarget.id}) ainsi que toutes ses données associées.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deletePending}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletePending}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deletePending ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : null}
                {deletePending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
