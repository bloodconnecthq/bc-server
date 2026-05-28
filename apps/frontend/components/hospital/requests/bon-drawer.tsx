"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  CloseCircle, TickCircle, ArrowSwapHorizontal,
  Trash, Edit2, Drop, Buildings2, Warning2,
} from "iconsax-reactjs";
import type { BonDemandeData } from "@/lib/api/hospitalApi";
import { StockBadge } from "./stock-badge";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const STATUS_CFG = {
  en_attente:    { label: "En attente",    color: "text-amber-700 bg-amber-50 border-amber-200"  },
  satisfait:     { label: "Satisfait",     color: "text-green-700 bg-green-50 border-green-200"  },
  non_satisfait: { label: "Non satisfait", color: "text-red-700 bg-red-50 border-red-200"        },
  transfere:     { label: "Transféré",     color: "text-blue-700 bg-blue-50 border-blue-200"     },
} as const;

interface EditData { nomPatient: string; groupeSanguinPatient: string; quantiteNecessaire: number }

interface Props {
  bon: BonDemandeData | null;
  isOpen: boolean;
  mode: "mes" | "recu";
  actionLoading: string | null;
  onClose: () => void;
  onSatisfaire:    (id: string) => void;
  onNonSatisfaire: (id: string) => void;
  onTransferer:    (bon: BonDemandeData) => void;
  onDecliner:      (id: string) => void;
  onUpdate:        (id: string, data: EditData) => Promise<void>;
  onDelete:        (id: string) => Promise<void>;
}

