"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, TextField, Label, Button } from "@heroui/react";
import { Eye, EyeSlash, Drop, Lock, Sms, User, Call } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const communes = [
  "Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi",
  "Bohicon", "Natitingou", "Abomey",
];
const steps = ["Identité", "Médical", "Accès"];

export default function SignUpPage() {
  const { inscription, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [commune, setCommune] = useState("");
  const [groupeSanguin, setGroupeSanguin] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [motDePasseConfirmation, setMotDePasseConfirmation] = useState("");

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/donor");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 0) {
      if (!prenom || !nom || !telephone || !email) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Email invalide");
        return;
      }
    }

    if (step === 1) {
      if (!dateNaissance || !commune || !groupeSanguin) {
        setError("Veuillez remplir tous les champs");
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!motDePasse || !motDePasseConfirmation) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (motDePasse.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (motDePasse !== motDePasseConfirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      await inscription({
        nomComplet: `${prenom} ${nom}`.trim(),
        prenom,
        nom,
        email,
        motDePasse,
        motDePasseConfirmation,
        role: "donneur",
        telephone,
        groupeSanguin: groupeSanguin || undefined,
        commune: commune || undefined,
        dateNaissance: dateNaissance || undefined,
      });
      router.push("/donor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
            <Drop size={16} color="white" variant="Bold" />
          </div>
          <span className="font-bold text-gray-900">eBloodSys</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Rejoignez la communauté des donneurs de sang au Bénin
        </p>
      </div>


      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-green-500 text-white"
                : i === step ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-400"
                }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? "text-gray-900" : "text-gray-400"
                }`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${i < step ? "bg-green-300" : "bg-gray-200"
                }`} />
            )}
          </div>
        ))}
      </div>


      {step === 0 && (
        <form onSubmit={handleNext} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <TextField isRequired>
              <Label className="text-sm font-medium text-gray-700">Prénom</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User size={16} color="#9ca3af" />
                </span>
                <Input
                  placeholder="Koffi"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
                />
              </div>
            </TextField>

            <TextField isRequired>
              <Label className="text-sm font-medium text-gray-700">Nom</Label>
              <Input
                placeholder="Agossou"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                disabled={isLoading}
                className="w-full mt-1 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
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
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
              />
            </div>
          </TextField>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continuer →
          </button>
        </form>
      )}


      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          <TextField isRequired>
            <Label className="text-sm font-medium text-gray-700">
              Date de naissance
            </Label>
            <Input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              disabled={isLoading}
              className="w-full mt-1 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
            />
          </TextField>


          <div>
            <Label className="text-sm font-medium text-gray-700">
              Groupe sanguin
            </Label>
            <select
              value={groupeSanguin}
              onChange={(e) => setGroupeSanguin(e.target.value)}
              disabled={isLoading}
              className="w-full mt-1 shadow-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus-visible:border-red-500 focus-visible:ring-0"
            >
              <option value="">Sélectionner votre groupe</option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>


          <div>
            <Label className="text-sm font-medium text-gray-700">
              Commune de résidence
            </Label>
            <select
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              disabled={isLoading}
              className="w-full mt-1 shadow-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus-visible:border-red-500 focus-visible:ring-0"
            >
              <option value="">Sélectionner votre commune</option>
              {communes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              disabled={isLoading}
              className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continuer →
            </button>
          </div>
        </form>
      )}


      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
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
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
              />
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                isDisabled={isLoading}
                className="absolute p-0 bg-transparent right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </Button>
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
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={motDePasseConfirmation}
                onChange={(e) => setMotDePasseConfirmation(e.target.value)}
                disabled={isLoading}
                className="w-full pl-9 pr-10 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0 shadow-none"
              />
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                isDisabled={isLoading}
                className="absolute p-0 bg-transparent right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeSlash size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </TextField>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 accent-red-600"
              disabled={isLoading}
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              isDisabled={isLoading}
              className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ← Retour
            </Button>
            <Button
              type="submit"
              isDisabled={isLoading}
              className="flex-1 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-60"
            >
              {isLoading ? "Création..." : "Créer mon compte"}
            </Button>
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