"use client";

import { useState, useRef, useEffect } from "react";
import { Chip } from "@heroui/react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { SearchNormal1, Edit2, Trash, Warning2, Medal, Star, Diamonds, Star1 } from "iconsax-reactjs";
import { Pagination } from "@heroui/react";

function NativeCheckbox({ checked, indeterminate = false, onChange, onClick }: {
  checked: boolean; indeterminate?: boolean;
  onChange: () => void; onClick?: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate && !checked; }, [indeterminate, checked]);
  return (
    <input ref={ref} type="checkbox" checked={checked} onChange={onChange} onClick={onClick}
      className="w-4 h-4 rounded border-gray-300 accent-red-600 cursor-pointer shrink-0" />
  );
}
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
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

const statusConfig: Record<DonorStatus, { label: string; color: "success" | "warning" | "default" }> = {
  active:    { label: "Actif",     color: "success"  },
  suspended: { label: "Suspendu",  color: "warning"  },
  inactive:  { label: "Inactif",   color: "default"  },
};

type BadgeIconCfg = { label: string; icon: typeof Medal | null; color: string };
const badgeConfig: Record<BadgeLevel, BadgeIconCfg> = {
  none:     { label: "Aucun",   icon: null,    color: "#9ca3af" },
  bronze:   { label: "Bronze",  icon: Medal,   color: "#cd7f32" },
  silver:   { label: "Argent",  icon: Star1,   color: "#a8a9ad" },
  gold:     { label: "Or",      icon: Star,  color: "#f59e0b" },
  platinum: { label: "Platine", icon: Diamonds, color: "#7c3aed" },
};

function BadgeIcon({ level }: { level: BadgeLevel }) {
  const cfg = badgeConfig[level];
  if (!cfg.icon) return <span className="text-xs text-gray-300 font-medium">—</span>;
  const Icon = cfg.icon;
  return <Icon size={18} color={cfg.color} variant="Bold" />;
}

const PAGE_SIZE = 10;

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

export function DonorsList({ donors, isLoading, onStatusChange, onEdit, onDelete, onBulkDelete }: DonorsListProps) {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selected, setSelected]         = useState<Donor | null>(null);
  const [editTarget, setEditTarget]     = useState<Donor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Donor | null>(null);
  const [pendingId, setPendingId]       = useState<string | null>(null);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading]   = useState(false);
  const [bulkConfirm, setBulkConfirm]   = useState(false);
  const [page, setPage]                 = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const realId = (d: Donor) => d._id ?? d.id;

  const allSelected  = filtered.length > 0 && filtered.every((d) => selectedIds.has(realId(d)));
  const someSelected = filtered.some((d) => selectedIds.has(realId(d)));

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((d) => next.delete(realId(d)));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((d) => next.add(realId(d)));
        return next;
      });
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (!onBulkDelete) return;
    const count = selectedIds.size;
    setBulkLoading(true);
    try {
      await onBulkDelete([...selectedIds]);
      setSelectedIds(new Set());
      setBulkConfirm(false);
      showToast(`${count} donneur${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`);
    } catch (err: any) {
      showToast(err?.message ?? "Erreur lors de la suppression", "error");
    } finally {
      setBulkLoading(false);
    }
  };

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
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setPage(1); }}
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

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setBulkConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash size={13} />
            Supprimer la sélection
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
            <div className="col-span-1 flex items-center">
              <NativeCheckbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleAll}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="col-span-3">Donneur</div>
            <div className="col-span-1 text-center">Groupe</div>
            <div className="col-span-1">Commune</div>
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
            {paginated.map((donor) => {
              const sConfig = statusConfig[donor.status];
              const bConfig = badgeConfig[donor.badge];
              const eligible = isEligible(donor.nextEligible);
              const dId = realId(donor);
              const isChecked = selectedIds.has(dId);

              return (
                <div
                  key={donor._id ?? donor.id}
                  onClick={() => setSelected(donor)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === donor.id && "bg-red-50"
                  )}
                >
                  <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <NativeCheckbox
                      checked={isChecked}
                      onChange={() => toggleOne(dId)}
                    />
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-gray-900">{donor.firstName} {donor.lastName}</p>
                    <p className="text-xs text-gray-400 font-mono">{donor.id}</p>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">{donor.bloodGroup}</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-600">{donor.commune || "—"}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-gray-900">{donor.totalDonations}</p>
                  </div>
                  <div className="col-span-1 flex justify-center items-center" title={bConfig.label}>
                    <BadgeIcon level={donor.badge} />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {filtered.length} donneur{filtered.length > 1 ? "s" : ""} · page {page}/{totalPages}
              </p>
              <Pagination>
                <Pagination.Content className="flex items-center gap-1">
                  <Pagination.Item>
                    <Pagination.Previous
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                        page === 1 ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      ‹ Préc.
                    </Pagination.Previous>
                  </Pagination.Item>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <Pagination.Item key={`e-${i}`}>
                          <Pagination.Ellipsis className="px-2 text-xs text-gray-400" />
                        </Pagination.Item>
                      ) : (
                        <Pagination.Item key={p}>
                          <Pagination.Link
                            onClick={() => setPage(p as number)}
                            isActive={page === p}
                            className={clsx(
                              "w-7 h-7 flex items-center justify-center text-xs font-medium rounded-lg border transition-colors",
                              page === p ? "bg-red-600 border-red-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                          >
                            {p}
                          </Pagination.Link>
                        </Pagination.Item>
                      )
                    )}
                  <Pagination.Item>
                    <Pagination.Next
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                        page === totalPages ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      Suiv. ›
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
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
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center flex flex-col items-center gap-1">
                  <BadgeIcon level={selected.badge} />
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

      {/* Single delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer le donneur"
        description={deleteTarget ? `Vous allez supprimer définitivement le donneur ${deleteTarget.firstName} ${deleteTarget.lastName} (${deleteTarget.id}) ainsi que toutes ses données associées.` : ""}
        confirmLabel="Supprimer"
        loading={deletePending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={bulkConfirm}
        title="Supprimer la sélection"
        description={`Vous allez supprimer définitivement ${selectedIds.size} donneur${selectedIds.size > 1 ? "s" : ""} ainsi que toutes leurs données associées.`}
        confirmLabel={`Supprimer (${selectedIds.size})`}
        loading={bulkLoading}
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => setBulkConfirm(false)}
      />
    </div>
  );
}