export function BonDrawer({ bon, isOpen, mode, actionLoading, onClose, onSatisfaire, onNonSatisfaire, onTransferer, onDecliner, onUpdate, onDelete }: Props) {
  const [editing, setEditing]   = useState(false);
  const [editForm, setEditForm] = useState<EditData>({ nomPatient: "", groupeSanguinPatient: "A+", quantiteNecessaire: 1 });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = () => {
    if (!bon) return;
    setEditForm({ nomPatient: bon.nomPatient, groupeSanguinPatient: bon.groupeSanguinPatient, quantiteNecessaire: bon.quantiteNecessaire });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!bon) return;
    setSaving(true);
    try { await onUpdate(bon.id, editForm); setEditing(false); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!bon || !window.confirm(`Supprimer le bon pour ${bon.nomPatient} ?`)) return;
    setDeleting(true);
    try { await onDelete(bon.id); }
    finally { setDeleting(false); }
  };

  const close = () => { onClose(); setEditing(false); };
  const busy  = (k: string) => actionLoading === bon?.id + k;
  const isPending    = bon?.statut === "en_attente";
  const cfg          = bon ? STATUS_CFG[bon.statut] : null;
  const needTransfer = isPending && !bon?.peutEtreSatisfait;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={clsx(
          "fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Slide panel */}
      <aside className={clsx(
        "fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {bon ? (
          <>
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start gap-3 shrink-0">
              <div className="w-11 h-11 bg-red-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-black text-red-600 leading-none">{bon.groupeSanguinPatient}</span>
                <span className="text-xs text-red-400 leading-none">×{bon.quantiteNecessaire}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{bon.nomPatient}</p>
                {cfg && (
                  <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-medium inline-block mt-1", cfg.color)}>
                    {cfg.label}
                  </span>
                )}
              </div>
              <button onClick={close} className="text-gray-400 hover:text-gray-600 shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <CloseCircle size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Stock info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Drop size={12} color="#6b7280" />
                  <StockBadge disponible={bon.stockDisponible} necessaire={bon.quantiteNecessaire} />
                </div>
                {bon.medecin && <p className="text-xs text-gray-400">Dr. {bon.medecin.nomComplet}</p>}
                {bon.transfereVers && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-600">
                    <ArrowSwapHorizontal size={11} />
                    Transféré vers <strong className="ml-1">{bon.transfereVers.nom}</strong>
                  </div>
                )}
                {mode === "recu" && bon.hopital && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Buildings2 size={11} color="#6b7280" />
                    De : <strong className="ml-1">{bon.hopital.nom}</strong>
                  </div>
                )}
              </div>

              {/* Alerte stock insuffisant */}
              {needTransfer && mode === "mes" && !editing && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Warning2 size={15} color="#b45309" variant="Bold" className="shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Stock insuffisant dans cet hôpital. Transférez ce bon vers un établissement ayant du stock disponible.
                  </p>
                </div>
              )}

              {/* Actions — mes + en_attente */}
              {isPending && mode === "mes" && !editing && (
                <div className="space-y-2">
                  {bon.peutEtreSatisfait && (
                    <button onClick={() => onSatisfaire(bon.id)} disabled={!!actionLoading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                      {busy("sat") ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <TickCircle size={13} variant="Bold" />}
                      Satisfaire depuis le stock
                    </button>
                  )}
                  <button onClick={() => onTransferer(bon)} disabled={!!actionLoading}
                    className={clsx(
                      "w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-colors disabled:opacity-60",
                      needTransfer
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    )}>
                    <ArrowSwapHorizontal size={13} variant="Bold" />
                    Transférer vers un autre hôpital
                  </button>
                  <button onClick={() => onNonSatisfaire(bon.id)} disabled={!!actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-semibold rounded-xl border border-gray-200 disabled:opacity-60 transition-colors">
                    {busy("nsat") ? <span className="w-3.5 h-3.5 border border-gray-400/40 border-t-gray-400 rounded-full animate-spin" /> : <CloseCircle size={13} variant="Bold" />}
                    Marquer non satisfait
                  </button>
                </div>
              )}

              {/* Actions — reçu + en_attente */}
              {isPending && mode === "recu" && !editing && (
                <div className="flex gap-2">
                  <button onClick={() => onSatisfaire(bon.id)} disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl disabled:opacity-60 transition-colors">
                    {busy("sat") ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <TickCircle size={12} variant="Bold" />}
                    Accepter
                  </button>
                  <button onClick={() => onDecliner(bon.id)} disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 disabled:opacity-60 transition-colors">
                    <CloseCircle size={12} variant="Bold" />
                    Décliner
                  </button>
                </div>
              )}

              {/* Edit form */}
              {editing && isPending && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-700">Modifier le bon</p>
                  <input type="text" value={editForm.nomPatient}
                    onChange={(e) => setEditForm((f) => ({ ...f, nomPatient: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
                  <div className="grid grid-cols-4 gap-1.5">
                    {BLOOD_GROUPS.map((g) => (
                      <button key={g} type="button" onClick={() => setEditForm((f) => ({ ...f, groupeSanguinPatient: g }))}
                        className={clsx("py-1.5 rounded-lg border text-xs font-bold transition-colors",
                          editForm.groupeSanguinPatient === g ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300")}>
                        {g}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditForm((f) => ({ ...f, quantiteNecessaire: Math.max(1, f.quantiteNecessaire - 1) }))}
                      className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-50">−</button>
                    <span className="flex-1 text-center text-lg font-black text-gray-900">{editForm.quantiteNecessaire}</span>
                    <button onClick={() => setEditForm((f) => ({ ...f, quantiteNecessaire: f.quantiteNecessaire + 1 }))}
                      className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-50">+</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50">Annuler</button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold disabled:opacity-60">
                      {saving ? "…" : "Enregistrer"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer — edit + delete for pending "mes" bons */}
            {isPending && mode === "mes" && !editing && (
              <div className="px-5 py-3 border-t border-gray-100 flex gap-2 shrink-0">
                <button onClick={openEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Edit2 size={12} /> Modifier
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 disabled:opacity-60 transition-colors">
                  {deleting ? <span className="w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full animate-spin" /> : <Trash size={12} variant="Bold" />}
                  Supprimer
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Sélectionnez un bon
          </div>
        )}
      </aside>
    </>
  );
}
