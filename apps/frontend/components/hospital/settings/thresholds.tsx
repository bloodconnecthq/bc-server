"use client";

import { useState } from "react";
import { Lock } from "iconsax-reactjs";
import { updateStockSeuils, type StockData } from "@/lib/api/hospitalApi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

interface Props {
  stocks: StockData[];
  isAdmin: boolean;
  token: string;
  onUpdated: (stocks: StockData[]) => void;
}

export function HospitalSettingsThresholds({ stocks, isAdmin, token, onUpdated }: Props) {
  type Seuils = { seuilFaible: number; seuilCritique: number };
  const initial = Object.fromEntries(
    stocks.map((s) => [s.groupeSanguin ?? "", { seuilFaible: s.seuilFaible, seuilCritique: s.seuilCritique }])
  ) as Record<string, Seuils>;

  const [seuils, setSeuils]   = useState<Record<string, Seuils>>(initial);
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [error,  setError]    = useState<string | null>(null);

  const handleChange = (groupe: string, field: keyof Seuils, val: string) => {
    setSeuils((prev) => ({
      ...prev,
      [groupe]: { ...prev[groupe], [field]: parseInt(val) || 0 },
    }));
  };

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      await Promise.all(
        stocks
          .filter((s) => s.groupeSanguin && seuils[s.groupeSanguin ?? ""])
          .map((s) => updateStockSeuils(s.id, seuils[s.groupeSanguin!], token))
      );
      onUpdated(stocks.map((s) => ({
        ...s,
        seuilFaible:    seuils[s.groupeSanguin ?? ""]?.seuilFaible    ?? s.seuilFaible,
        seuilCritique:  seuils[s.groupeSanguin ?? ""]?.seuilCritique  ?? s.seuilCritique,
      })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de la sauvegarde");
    } finally { setSaving(false); }
  };

  const inputClass = (disabled: boolean, variant: "amber" | "red") =>
    `w-full px-3 py-2 text-sm rounded-xl border font-medium ${
      disabled
        ? variant === "amber"
          ? "border-amber-100 bg-amber-50/50 text-amber-400 cursor-not-allowed"
          : "border-red-100 bg-red-50/50 text-red-300 cursor-not-allowed"
        : variant === "amber"
          ? "border-amber-200 bg-amber-50 text-amber-800 focus:outline-none focus:border-amber-400"
          : "border-red-200 bg-red-50 text-red-800 focus:outline-none focus:border-red-400"
    }`;

  const displayGroups = BLOOD_GROUPS.filter((g) => stocks.some((s) => s.groupeSanguin === g));
  const groups = displayGroups.length > 0 ? displayGroups : BLOOD_GROUPS;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Seuils d'alerte par groupe sanguin</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isAdmin ? "Définissez à partir de combien de poches une alerte est déclenchée" : "Seuils configurés pour cet établissement"}
          </p>
        </div>
        {!isAdmin && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <Lock size={11} /> Lecture seule
          </span>
        )}
      </div>

      <div className="px-6 py-5">
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}

        <div className="grid grid-cols-3 gap-4 mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Groupe</p>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Seuil faible</p>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Seuil critique</p>
        </div>

        <div className="space-y-3">
          {groups.map((groupe) => {
            const vals = seuils[groupe] ?? { seuilFaible: 0, seuilCritique: 0 };
            return (
              <div key={groupe} className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">{groupe}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{groupe}</span>
                </div>
                <div className="relative">
                  <input
                    type="number" min={0} max={500}
                    disabled={!isAdmin}
                    value={vals.seuilFaible}
                    onChange={(e) => handleChange(groupe, "seuilFaible", e.target.value)}
                    className={inputClass(!isAdmin, "amber")}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-500 pointer-events-none">p.</span>
                </div>
                <div className="relative">
                  <input
                    type="number" min={0} max={500}
                    disabled={!isAdmin}
                    value={vals.seuilCritique}
                    onChange={(e) => handleChange(groupe, "seuilCritique", e.target.value)}
                    className={inputClass(!isAdmin, "red")}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400 pointer-events-none">p.</span>
                </div>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            {saved && <p className="text-sm text-green-600 font-medium">Seuils enregistrés</p>}
            <div className={saved ? "" : "ml-auto"}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer les seuils"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
