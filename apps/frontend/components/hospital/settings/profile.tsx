"use client";

import { useState } from "react";
import { Hospital, Call, Sms, Location, Lock } from "iconsax-reactjs";
import { updateMyHospital, type HospitalData } from "@/lib/api/hospitalApi";

interface Props {
  hopital: HospitalData;
  isAdmin: boolean;
  token: string;
  onUpdated: (h: HospitalData) => void;
}

export function HospitalSettingsProfile({ hopital, isAdmin, token, onUpdated }: Props) {
  const [form, setForm] = useState({
    nom:        hopital.nom,
    adresse:    hopital.adresse    ?? "",
    commune:    hopital.commune    ?? "",
    telephone:  hopital.telephone  ?? "",
    email:      hopital.email      ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      const updated = await updateMyHospital(form, token);
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de la sauvegarde");
    } finally { setSaving(false); }
  };

  const inputClass = (disabled: boolean) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
      disabled
        ? "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
        : "border-gray-200 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
    }`;

  const fields = [
    { key: "nom",       label: "Nom de l'établissement", icon: Hospital,  type: "text",  full: true },
    { key: "adresse",   label: "Adresse",                icon: Location,  type: "text",  full: true },
    { key: "commune",   label: "Commune",                icon: Location,  type: "text",  full: false },
    { key: "telephone", label: "Téléphone",              icon: Call,      type: "tel",   full: false },
    { key: "email",     label: "Email",                  icon: Sms,       type: "email", full: true },
  ] as const;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Informations de l'établissement</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isAdmin ? "Ces informations sont visibles par les donneurs sur la carte" : "Informations en lecture seule"}
          </p>
        </div>
        {!isAdmin && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <Lock size={11} /> Lecture seule
          </span>
        )}
      </div>

      <div className="px-6 py-5 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key} className={f.full ? "col-span-2" : "col-span-1"}>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <f.icon size={14} color="#9ca3af" />
                </span>
                <input
                  type={f.type}
                  disabled={!isAdmin}
                  value={form[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className={`${inputClass(!isAdmin)} pl-9`}
                />
              </div>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="flex items-center justify-between pt-2">
            {saved && <p className="text-sm text-green-600 font-medium">Modifications enregistrées</p>}
            <div className={saved ? "" : "ml-auto"}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
