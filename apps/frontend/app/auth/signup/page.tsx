"use client";

import Link from "next/link";
import { useState } from "react";
import { Input, TextField, Label, ListBox, Select } from "@heroui/react";
import { Eye, EyeSlash, Drop, Lock, Sms, User, Call } from "iconsax-reactjs";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const communes = [
  "Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi",
  "Bohicon", "Natitingou", "Abomey",
];
const steps = ["Identité", "Médical", "Accès"];

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: connecter à l'API AdonisJS
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <Drop size={16} color="white" variant="Bold" />
          </div>
          <span className="font-bold text-gray-900">Blood-Connect</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Rejoignez la communauté des donneurs de sang au Bénin
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? "bg-green-500 text-white"
                : i === step ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-400"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${
                i === step ? "text-gray-900" : "text-gray-400"
              }`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${
                i < step ? "bg-green-300" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Étape 1 — Identité */}
      {step === 0 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField isRequired>
              <Label className="text-sm font-medium text-gray-700">Prénom</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User size={16} color="#9ca3af" />
                </span>
                <Input
                  placeholder="Koffi"
                  className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
                />
              </div>
            </TextField>

            <TextField isRequired>
              <Label className="text-sm font-medium text-gray-700">Nom</Label>
              <Input
                placeholder="Agossou"
                className="w-full mt-1 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
            </TextField>
          </div>

          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Call size={16} color="#9ca3af" />
              </span>
              <Input
                type="tel"
                placeholder="+229 97 00 00 00"
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
            </div>
          </TextField>

          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Sms size={16} color="#9ca3af" />
              </span>
              <Input
                type="email"
                placeholder="vous@exemple.com"
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
            </div>
          </TextField>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all mt-2"
          >
            Continuer →
          </button>
        </form>
      )}

      {/* Étape 2 — Médical */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">
              Date de naissance
            </Label>
            <Input
              type="date"
              className="w-full mt-1 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
            />
          </TextField>

          {/* Select groupe sanguin */}
          <Select fullWidth placeholder="Sélectionner votre groupe" isRequired>
            <Label className="text-sm font-medium text-gray-700">
              Groupe sanguin
            </Label>
            <Select.Trigger className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {bloodGroups.map((g) => (
                  <ListBox.Item key={g} id={g} textValue={g}>
                    {g}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Select commune */}
          <Select fullWidth placeholder="Sélectionner votre commune" isRequired>
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

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              ← Retour
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Continuer →
            </button>
          </div>
        </form>
      )}

      {/* Étape 3 — Accès */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">
              Mot de passe
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={16} color="#9ca3af" />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="8 caractères minimum"
                className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </TextField>

          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={16} color="#9ca3af" />
              </span>
              <Input
                type="password"
                placeholder="••••••••"
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
              />
            </div>
          </TextField>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 accent-red-600"
              required
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              J'accepte les{" "}
              <Link href="#" className="text-red-600 hover:underline">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link href="#" className="text-red-600 hover:underline">
                politique de confidentialité
              </Link>
            </span>
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-60"
            >
              {isLoading ? "Création..." : "Créer mon compte"}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Link
          href="/auth/signin"
          className="text-red-600 font-semibold hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}