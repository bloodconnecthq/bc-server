"use client";

import Link from "next/link";
import { useState } from "react";
import { Input, TextField, Label } from "@heroui/react";
import { Eye, EyeSlash, Drop, Lock, Sms } from "iconsax-reactjs";

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
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
                            placeholder="vous@exemple.com"
                            className="w-full pl-9 rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-100"
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

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-red-600 rounded" />
                        <span className="text-sm text-gray-600">Se souvenir de moi</span>
                    </label>
                    <Link href="/auth/forgot-password" className="text-sm text-red-600 font-medium hover:underline">
                        Mot de passe oublié ?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>
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
                <Link href="/auth/signup" className="text-red-600 font-semibold hover:underline">
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