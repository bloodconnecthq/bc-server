"use client";

import { Button } from "@heroui/react";
import { useState } from "react";

export function SettingsDanger() {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-red-100">
        <h2 className="text-base font-semibold text-red-600">
          Zone de danger
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Actions irréversibles sur votre compte
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Désactiver mon compte
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Votre compte sera suspendu temporairement
            </p>
          </div>
          <Button
            variant="outline" 
            className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all">
            Désactiver
          </Button>
        </div>


        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-red-700">
              Supprimer mon compte
            </p>
            <p className="text-xs text-red-400 mt-0.5">
              Toutes vos données seront définitivement supprimées
            </p>
          </div>
          {!confirm ? (
            <Button
              onClick={() => setConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Supprimer
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirm(false)}
                className="px-3 py-2 border border-gray-300 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-100"
              >
                Annuler
              </Button>
              <Button className="px-3 py-2 bg-red-700 text-white text-xs font-semibold rounded-xl hover:bg-red-800">
                Confirmer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}