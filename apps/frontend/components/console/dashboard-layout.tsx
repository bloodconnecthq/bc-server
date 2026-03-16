"use client"
import React, { useState } from "react";
import Sidebar from "../layouts/sidebar";
import Header from "../layouts/header";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsOpen(true)} />

                <main className="overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}