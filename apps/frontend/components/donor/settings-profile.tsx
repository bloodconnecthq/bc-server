"use client";

import { useState } from "react";
import { Input, TextField, Label, Select, ListBox, Button } from "@heroui/react";
import { User, Call, Sms, Location } from "iconsax-reactjs";

const communes = [
  "Cotonou", "Porto-Novo", "Parakou",
  "Abomey-Calavi", "Bohicon", "Natitingou", "Abomey",
];

export function SettingsProfile() {
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
          Informations personnelles
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Mettez à jour vos informations de profil
        </p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
        { }
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <User size={28} color="#dc2626" variant="Bold" />
          </div>
          <div>
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Changer la photo
            </button>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG — max 2 Mo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-sm font-medium text-gray-700">Prénom</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <User size={15} color="#9ca3af" />
              </span>
              <Input
                defaultValue="Koffi"
              className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
            </div>
          </TextField>

          <TextField>
            <Label className="text-sm font-medium text-gray-700">Nom</Label>
            <Input
              defaultValue="Agossou"
              className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
            />
          </TextField>
        </div>

        <TextField>
          <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Call size={15} color="#9ca3af" />
            </span>
            <Input
              type="tel"
              defaultValue="+229 97 45 12 38"
              className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
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
              defaultValue="koffi.agossou@gmail.com"
              className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500"
            />
          </div>
        </TextField>

        <Select fullWidth placeholder="Sélectionner" defaultSelectedKey="Cotonou">
          <Label className="text-sm font-medium text-gray-700">
            Commune de résidence
          </Label>
          <Select.Trigger className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {communes.map((c) => (
                <ListBox.Item key={c} id={c} textValue={c}>
                  {c}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

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