"use client";

import { useState } from "react";
import { Input, TextField, Label } from "@heroui/react";
import { Lock, Eye, EyeSlash } from "iconsax-reactjs";

export function HospitalSettingsSecurity() {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { key: "current" as const, label: "Mot de passe actuel" },
    { key: "new" as const, label: "Nouveau mot de passe" },
    { key: "confirm" as const, label: "Confirmer le nouveau mot de passe" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Sécurité</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Modifiez le mot de passe de votre compte établissement
        </p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
        {fields.map((field) => (
          <TextField key={field.key} isRequired>
            <Label className="text-sm font-medium text-gray-700">
              {field.label}
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={15} color="#9ca3af" />
              </span>
              <Input
                type={show[field.key] ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShow((s) => ({ ...s, [field.key]: !s[field.key] }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show[field.key] ? <EyeSlash size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </TextField>
        ))}

        {/* Note sécurité */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Note :</span> Pour des raisons de
            sécurité, tous les membres connectés seront déconnectés après un
            changement de mot de passe.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Mot de passe mis à jour
            </p>
          )}
          <div className={saved ? "" : "ml-auto"}>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Mettre à jour
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}