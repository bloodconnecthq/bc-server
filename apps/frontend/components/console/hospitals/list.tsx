"use client";

import { useState, useRef, useEffect } from "react";
import { Pagination } from "@heroui/react";
import clsx from "clsx";
import { SearchNormal1, Edit2, Warning2, Trash } from "iconsax-reactjs";
import { ConfirmModal } from "@/components/ui/confirm-modal";

/* ── Native checkbox ─────────────────────────────────────────────── */
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

/* ── Types ───────────────────────────────────────────────────────── */
type HospitalType = "cnts" | "chu" | "antenne" | "hopital" | "centre" | "mobile";
type HospitalStatus = "active" | "inactive";
type StockStatus = "ok" | "low" | "critical";

interface Hospital {
  id: string; name: string; type: HospitalType;
  commune: string; department: string; address: string;
  phone: string; email: string;
  members: number; donations: number; stock: number;
  status: HospitalStatus; stockStatus: StockStatus; createdAt: string;
}

const typeConfig: Record<HospitalType, { label: string; bg: string; text: string }> = {
  cnts:    { label: "CNTS",    bg: "bg-red-50",    text: "text-red-700"    },
  chu:     { label: "CHU",     bg: "bg-blue-50",   text: "text-blue-700"   },
  antenne: { label: "Antenne", bg: "bg-purple-50", text: "text-purple-700" },
  hopital: { label: "Hôpital", bg: "bg-green-50",  text: "text-green-700"  },
  centre:  { label: "Centre",  bg: "bg-amber-50",  text: "text-amber-700"  },
  mobile:  { label: "Mobile",  bg: "bg-gray-100",  text: "text-gray-600"   },
};

const stockConfig: Record<StockStatus, { badge: string; label: string }> = {
  ok:       { badge: "bg-green-50 text-green-700", label: "Normal"   },
  low:      { badge: "bg-amber-50 text-amber-700", label: "Faible"   },
  critical: { badge: "bg-red-50 text-red-700",     label: "Critique" },
};

const TYPE_FILTERS = ["Tous", "CNTS", "CHU", "Antenne", "Hôpital", "Centre", "Mobile"];
const PAGE_SIZE = 8;

