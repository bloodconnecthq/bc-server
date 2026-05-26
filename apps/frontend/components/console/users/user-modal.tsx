"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CloseCircle, User, Sms, Call, Lock } from "iconsax-reactjs";
import type { UserAPI, UpdateUserPayload } from "@/lib/api/consoleApi";

const ROLES = [
  { value: "donneur",       label: "Donneur"       },
  { value: "infirmier",     label: "Infirmier"      },
  { value: "medecin",       label: "Médecin"        },
  { value: "admin_hopital", label: "Admin Hôpital"  },
  { value: "super_admin",   label: "Super Admin"    },
] as const;

type ModalMode = "edit" | "reset-password";

interface Props {
  user: UserAPI | null;
  mode: ModalMode;
  onClose: () => void;
  onSave: (id: string, data: UpdateUserPayload) => Promise<void>;
  onResetPassword: (id: string, password: string) => Promise<void>;
}

export function UserModal({ user, mode, onClose, onSave, onResetPassword }: Props) {
  const [form, setForm] = useState<UpdateUserPayload>({});
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      nomComplet:  user.nomComplet  ?? "",
      email:       user.email,
      telephone:   user.telephone   ?? "",
      commune:     user.commune     ?? "",
      departement: user.departement ?? "",
      role:        user.role,
      estActif:    user.estActif,
    });
    setPassword("");
    setError(null);
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      if (mode === "reset-password") {
        if (!password || password.length < 8) {
          setError("Le mot de passe doit contenir au moins 8 caractères"); setLoading(false); return;
        }
        await onResetPassword(user.id, password);
      } else {
        await onSave(user.id, form);
      }
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Erreur");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              mode === "reset-password" ? "bg-blue-50" : "bg-red-50"
            )}>
              {mode === "reset-password"
                ? <Lock size={18} color="#2563eb" variant="Bold" />
                : <User size={18} color="#dc2626" variant="Bold" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {mode === "reset-password" ? "Réinitialiser le mot de passe" : "Modifier l'utilisateur"}
              </h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <CloseCircle size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

          {mode === "reset-password" ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères" className={`${inputClass} pl-9`} />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet</label>
                  <input type="text" value={form.nomComplet ?? ""} onChange={(e) => setForm((f) => ({ ...f, nomComplet: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Sms size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type="email" value={form.email ?? ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
                  <div className="relative">
                    <Call size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type="tel" value={form.telephone ?? ""} onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
                      className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Commune</label>
                  <input type="text" value={form.commune ?? ""} onChange={(e) => setForm((f) => ({ ...f, commune: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Département</label>
                  <input type="text" value={form.departement ?? ""} onChange={(e) => setForm((f) => ({ ...f, departement: e.target.value }))}
                    className={inputClass} />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Rôle</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {ROLES.map((r) => (
                    <button key={r.value} type="button" onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                      className={clsx(
                        "py-2 px-1 rounded-xl border text-xs font-bold transition-all text-center",
                        form.role === r.value ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      )}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statut */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Compte actif</p>
                  <p className="text-xs text-gray-400">L'utilisateur peut se connecter</p>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, estActif: !f.estActif }))}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    form.estActif ? "bg-green-500" : "bg-gray-300"
                  )}>
                  <span className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                    form.estActif ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className={clsx(
              "flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60",
              mode === "reset-password" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
            )}>
            {loading ? "…" : mode === "reset-password" ? "Réinitialiser" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
