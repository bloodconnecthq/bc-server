"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Select, ListBox } from "@heroui/react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import clsx from "clsx";
import {
  SearchNormal1, Edit2, Trash, TickCircle, CloseCircle,
  Lock, People, Hospital, ArrowLeft2, ArrowRight2,
} from "iconsax-reactjs";
import type { UserAPI, UpdateUserPayload } from "@/lib/api/consoleApi";

/* ── Native checkbox with indeterminate ──────────────────────────── */
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

/* ── Constants ───────────────────────────────────────────────────── */
const ROLE_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  donneur:       { label: "Donneur",       bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-400"    },
  medecin:       { label: "Médecin",       bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
  infirmier:     { label: "Infirmier",     bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-400"   },
  admin_hopital: { label: "Admin Hôpital", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400" },
  super_admin:   { label: "Super Admin",   bg: "bg-gray-100",  text: "text-gray-700",   dot: "bg-gray-400"   },
};

const ROLE_OPTIONS = [
  { value: "donneur",       label: "Donneur"       },
  { value: "medecin",       label: "Médecin"       },
  { value: "infirmier",     label: "Infirmier(e)"  },
  { value: "admin_hopital", label: "Admin hôpital" },
  { value: "super_admin",   label: "Super Admin"   },
];

const PAGE_SIZE = 10;

/* ── Helpers ─────────────────────────────────────────────────────── */
function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
function initials(u: UserAPI) {
  const name = u.nomComplet || `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || u.email || "??";
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}
function displayName(u: UserAPI) {
  return u.nomComplet || `${u.prenom ?? ""} ${u.nom ?? ""}`.trim() || "—";
}

/* ── User Detail Modal ───────────────────────────────────────────── */
interface ModalProps {
  user: UserAPI;
  hospitals: { id: string; nom: string }[];
  actionId: string | null;
  onClose: () => void;
  onEdit: (u: UserAPI) => void;
  onDelete: (u: UserAPI) => void;
  onToggleStatut: (u: UserAPI) => void;
  onResetPassword: (u: UserAPI) => void;
  onQuickUpdate: (id: string, data: UpdateUserPayload) => Promise<void>;
}

function UserDetailModal({
  user, hospitals, actionId, onClose,
  onEdit, onDelete, onToggleStatut, onResetPassword, onQuickUpdate,
}: ModalProps) {
  const [localUser, setLocalUser]       = useState(user);
  const [pendingRole, setPendingRole]   = useState<string>(user.role);
  const [pendingHospital, setPendingHospital] = useState(user.hopital?.id ?? "");
  const [saving, setSaving]             = useState<"role" | "hospital" | null>(null);
  const [saveOk, setSaveOk]             = useState<"role" | "hospital" | null>(null);

  const cfg = ROLE_CFG[localUser.role] ?? ROLE_CFG.donneur;

  const save = async (type: "role" | "hospital") => {
    setSaving(type);
    try {
      const payload: UpdateUserPayload =
        type === "role"
          ? { role: pendingRole }
          : { hopitalId: pendingHospital || null };
      await onQuickUpdate(localUser.id, payload);
      if (type === "role") setLocalUser((u) => ({ ...u, role: pendingRole as UserAPI["role"] }));
      setSaveOk(type);
      setTimeout(() => setSaveOk(null), 2000);
    } finally {
      setSaving(null);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen onOpenChange={(open) => !open && onClose()} className="bg-gray-900/25 backdrop-blur-sm">
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="rounded-2xl shadow-2xl border border-gray-100 p-0 overflow-hidden">
            <Modal.Body className="p-0">
              <div className="flex min-h-0">

              {/* ── Left: Profile card ──────────────────────────── */}
              <div className="w-64 shrink-0 bg-gray-50 rounded-l-2xl border-r border-gray-100 flex flex-col">
                {/* Close */}
                <div className="flex justify-end p-4 pb-0">
                  <button onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors text-lg leading-none">
                    ×
                  </button>
                </div>

                {/* Avatar + identity */}
                <div className="px-6 pb-6 flex flex-col items-center gap-3 text-center">
                  {localUser.photoProfil ? (
                    <img src={localUser.photoProfil} alt={initials(localUser)}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className={clsx(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-md border-2 border-white",
                      cfg.bg
                    )}>
                      <span className={clsx("text-xl font-bold", cfg.text)}>{initials(localUser)}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">{displayName(localUser)}</p>
                    <p className="text-xs text-gray-400 mt-0.5 break-all">{localUser.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <span className={clsx("text-xs font-semibold px-2.5 py-0.5 rounded-full", cfg.bg, cfg.text)}>
                      {cfg.label}
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1",
                      localUser.estActif ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", localUser.estActif ? "bg-green-500" : "bg-gray-400")} />
                      {localUser.estActif ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>

                {/* Info fields */}
                <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
                  {[
                    { label: "Téléphone",   value: localUser.telephone   || "—" },
                    { label: "Commune",     value: localUser.commune      || "—" },
                    { label: "Département", value: localUser.departement  || "—" },
                    { label: "Inscrit le",  value: fmt(localUser.creeLe)         },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-medium text-gray-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                  {localUser.hopital && (
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Établissement actuel</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Hospital size={11} color="#6b7280" />
                        <p className="text-xs font-medium text-gray-800">{localUser.hopital.nom}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Management actions ────────────────────── */}
              <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                <h3 className="text-base font-bold text-gray-900">Gestion du compte</h3>

                {/* Identité */}
                <section className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identité</p>
                  <ActionRow
                    icon={<Edit2 size={14} color="#374151" />}
                    title="Modifier les informations"
                    desc="Nom, email, téléphone, localisation"
                    onClick={() => { onEdit(localUser); onClose(); }}
                  />
                </section>

                {/* Sécurité */}
                <section className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sécurité</p>
                  <ActionRow
                    icon={<Lock size={14} color="#1d4ed8" variant="Bold" />}
                    iconBg="bg-blue-100"
                    title="Réinitialiser le mot de passe"
                    desc="Définir un nouveau mot de passe manuellement"
                    titleColor="text-blue-800"
                    bg="bg-blue-50 hover:bg-blue-100"
                    onClick={() => { onResetPassword(localUser); onClose(); }}
                  />
                </section>

                {/* Rôle */}
                <section className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rôle</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2">
                      <Select
                        placeholder="Rôle"
                        value={pendingRole || null}
                        onChange={(key) => setPendingRole((key as string) ?? pendingRole)}
                        className="flex-1 shadow-none!"
                      >
                        <Select.Trigger className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white shadow-none! font-medium text-gray-800">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {ROLE_OPTIONS.map((r) => (
                              <ListBox.Item key={r.value} id={r.value} textValue={r.label}>
                                {r.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      <button
                        onClick={() => save("role")}
                        disabled={saving === "role" || pendingRole === localUser.role}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {saving === "role"
                          ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                          : saveOk === "role"
                            ? <TickCircle size={13} variant="Bold" />
                            : null}
                        {saveOk === "role" ? "Appliqué !" : "Appliquer"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Le rôle détermine les permissions et l'espace accessible dans le système.</p>
                  </div>
                </section>

                {/* Établissement */}
                <section className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Affectation hôpital</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2">
                      <Select
                        placeholder="— Aucun établissement —"
                        value={pendingHospital || null}
                        onChange={(key) => setPendingHospital((key as string) ?? "")}
                        className="flex-1 shadow-none!"
                      >
                        <Select.Trigger className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white shadow-none! font-medium text-gray-800">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="" textValue="Aucun établissement">
                              — Aucun établissement —
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {hospitals.map((h) => (
                              <ListBox.Item key={h.id} id={h.id} textValue={h.nom}>
                                {h.nom}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      <button
                        onClick={() => save("hospital")}
                        disabled={saving === "hospital"}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {saving === "hospital"
                          ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                          : saveOk === "hospital"
                            ? <TickCircle size={13} variant="Bold" />
                            : null}
                        {saveOk === "hospital" ? "Affecté !" : "Affecter"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Associer cet utilisateur à un hôpital ou centre de santé affilié.</p>
                  </div>
                </section>

                <div className="border-t border-gray-100" />

                {/* Compte */}
                <section className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compte</p>

                  <button
                    onClick={() => onToggleStatut(localUser)}
                    disabled={actionId === localUser.id}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left disabled:opacity-50",
                      localUser.estActif ? "bg-amber-50 hover:bg-amber-100" : "bg-green-50 hover:bg-green-100"
                    )}
                  >
                    <div className={clsx(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      localUser.estActif ? "bg-amber-100" : "bg-green-100"
                    )}>
                      {localUser.estActif
                        ? <CloseCircle size={16} color="#d97706" variant="Bold" />
                        : <TickCircle size={16} color="#16a34a" variant="Bold" />}
                    </div>
                    <div>
                      <p className={clsx("text-sm font-semibold",
                        localUser.estActif ? "text-amber-800" : "text-green-800")}>
                        {localUser.estActif ? "Désactiver le compte" : "Activer le compte"}
                      </p>
                      <p className={clsx("text-xs mt-0.5",
                        localUser.estActif ? "text-amber-500" : "text-green-500")}>
                        {localUser.estActif
                          ? "L'utilisateur ne pourra plus se connecter"
                          : "Restaurer l'accès au compte"}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => { onDelete(localUser); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
                  >
                    <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                      <Trash size={16} color="#dc2626" variant="Bold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-700">Supprimer le compte</p>
                      <p className="text-xs text-red-400 mt-0.5">Suppression définitive et irréversible</p>
                    </div>
                  </button>
                </section>
              </div>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/* ── Action row helper ───────────────────────────────────────────── */
function ActionRow({ icon, iconBg = "bg-gray-100", title, titleColor = "text-gray-800", desc, bg = "bg-gray-50 hover:bg-gray-100", onClick }: {
  icon: React.ReactNode; iconBg?: string;
  title: string; titleColor?: string; desc: string;
  bg?: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left", bg)}>
      <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        {icon}
      </div>
      <div>
        <p className={clsx("text-sm font-semibold", titleColor)}>{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

/* ── Props ───────────────────────────────────────────────────────── */
interface Props {
  users: UserAPI[];
  hospitals: { id: string; nom: string }[];
  loading: boolean;
  onEdit: (u: UserAPI) => void;
  onDelete: (u: UserAPI) => void;
  onToggleStatut: (u: UserAPI) => void;
  onResetPassword: (u: UserAPI) => void;
  onQuickUpdate: (id: string, data: UpdateUserPayload) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  actionId: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleChange: (v: string) => void;
  statutFilter: string;
  onStatutChange: (v: string) => void;
}

/* ── Main component ──────────────────────────────────────────────── */
export function UsersList({
  users, hospitals, loading,
  onEdit, onDelete, onToggleStatut, onResetPassword, onQuickUpdate, onBulkDelete, actionId,
  search, onSearchChange, roleFilter, onRoleChange, statutFilter, onStatutChange,
}: Props) {
  const [detailUser, setDetailUser]   = useState<UserAPI | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkToast, setBulkToast]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [page, setPage]               = useState(1);

  const sorted = [...users].sort((a, b) =>
    new Date(b.creeLe ?? 0).getTime() - new Date(a.creeLe ?? 0).getTime()
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [users.length, roleFilter, statutFilter, search]);

  const showBulkToast = (msg: string, ok = true) => {
    setBulkToast({ msg, ok });
    setTimeout(() => setBulkToast(null), 3500);
  };

  const allSelected  = paginated.length > 0 && paginated.every((u) => selectedIds.has(u.id));
  const someSelected = paginated.some((u) => selectedIds.has(u.id));

  const toggleOne = (id: string) => setSelectedIds((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleAll = () => {
    if (allSelected) setSelectedIds((prev) => { const n = new Set(prev); paginated.forEach((u) => n.delete(u.id)); return n; });
    else             setSelectedIds((prev) => { const n = new Set(prev); paginated.forEach((u) => n.add(u.id));    return n; });
  };

  const handleBulkDeleteConfirm = async () => {
    if (!onBulkDelete) return;
    const count = selectedIds.size;
    setBulkLoading(true);
    try {
      await onBulkDelete([...selectedIds]);
      setSelectedIds(new Set()); setBulkConfirm(false);
      showBulkToast(`${count} utilisateur${count > 1 ? "s" : ""} supprimé${count > 1 ? "s" : ""}.`);
    } catch (err: any) {
      showBulkToast(err?.message ?? "Erreur lors de la suppression", false);
    } finally { setBulkLoading(false); }
  };

  const pageButtons = () => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {bulkToast && (
        <div className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border",
          bulkToast.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>{bulkToast.msg}</div>
      )}

      {/* ── Filters (single row) ──────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 max-w-xs">
          <SearchNormal1 size={14} color="#9ca3af"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text" placeholder="Rechercher…"
            value={search} onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>

        {/* Role select */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 font-medium text-gray-700 cursor-pointer"
        >
          <option value="Tous">Tous les rôles</option>
          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>

        {/* Status pills */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {[
            { value: "Tous",   label: "Tous"     },
            { value: "actif",  label: "Actifs"   },
            { value: "inactif",label: "Inactifs" },
          ].map((s) => (
            <button key={s.value} onClick={() => onStatutChange(s.value)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                statutFilter === s.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <span className="ml-auto text-xs font-semibold text-gray-400">
            {sorted.length} résultat{sorted.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Bulk bar ─────────────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm font-semibold text-red-700">
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
          </span>
          <button onClick={() => setBulkConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
            <Trash size={13} /> Supprimer la sélection
          </button>
          <button onClick={() => setSelectedIds(new Set())}
            className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">
            Annuler
          </button>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider items-center">
          <div className="col-span-1 flex items-center">
            <NativeCheckbox checked={allSelected} indeterminate={someSelected && !allSelected}
              onChange={toggleAll} onClick={(e) => e.stopPropagation()} />
          </div>
          <div className="col-span-3">Utilisateur</div>
          <div className="col-span-2">Rôle</div>
          <div className="col-span-3">Hôpital</div>
          <div className="col-span-1 text-center">Statut</div>
          <div className="col-span-1 text-center">Inscrit le</div>
          <div className="col-span-1 text-right pr-2">Actions</div>
        </div>

        <div className="divide-y divide-gray-50">
          {loading && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 px-6 py-4 items-center gap-2">
              {[1, 3, 2, 3, 1, 1, 1].map((span, j) => (
                <div key={j} className={`col-span-${span} h-5 bg-gray-100 rounded-lg animate-pulse`} />
              ))}
            </div>
          ))}

          {!loading && paginated.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">
              <People size={32} color="#d1d5db" className="mx-auto mb-2" />
              Aucun utilisateur trouvé
            </div>
          )}

          {!loading && paginated.map((u) => {
            const cfg = ROLE_CFG[u.role] ?? ROLE_CFG.donneur;
            const isChecked = selectedIds.has(u.id);
            return (
              <div key={u.id} onClick={() => setDetailUser(u)}
                className="grid grid-cols-12 px-6 py-3.5 items-center cursor-pointer transition-colors hover:bg-gray-50">

                <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                  <NativeCheckbox checked={isChecked} onChange={() => toggleOne(u.id)} />
                </div>

                <div className="col-span-3 flex items-center gap-3">
                  {u.photoProfil ? (
                    <img src={u.photoProfil} alt={initials(u)}
                      className="w-8 h-8 rounded-xl object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                      <span className={clsx("text-xs font-bold", cfg.text)}>{initials(u)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName(u)}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", cfg.bg, cfg.text)}>
                    {cfg.label}
                  </span>
                </div>

                <div className="col-span-3">
                  {u.hopital ? (
                    <div className="flex items-center gap-1.5">
                      <Hospital size={12} color="#6b7280" />
                      <span className="text-xs text-gray-600 truncate">{u.hopital.nom}</span>
                    </div>
                  ) : <span className="text-xs text-gray-300">—</span>}
                </div>

                <div className="col-span-1 flex justify-center">
                  <div className={clsx("w-2 h-2 rounded-full", u.estActif ? "bg-green-500" : "bg-gray-300")} />
                </div>

                <div className="col-span-1 text-center">
                  <span className="text-xs text-gray-400">{fmt(u.creeLe)}</span>
                </div>

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

        {/* Pagination footer */}
        {!loading && sorted.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)}
              </span>{" "}
              sur <span className="font-semibold text-gray-600">{sorted.length}</span> utilisateurs
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowLeft2 size={14} />
              </button>
              {pageButtons().map((p, i) =>
                p === "…" ? (
                  <span key={`el-${i}`} className="px-1 text-xs text-gray-400">…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p as number)}
                    className={clsx(
                      "min-w-[28px] h-7 px-1 rounded-lg text-xs font-semibold transition-colors",
                      page === p ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-100"
                    )}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ArrowRight2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail modal ─────────────────────────────────────────── */}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          hospitals={hospitals}
          actionId={actionId}
          onClose={() => setDetailUser(null)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatut={onToggleStatut}
          onResetPassword={onResetPassword}
          onQuickUpdate={onQuickUpdate}
        />
      )}

      {/* ── Bulk delete confirm ───────────────────────────────────── */}
      <ConfirmModal
        isOpen={bulkConfirm}
        title="Supprimer la sélection"
        description={`Vous allez supprimer définitivement ${selectedIds.size} utilisateur${selectedIds.size > 1 ? "s" : ""} ainsi que toutes leurs données associées.`}
        confirmLabel={`Supprimer (${selectedIds.size})`}
        loading={bulkLoading}
        onConfirm={handleBulkDeleteConfirm}
        onClose={() => setBulkConfirm(false)}
      />
    </div>
  );
}
