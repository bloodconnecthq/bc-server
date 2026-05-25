"use client";

import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { Add, DocumentText, TickCircle, CloseCircle, Clock } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getBonsDemande,
  createBonDemande,
  satisfaireBonDemande,
  nonSatisfaireBonDemande,
  getMyMemberProfile,
  type BonDemandeData,
  type CreateBonDemandePayload,
} from "@/lib/api/hospitalApi";

// ── Constants ────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const STATUS_CONFIG = {
  en_attente:   { label: "En attente",    color: "text-amber-700 bg-amber-50 border-amber-200",   icon: Clock       },
  satisfait:    { label: "Satisfait",     color: "text-green-700 bg-green-50 border-green-200",   icon: TickCircle  },
  non_satisfait:{ label: "Non satisfait", color: "text-red-700 bg-red-50 border-red-200",         icon: CloseCircle },
} as const;

// ── Create Modal ──────────────────────────────────────────────────────────────

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateBonDemandePayload, "hopitalId">) => Promise<void>;
}

function CreateModal({ open, onClose, onSubmit }: CreateModalProps) {
  const [form, setForm] = useState({ nomPatient: "", groupeSanguinPatient: "A+", quantiteNecessaire: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomPatient.trim()) { setError("Le nom du patient est requis"); return; }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm({ nomPatient: "", groupeSanguinPatient: "A+", quantiteNecessaire: 1 });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <DocumentText size={20} color="#dc2626" variant="Bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Nouveau bon de demande</h2>
              <p className="text-xs text-gray-400">Demande de sang pour un patient</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Nom patient */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nom du patient <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nomPatient}
              onChange={(e) => setForm((f) => ({ ...f, nomPatient: e.target.value }))}
              placeholder="Ex: Jean Koffi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
          </div>

          {/* Groupe sanguin */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Groupe sanguin requis
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, groupeSanguinPatient: g }))}
                  className={clsx(
                    "py-2 rounded-xl border-2 text-sm font-bold transition-all",
                    form.groupeSanguinPatient === g
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-100 text-gray-600 hover:border-gray-200"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Quantité nécessaire (poches)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, quantiteNecessaire: Math.max(1, f.quantiteNecessaire - 1) }))}
                className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              >
                −
              </button>
              <span className="flex-1 text-center text-2xl font-black text-gray-900">
                {form.quantiteNecessaire}
              </span>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, quantiteNecessaire: f.quantiteNecessaire + 1 }))}
                className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Add size={16} color="white" />
              )}
              Créer le bon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const { token } = useAuth();
  const [bons, setBons]           = useState<BonDemandeData[]>([]);
  const [hopitalId, setHopitalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [filterStatut, setFilterStatut] = useState<string>("all");

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [profile, data] = await Promise.all([
        getMyMemberProfile(token),
        getBonsDemande(token),
      ]);
      setHopitalId(profile.hopitalId);
      setBons(data);
    } catch (e: any) {
      setError(e?.message ?? "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data: Omit<CreateBonDemandePayload, "hopitalId">) => {
    if (!token || !hopitalId) throw new Error("Hôpital non identifié");
    await createBonDemande({ ...data, hopitalId }, token);
    showToast("Bon de demande créé avec succès");
    await load();
  };

  const handleAction = async (id: string, action: "satisfaire" | "non_satisfaire") => {
    if (!token) return;
    setActionLoading(id + action);
    try {
      if (action === "satisfaire") await satisfaireBonDemande(id, token);
      else await nonSatisfaireBonDemande(id, token);
      showToast(action === "satisfaire" ? "Bon marqué satisfait" : "Bon marqué non satisfait");
      await load();
    } catch (e: any) {
      showToast(e?.message ?? "Erreur", false);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filterStatut === "all" ? bons : bons.filter((b) => b.statut === filterStatut);
  const counts = { all: bons.length, en_attente: 0, satisfait: 0, non_satisfait: 0 };
  bons.forEach((b) => { counts[b.statut] = (counts[b.statut] ?? 0) + 1; });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border",
          toast.ok
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          {toast.ok ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Bons de demande</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Demandes de produits sanguins pour les patients
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <Add size={16} color="white" />
          Nouveau bon
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {([
          { key: "all",          label: "Total",          color: "text-gray-900",  bg: "bg-gray-50"   },
          { key: "en_attente",   label: "En attente",     color: "text-amber-700", bg: "bg-amber-50"  },
          { key: "satisfait",    label: "Satisfaits",     color: "text-green-700", bg: "bg-green-50"  },
          { key: "non_satisfait",label: "Non satisfaits", color: "text-red-700",   bg: "bg-red-50"    },
        ] as const).map((s) => (
          <button
            key={s.key}
            onClick={() => setFilterStatut(s.key)}
            className={clsx(
              "bg-white rounded-2xl p-5 border text-left transition-all hover:border-gray-200",
              filterStatut === s.key ? "border-red-200 ring-1 ring-red-200" : "border-gray-100"
            )}
          >
            <p className={clsx("text-2xl font-black", s.color)}>
              {isLoading ? "…" : counts[s.key as keyof typeof counts] ?? 0}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-700">
            {filterStatut === "all" ? "Tous les bons" : STATUS_CONFIG[filterStatut as keyof typeof STATUS_CONFIG]?.label}
            {" "}
            <span className="text-gray-400 font-normal">({filtered.length})</span>
          </p>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <DocumentText size={22} color="#9ca3af" />
            </div>
            <p className="text-sm font-semibold text-gray-400">Aucun bon de demande</p>
            <p className="text-xs text-gray-300 mt-1">Créez votre premier bon avec le bouton ci-dessus</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((bon) => {
              const cfg = STATUS_CONFIG[bon.statut];
              const Icon = cfg.icon;
              const isPending = bon.statut === "en_attente";
              return (
                <div key={bon.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  {/* Blood group badge */}
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-black text-red-600 leading-none">
                      {bon.groupeSanguinPatient}
                    </span>
                    <span className="text-xs text-red-400 leading-none mt-0.5">
                      ×{bon.quantiteNecessaire}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{bon.nomPatient}</p>
                      <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1", cfg.color)}>
                        <Icon size={10} variant="Bold" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {bon.medecin?.nomComplet ? `Dr. ${bon.medecin.nomComplet}` : "Médecin"}
                      {" · "}
                      {new Date(bon.creeLe).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(bon.id, "satisfaire")}
                        disabled={actionLoading === bon.id + "satisfaire"}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-xl border border-green-200 transition-all disabled:opacity-60"
                      >
                        {actionLoading === bon.id + "satisfaire" ? (
                          <span className="w-3 h-3 border border-green-600/40 border-t-green-600 rounded-full animate-spin" />
                        ) : <TickCircle size={13} variant="Bold" />}
                        Satisfait
                      </button>
                      <button
                        onClick={() => handleAction(bon.id, "non_satisfaire")}
                        disabled={actionLoading === bon.id + "non_satisfaire"}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all disabled:opacity-60"
                      >
                        {actionLoading === bon.id + "non_satisfaire" ? (
                          <span className="w-3 h-3 border border-red-600/40 border-t-red-600 rounded-full animate-spin" />
                        ) : <CloseCircle size={13} variant="Bold" />}
                        Non satisfait
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
