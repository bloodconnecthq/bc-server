"use client";

import { Button, InputOTP } from "@heroui/react";
import { REGEXP_ONLY_DIGITS } from '@heroui/react';
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function StepOTP() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [otp, setOTP] = useState("")


    return (
        <div className="space-y-6">

            <img src="/icons/logo.png" alt="Logo Icon" />

            <h3 className="text-[24px] font-bold text-black">
                Code de vérification
            </h3>

            <p className="text-black">
                Entrez le code envoyé à{" "}
                <span className="text-secondary">{email}</span>
            </p>

            <div className="flex flex-col gap-3 max-w-77.5">
                <InputOTP autoFocus pattern={REGEXP_ONLY_DIGITS} maxLength={6} value={otp} onChange={setOTP} className="w-full!">
                    <InputOTP.Group className="flex justify-between gap-4">
                        <InputOTP.Slot index={0} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                        <InputOTP.Slot index={1} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                        <InputOTP.Slot index={2} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                        <InputOTP.Slot index={3} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                        <InputOTP.Slot index={4} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                        <InputOTP.Slot index={5} className="focus:outline-none! data-[active=true]:ring-1 outline-0 focus:border-none focus:ring-[1px] border border-gray-200 shadow-none!" />
                    </InputOTP.Group>
                </InputOTP>

                <div className="flex justify-between text-sm mt-4 max-w-full">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/auth/signin?step=1")}
                        className="text-black bg-transparent p-0"
                    >
                        Retour
                    </Button>

                    <Button
                        variant="ghost"
                        className="text-secondary bg-transparent p-0">
                        Renvoyer le code
                    </Button>
                </div>
            </div>
        </div>
    );
}
