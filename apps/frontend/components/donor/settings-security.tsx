"use client";

import { useState } from "react";
import { Input, TextField, Label, Button } from "@heroui/react";
import { Lock, Eye, EyeSlash } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import { changerMotDePasse } from "@/lib/api/profileApi";

const FIELDS = [
    { key: "current", label: "Mot de passe actuel" },
    { key: "new", label: "Nouveau mot de passe" },
    { key: "confirm", label: "Confirmer le nouveau mot de passe" },
] as const;

type FieldKey = typeof FIELDS[number]["key"];

export function SettingsSecurity() {
    const { token } = useAuth();
    const [show, setShow] = useState<Record<FieldKey, boolean>>({ current: false, new: false, confirm: false });
    const [fields, setFields] = useState<Record<FieldKey, string>>({ current: "", new: "", confirm: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (fields.new.length < 8) {
            setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (fields.new !== fields.confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsSaving(true);
        try {
            await changerMotDePasse(fields.current, fields.new, token!);
            setFields({ current: "", new: "", confirm: "" });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du changement de mot de passe");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Sécurité</h2>
                <p className="text-xs text-gray-400 mt-0.5">Modifiez votre mot de passe de connexion</p>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                {FIELDS.map((field) => (
                    <TextField key={field.key} isRequired>
                        <Label className="text-sm font-medium text-gray-700">{field.label}</Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock size={15} color="#9ca3af" />
                            </span>
                            <Input
                                type={show[field.key] ? "text" : "password"}
                                placeholder="••••••••"
                                value={fields[field.key]}
                                onChange={(e) => setFields((f) => ({ ...f, [field.key]: e.target.value }))}
                                className="w-full pl-9 pr-10 shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((s) => ({ ...s, [field.key]: !s[field.key] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {show[field.key] ? <EyeSlash size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </TextField>
                ))}

                {error && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    {success && (
                        <p className="text-sm text-green-600 font-medium">✓ Mot de passe mis à jour</p>
                    )}
                    <div className={success ? "" : "ml-auto"}>
                        <Button
                            type="submit"
                            isDisabled={isSaving || !fields.current || !fields.new || !fields.confirm}
                            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                            {isSaving ? "Mise à jour..." : "Mettre à jour"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
