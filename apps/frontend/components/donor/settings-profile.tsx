"use client";

import { useState, useEffect } from "react";
import { Input, TextField, Label, Select, ListBox, Button } from "@heroui/react";
import { Call, Sms } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import { useProfile } from "@/lib/hooks/useProfile";
import { AvatarUpload } from "./avatar-upload";

const communes = [
  "Cotonou", "Porto-Novo", "Parakou",
  "Abomey-Calavi", "Bohicon", "Natitingou", "Abomey",
];

function buildFormData(source: { prenom?: string | null; nom?: string | null; telephone?: string | null; email?: string; commune?: string | null } | null) {
  return {
    prenom: source?.prenom || "",
    nom: source?.nom || "",
    telephone: source?.telephone || "",
    email: source?.email || "",
    commune: source?.commune || "",
  };
}

export function SettingsProfile() {
  const { token, user: cachedUser } = useAuth();
  const { profile, isLoading, isSaving, error, saveError, updateProfile } = useProfile(token);

  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(() => buildFormData(cachedUser));

  // Update form when fresh profile arrives from API
  useEffect(() => {
    if (profile) {
      setFormData(buildFormData(profile));
    }
  }, [profile]);

  const handleInput = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        commune: formData.commune,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  if (isLoading && !cachedUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  if (error && !cachedUser) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Informations personnelles</h2>
        <p className="text-xs text-gray-400 mt-0.5">Mettez à jour vos informations de profil</p>
      </div>

      <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
        {/* Photo de profil */}
        <AvatarUpload
          currentPhoto={profile?.photoProfil ?? cachedUser?.photoProfil ?? null}
          initials={profile?.initials ?? cachedUser?.initials ?? "?"}
          token={token}
          onUploaded={() => {}}
        />

        {/* Nom + Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <TextField>
            <Label className="text-sm font-medium text-gray-700">Prénom</Label>
            <div className="relative mt-1">
              <Input
                value={formData.prenom}
                onChange={(e) => handleInput("prenom", e.target.value)}
                className="w-full shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
              />
            </div>
          </TextField>

          <TextField>
            <Label className="text-sm font-medium text-gray-700">Nom</Label>
            <div className="relative mt-1">
              <Input
                value={formData.nom}
                onChange={(e) => handleInput("nom", e.target.value)}
                className="w-full shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
              />
            </div>
          </TextField>
        </div>

        {/* Téléphone */}
        <TextField>
          <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Call size={15} color="#9ca3af" />
            </span>
            <Input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleInput("telephone", e.target.value)}
              className="w-full pl-9 shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
            />
          </div>
        </TextField>

        {/* Email (lecture seule) */}
        <TextField>
          <Label className="text-sm font-medium text-gray-700">Email</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sms size={15} color="#9ca3af" />
            </span>
            <Input
              type="email"
              value={formData.email}
              readOnly
              className="w-full pl-9 shadow-none! rounded-xl border border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
            />
          </div>
        </TextField>

        {/* Commune */}
        <Select
          fullWidth
          placeholder="Sélectionner"
          value={formData.commune || null}
          onChange={(key) => handleInput("commune", key as string ?? "")}
        >
          <Label className="text-sm font-medium text-gray-700">Commune de résidence</Label>
          <Select.Trigger className="mt-1 shadow-none! w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm">
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

        {saveError && (
          <p className="text-sm text-red-600 font-medium">Erreur : {saveError}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <p className="text-sm text-green-600 font-medium">✓ Modifications enregistrées</p>
          )}
          <div className={saved ? "" : "ml-auto"}>
            <Button
              type="submit"
              isDisabled={isSaving}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