/* ── Props ───────────────────────────────────────────────────────── */
interface HospitalsListProps {
  hospitals: Hospital[];
  isLoading?: boolean;
  onEdit?: (hospital: Hospital) => void;
  onStatusChange?: (id: string, estActif: boolean) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

export function HospitalsList({
  hospitals, isLoading, onEdit, onStatusChange, onDelete, onBulkDelete,
}: HospitalsListProps) {
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("Tous");
  const [selected, setSelected]       = useState<Hospital | null>(null);
  const [pendingId, setPendingId]     = useState<string | null>(null);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Hospital | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage]               = useState(1);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = hospitals.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch = h.name.toLowerCase().includes(q) || h.commune.toLowerCase().includes(q) || h.department.toLowerCase().includes(q);
    const matchType   = typeFilter === "Tous" || typeConfig[h.type].label === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, typeFilter]);

  const allSelected  = paginated.length > 0 && paginated.every((h) => selectedIds.has(h.id));
  const someSelected = paginated.some((h) => selectedIds.has(h.id));

  const toggleOne = (id: string) => setSelectedIds((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleAll = () => {
    if (allSelected) setSelectedIds((prev) => { const n = new Set(prev); paginated.forEach((h) => n.delete(h.id)); return n; });
    else             setSelectedIds((prev) => { const n = new Set(prev); paginated.forEach((h) => n.add(h.id));    return n; });
  };

  const handleBulkDeleteConfirm = async () => {
    if (!onBulkDelete) return;
    const count = selectedIds.size;
    setBulkLoading(true);
    try {
      await onBulkDelete([...selectedIds]);
      setSelectedIds(new Set()); setBulkConfirm(false);
      showToast(`${count} établissement${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`);
    } catch (err: any) {
      showToast(err?.message ?? "Erreur lors de la suppression", "error");
    } finally { setBulkLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !onDelete) return;
    setDeleteLoading(true);
    try {
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) setSelected(null);
      showToast("Établissement supprimé.");
    } catch (err: any) {
      showToast(err?.message ?? "Erreur lors de la suppression", "error");
    } finally { setDeleteLoading(false); }
  };

  const handleStatusToggle = async (hospital: Hospital) => {
    setPendingId(hospital.id);
    try {
      const activate = hospital.status !== "active";
      await onStatusChange?.(hospital.id, activate);
      showToast(activate ? "Établissement activé." : "Établissement suspendu.");
      setSelected(null);
    } catch (err: any) {
      showToast(err?.message ?? "Une erreur est survenue", "error");
    } finally { setPendingId(null); }
  };

  /* ── Pagination helpers ─────────────────────────────────────────── */
  const pageNums = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border",
          toast.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>
          {toast.type === "error" && <Warning2 size={16} className="shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1 size={15} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher un établissement..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                typeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}>
              {f}
            </button>
          ))}
        </div>
        {!isLoading && (
          <span className="ml-auto text-xs font-semibold text-gray-400">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Bulk bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
          </span>
          <button onClick={() => setBulkConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
            <Trash size={13} />
            Supprimer la sélection
          </button>
          <button onClick={() => setSelectedIds(new Set())}
            className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">
            Annuler
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
            <div className="col-span-1 flex items-center">
              <NativeCheckbox checked={allSelected} indeterminate={someSelected && !allSelected}
                onChange={toggleAll} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className="col-span-3">Établissement</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1 text-center">Membres</div>
            <div className="col-span-1 text-center">Dons</div>
            <div className="col-span-1 text-center">Poches</div>
            <div className="col-span-1 text-center">Stocks</div>
            <div className="col-span-1 text-center">Statut</div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-50">
            {isLoading && Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 px-6 py-4 items-center gap-2">
                {[1, 3, 2, 1, 1, 1, 1, 1, 1].map((span, j) => (
                  <div key={j} className={`col-span-${span} h-5 bg-gray-100 rounded-lg animate-pulse`} />
                ))}
              </div>
            ))}
            {!isLoading && paginated.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">Aucun établissement trouvé</div>
            )}
            {!isLoading && paginated.map((h) => {
              const tCfg = typeConfig[h.type];
              const sCfg = stockConfig[h.stockStatus];
              return (
                <div key={h.id} onClick={() => setSelected(h)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === h.id && "bg-red-50"
                  )}>
                  <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <NativeCheckbox checked={selectedIds.has(h.id)} onChange={() => toggleOne(h.id)} />
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.commune} · {h.department}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", tCfg.bg, tCfg.text)}>{tCfg.label}</span>
                  </div>
                  <div className="col-span-1 text-center text-sm font-medium text-gray-700">{h.members}</div>
                  <div className="col-span-1 text-center text-sm font-medium text-gray-700">{h.donations}</div>
                  <div className="col-span-1 text-center text-sm font-medium text-gray-700">{h.stock}</div>
                  <div className="col-span-1 flex justify-center">
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", sCfg.badge)}>{sCfg.label}</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className={clsx("w-2 h-2 rounded-full", h.status === "active" ? "bg-green-500" : "bg-gray-300")} />
                  </div>
                  <div className="col-span-1 flex justify-end gap-0.5 pr-1" onClick={(e) => e.stopPropagation()}>
                    <button title="Modifier" onClick={() => onEdit?.(h)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    {onDelete && (
                      <button title="Supprimer" onClick={() => setDeleteTarget(h)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Page {page} sur {totalPages} · {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
              <Pagination>
                <Pagination.Content className="flex items-center gap-1">
                  <Pagination.Item>
                    <Pagination.Previous
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={clsx(
                        "flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                        page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                      )}
                    >&laquo; Préc.</Pagination.Previous>
                  </Pagination.Item>
                  {pageNums().map((p, i) =>
                    p === "…" ? (
                      <Pagination.Item key={`e-${i}`}>
                        <Pagination.Ellipsis className="px-2 text-gray-400 text-xs" />
                      </Pagination.Item>
                    ) : (
                      <Pagination.Item key={p}>
                        <Pagination.Link
                          onClick={() => setPage(p as number)}
                          isActive={page === p}
                          className={clsx(
                            "w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors cursor-pointer",
                            page === p
                              ? "bg-red-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
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
                        "flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                        page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                      )}
                    >Suiv. &raquo;</Pagination.Next>
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
              <h3 className="text-sm font-semibold text-gray-900">Détails</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", typeConfig[selected.type].bg, typeConfig[selected.type].text)}>
                  {typeConfig[selected.type].label}
                </span>
                <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full",
                  selected.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500")}>
                  {selected.status === "active" ? "Actif" : "Inactif"}
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selected.commune} · {selected.department}</p>
              </div>

              {[
                { label: "Adresse",   value: selected.address   || "—" },
                { label: "Téléphone", value: selected.phone     || "—" },
                { label: "Email",     value: selected.email     || "—" },
                { label: "Ajouté le", value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("fr-FR") : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{item.value}</p>
                </div>
              ))}

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: "Membres", value: selected.members,   color: "text-blue-600"  },
                  { label: "Dons",    value: selected.donations, color: "text-red-600"   },
                  { label: "Poches",  value: selected.stock,     color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-1">
                <button onClick={() => onEdit?.(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                  <Edit2 size={13} />
                  Modifier l'établissement
                </button>
                <button
                  disabled={pendingId === selected.id}
                  onClick={() => handleStatusToggle(selected)}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50",
                    selected.status === "active" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}>
                  {pendingId === selected.id ? "…" : selected.status === "active" ? "Suspendre" : "Réactiver"}
                </button>
                {onDelete && (
                  <button onClick={() => setDeleteTarget(selected)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                    <Trash size={13} />
                    Supprimer l'établissement
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={bulkConfirm}
        title="Supprimer la sélection"
        description={`Vous allez supprimer définitivement ${selectedIds.size} établissement${selectedIds.size > 1 ? "s" : ""} ainsi que toutes leurs données associées.`}
        confirmLabel={`Supprimer (${selectedIds.size})`}
        loading={bulkLoading}
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => setBulkConfirm(false)}
      />

      {/* Individual delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Supprimer l'établissement"
        description={`Vous allez supprimer définitivement "${deleteTarget?.name}". Toutes les données associées (membres, stocks, dons) seront également supprimées.`}
        confirmLabel="Supprimer"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
