"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, TextField, Label, Button } from "@heroui/react";
import { Eye, EyeSlash, Drop, Lock, Sms } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";

function getDashboardByRole(role: string | undefined | null): string {
  if (role === "donneur") return "/donor";
  if (role === "infirmier" || role === "medecin" || role === "admin_hopital") return "/hospital";
  if (role === "super_admin") return "/console/donors";
  return "/auth/signin";
}

export default function SignInPage() {
  const { connexion, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // Redirect already-authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.replace(getDashboardByRole(user.role));
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const authData = await connexion({ email, motDePasse });
      // Extract role from the response to redirect directly — no intermediate /console hop
      const role =
        (authData as any)?.data?.user?.role ??
        (authData as any)?.user?.role ??
        null;
      router.push(getDashboardByRole(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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
          <span className="font-bold text-gray-900">Blood-Connect</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connectez-vous à votre espace Blood-Connect
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <TextField isRequired>
          <Label className="text-sm font-medium text-gray-700">
            Adresse email
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sms size={16} color="#9ca3af" />
            </span>
            <Input
              type="email"
              placeholder="Entrer votre adresse mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 rounded-xl shadow-none! focus:shadow-none! border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
            />
          </div>
        </TextField>

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
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-10 shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute p-0 bg-transparent right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </TextField>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-red-600 rounded" disabled={isLoading} />
            <span className="text-sm text-gray-600">Se souvenir de moi</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-red-600 font-medium hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          variant="danger"
          isDisabled={isLoading}
          className="w-full py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-gray-50 text-xs text-gray-400">
            Pas encore de compte ?
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Vous êtes donneur ?{" "}
        <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
          Créer un compte donneur
        </Link>
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Hôpital ou centre de collecte ?{" "}
          <span className="font-medium text-gray-700">
            Votre accès est créé par l'administrateur CNTS.
          </span>{" "}
          Contactez votre responsable.
        </p>
      </div>
    </div>
  );
}
