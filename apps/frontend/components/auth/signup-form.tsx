"use client"
import { Button, Input, Label, Link, TextField } from "@heroui/react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInputCustom from "./phone-input";
function SignUpForm() {


    const router = useRouter();
    const [email, setEmail] = useState("");
    const handleSubmit = () => {
        if (!email) return;
        // TODO: appeler API ici
        router.push(`/auth/signin?step=2&email=${encodeURIComponent(email)}`);
    };

    const [whatsapp, setWhatsapp] = useState();

    return (
        <div className="space-y-4">
            <div>
                <img src="/icons/logo.png" alt="Logo Icon" />
                <h3 className="text-[24px] text-black mt-4 font-bold">
                    Inscrivez-vous !
                </h3>

                <p className="text-foreground mt-4">
                    Vous avez un compte ?{" "}
                    <Link href="/auth/signin" className="">Connectez-vous</Link>
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 w-full">
                <TextField isRequired className="flex flex-col gap-1">
                    <Label htmlFor="email">Nom</Label>
                    <Input
                        type="text"
                        placeholder=""
                        variant="primary"
                        className="w-full focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!"
                    />
                </TextField>
                <TextField isRequired className="flex flex-col gap-1">
                    <Label htmlFor="email">Prénom</Label>
                    <Input
                        type="text"
                        placeholder=""
                        variant="primary"
                        className="w-full focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!"
                    />
                </TextField>
            </div>

            <div className="w-full mt-4">
                <label
                    htmlFor="whatsapp-input"
                    className="mb-1 block text-sm font-medium"
                >
                    Numéro WhatsApp
                </label>
                <PhoneInputCustom
                    value={whatsapp}
                    onChange={(data) => setWhatsapp(data.full)}
                    classNames={{
                        container:
                            "w-full !border bg-white/5 border-gray-200 rounded-xl hover:bg-gray-50",
                        inputWrapper: "bg-white/5 text-white rounded-xl px-4 py-1",
                        button: "!text-black",
                        input:
                            "!placeholder-/50 placeholder:text-sm focus:border-primary text-foreground placeholder:font-normal",
                        dropdown: "bg-gray-900",
                        dropdownItem: "hover:bg-primary hover:text-white",
                    }}
                />
            </div>

            <TextField isRequired className="flex flex-col gap-1">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    variant="primary"
                    className="w-full focus:outline-none! focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!"
                />

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="w-full rounded-3xl mt-4">
                    Continuer
                </Button>
            </TextField>
        </div>
    )
}

export default SignUpForm