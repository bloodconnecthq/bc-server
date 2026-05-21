"use client";

import { Button, Input, Label, Link, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StepEmail() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleSubmit = () => {
        if (!email) return;

        // TODO: appeler API ici

        router.push(`/auth/signin?step=2&email=${encodeURIComponent(email)}`);
    };

    return (
        <div className="space-y-6">
            <div className="text-cente">
                <img src="/icons/logo.png" alt="Logo Icon" />
                <h3 className="text-[24px] text-black mt-4 font-bold">
                    Connectez-vous !
                </h3>

                <p className="text-foreground mt-4">
                    Vous n'avez pas de compte ?{" "}
                    <Link href="/auth/signup" className="">Créer un compte</Link>
                </p>
            </div>
            <TextField name="email" isRequired className="flex flex-col gap-1">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    placeholder=""
                    variant="primary"
                    className="w-full focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!"
                />

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="w-full rounded-[10px] mt-2">
                    Continuer
                </Button>
            </TextField>
        </div>
    );
}
