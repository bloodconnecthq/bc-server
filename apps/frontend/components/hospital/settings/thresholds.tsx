"use client";

import { useState } from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const defaultThresholds: { [key: string]: { low: number; critical: number } } = {
  "A+":  { low: 20, critical: 10 },
  "A-":  { low: 15, critical: 8  },
  "B+":  { low: 20, critical: 10 },
  "B-":  { low: 15, critical: 8  },
  "AB+": { low: 15, critical: 8  },
  "AB-": { low: 10, critical: 5  },
  "O+":  { low: 20, critical: 10 },
  "O-":  { low: 15, critical: 8  },
};

export function HospitalSettingsThresholds() {
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    group: string,
    field: "low" | "critical",
    value: string
  ) => {
    setThresholds((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: parseInt(value) || 0 },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Seuils d'alerte par groupe sanguin
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Définissez à partir de combien de poches une alerte est déclenchée
        </p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5">
        {/* En-tête colonnes */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Groupe
          </p>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            ⚠️ Seuil faible
          </p>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
            🚨 Seuil critique
          </p>
        </div>

        <div className="space-y-3">
          {bloodGroups.map((group) => (
            <div
              key={group}
              className="grid grid-cols-3 gap-4 items-center"
            >
              {/* Groupe */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">{group}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{group}</span>
              </div>

              {/* Seuil faible */}
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={thresholds[group].low}
                  onChange={(e) => handleChange(group, "low", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-amber-200 bg-amber-50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-amber-800 font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-500">
                  poches
                </span>
              </div>

              {/* Seuil critique */}
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={thresholds[group].critical}
                  onChange={(e) =>
                    handleChange(group, "critical", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-red-200 bg-red-50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-red-800 font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400">
                  poches
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          {saved && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Seuils enregistrés
            </p>
          )}
          <div className={saved ? "" : "ml-auto"}>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Enregistrer les seuils
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}