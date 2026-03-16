"use client";

import { useState } from "react";

const preferences = [
  {
    id: "eligible",
    label: "Rappels de don",
    description: "Recevoir une notification quand vous êtes éligible au don",
    defaultOn: true,
  },
  {
    id: "urgent",
    label: "Alertes d'urgence",
    description: "Être alerté en cas de pénurie de votre groupe sanguin",
    defaultOn: true,
  },
  {
    id: "campaign",
    label: "Campagnes de collecte",
    description: "Recevoir les annonces de collectes mobiles près de chez vous",
    defaultOn: true,
  },
  {
    id: "badge",
    label: "Badges et récompenses",
    description: "Être notifié quand vous débloquez un nouveau badge",
    defaultOn: false,
  },
];

export function SettingsNotifications() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(preferences.map((p) => [p.id, p.defaultOn]))
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Choisissez les notifications que vous souhaitez recevoir
        </p>
      </div>

      <div className="px-6 py-5 divide-y divide-gray-50">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-gray-900">{pref.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{pref.description}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setPrefs((p) => ({ ...p, [pref.id]: !p[pref.id] }))
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                prefs[pref.id] ? "bg-red-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  prefs[pref.id] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}