"use client";

import React from "react";
import TypingHeader from "./typing-header";

type AuthLayoutProps = {
    children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    const words = [
        "Bonjour",
        "Hello",
        "Kwabo",
        "Woezɔ",
        "Akwaba",
        "Dalal ak jàmm",
        "I ni ce",
        "Ne y windiga",
        "O yoma"
    ]

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className='hidden lg:flex relative items-center justify-center bg-no-repeat bg-contain bg-bottom-left
                 bg-[url("/images/bg-decoration.svg")] overflow-hidden bg-primary'
            >

                <div className="absolute inset-0 bg-linear-to-br from-black/50 via-[#ED823A]/2 to-[#ED823A]/30" />

                <div className="relative z-10 text-white px-12 max-w-md">

                    <img src="/icons/white-logo.png" alt="Xèdo White Logo Icon" className="w-12 my-4" />

                    <h1 className="text-4xl font-bold leading-tight mb-4 h-12">
                        <TypingHeader
                            words={words}
                        />{" "}
                    </h1>

                    <p className="text-white/80">
                        Gérez vos ventes et transactions en toute sécurité, avec fiabilité et simplicité.
                    </p>

                    <p className="mt0 text-sm text-white/50 -bottom-full absolute">
                        © 2026 Xedo Inc. Tous droits réservés.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-cente p-6 bg-white">
                <div className="w-full max-w-md p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
