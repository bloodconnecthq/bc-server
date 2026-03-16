"use client";

import { useState } from "react";
import { Input, TextField, Label, Button } from "@heroui/react";
import { Hospital, Call, Sms, Location } from "iconsax-reactjs";

export function HospitalSettingsProfile() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Informations de l'établissement
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Ces informations sont visibles par les donneurs sur la carte
        </p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <Hospital size={28} color="#dc2626" variant="Bold" />
          </div>
          <div>
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Changer le logo
            </button>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG — max 2 Mo</p>
          </div>
        </div>

        <TextField>
          <Label className="text-sm font-medium text-gray-700">
            Nom de l'établissement
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Hospital size={15} color="#9ca3af" />
            </span>
            <Input
              defaultValue="CHU de Cotonou"
              className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
            />
          </div>
        </TextField>

        <TextField>
          <Label className="text-sm font-medium text-gray-700">Adresse</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Location size={15} color="#9ca3af" />
            </span>
            <Input
              defaultValue="Avenue Jean-Paul II, Cotonou"
              className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
            />
          </div>
        </TextField>

        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Call size={15} color="#9ca3af" />
              </span>
              <Input
                type="tel"
                defaultValue="+229 21 30 01 15"
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
              />
            </div>
          </TextField>

          <TextField>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Sms size={15} color="#9ca3af" />
              </span>
              <Input
                type="email"
                defaultValue="chu.cotonou@sante.bj"
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
              />
            </div>
          </TextField>
        </div>

        <TextField>
          <Label className="text-sm font-medium text-gray-700">
            Horaires d'ouverture
          </Label>
          <Input
            defaultValue="Lun–Dim 08h–20h"
            className="w-full mt-1 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
          />
        </TextField>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Modifications enregistrées
            </p>
          )}
          <div className={saved ? "" : "ml-auto"}>
            <Button
              type="submit"
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}