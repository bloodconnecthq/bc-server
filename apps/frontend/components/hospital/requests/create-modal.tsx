"use client";

import { useState } from "react";
import clsx from "clsx";
import { Add, DocumentText } from "iconsax-reactjs";
import type { CreateBonDemandePayload } from "@/lib/api/hospitalApi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateBonDemandePayload, "hopitalId">) => Promise<void>;
}

export function CreateModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({ nomPatient: "", groupeSanguinPatient: "A+", quantiteNecessaire: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  if (!open) return null;

  const doSubmit = async () => {
    if (!form.nomPatient.trim()) { setError("Le nom du patient est requis"); return; }
    setLoading(true); setError(null);
    try {
      await onSubmit(form);
      setForm({ nomPatient: "", groupeSanguinPatient: "A+", quantiteNecessaire: 1 });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <DocumentText size={20} color="#dc2626" variant="Bold" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Nouveau bon de demande</h2>
            <p className="text-xs text-gray-400">Demande de sang pour un patient</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); doSubmit(); }} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom du patient <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.nomPatient}
              onChange={(e) => setForm((f) => ({ ...f, nomPatient: e.target.value }))}
              placeholder="Ex: Jean Koffi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Groupe sanguin requis</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button key={g} type="button" onClick={() => setForm((f) => ({ ...f, groupeSanguinPatient: g }))}
                  className={clsx("py-2 rounded-xl border-2 text-sm font-bold transition-all",
                    form.groupeSanguinPatient === g ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 text-gray-600 hover:border-gray-200"
                  )}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Quantité (poches)</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm((f) => ({ ...f, quantiteNecessaire: Math.max(1, f.quantiteNecessaire - 1) }))}
                className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center">−</button>
              <span className="flex-1 text-center text-2xl font-black text-gray-900">{form.quantiteNecessaire}</span>
              <button type="button" onClick={() => setForm((f) => ({ ...f, quantiteNecessaire: f.quantiteNecessaire + 1 }))}
                className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center">+</button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Add size={16} color="white" />}
              Créer le bon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
