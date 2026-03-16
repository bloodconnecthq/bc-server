"use client";

import { useState } from "react";
import { Input, TextField, Label, Button } from "@heroui/react";
import { Lock, Eye, EyeSlash } from "iconsax-reactjs";

export function SettingsSecurity() {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Sécurité</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Modifiez votre mot de passe
        </p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
        {(["current", "new", "confirm"] as const).map((field) => {
          const labels = {
            current: "Mot de passe actuel",
            new: "Nouveau mot de passe",
            confirm: "Confirmer le nouveau mot de passe",
          };
          return (
            <TextField key={field} isRequired>
              <Label className="text-sm font-medium text-gray-700">
                {labels[field]}
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={15} color="#9ca3af" />
                </span>
                <Input
                  type={show[field] ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
                />
                <Button
                  type="button"
                  onClick={() =>
                    setShow((s) => ({ ...s, [field]: !s[field] }))
                  }
                  className="absolute bg-transparent right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show[field] ? (
                    <EyeSlash size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </Button>
              </div>
            </TextField>
          );
        })}

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Mot de passe mis à jour
            </p>
          )}
          <div className={saved ? "" : "ml-auto"}>
            <Button
              type="submit"
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Mettre à jour
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}