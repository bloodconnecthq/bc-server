"use client";

import { useState } from "react";
import { Lock, Eye, EyeSlash } from "iconsax-reactjs";
import { updatePassword } from "@/lib/api/hospitalApi";

interface Props { token: string }

export function HospitalSettingsSecurity({ token }: Props) {
  const [form, setForm] = useState({ motDePasseActuel: "", nouveauMotDePasse: "", confirmation: "" });
  const [show, setShow] = useState({ actuel: false, nouveau: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!form.motDePasseActuel || !form.nouveauMotDePasse) {
      setError("Tous les champs sont requis"); return;
    }
    if (form.nouveauMotDePasse !== form.confirmation) {
      setError("Les mots de passe ne correspondent pas"); return;
    }
    if (form.nouveauMotDePasse.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères"); return;
    }
    setSaving(true);
    try {
      await updatePassword(form.motDePasseActuel, form.nouveauMotDePasse, token);
      setForm({ motDePasseActuel: "", nouveauMotDePasse: "", confirmation: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors du changement de mot de passe");
    } finally { setSaving(false); }
  };

  const fields = [
    { key: "motDePasseActuel" as const,  label: "Mot de passe actuel",             showKey: "actuel" as const  },
    { key: "nouveauMotDePasse" as const, label: "Nouveau mot de passe",             showKey: "nouveau" as const },
    { key: "confirmation" as const,      label: "Confirmer le nouveau mot de passe", showKey: "confirm" as const },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Sécurité</h2>
        <p className="text-xs text-gray-400 mt-0.5">Modifiez le mot de passe de votre compte</p>
      </div>

      <div className="px-6 py-5 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">{field.label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={14} color="#9ca3af" />
              </span>
              <input
                type={show[field.showKey] ? "text" : "password"}
                placeholder="••••••••"
                value={form[field.key]}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [field.showKey]: !s[field.showKey] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[field.showKey] ? <EyeSlash size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        ))}

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Note :</span> Pour des raisons de sécurité, vous serez déconnecté après un changement de mot de passe.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && <p className="text-sm text-green-600 font-medium">Mot de passe mis à jour</p>}
          <div className={saved ? "" : "ml-auto"}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
            >
              {saving ? "Mise à jour…" : "Mettre à jour"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
