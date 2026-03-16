"use client";
import StatCard from "@/components/console/stat-card";
import { Button, InputGroup, ListBox } from "@heroui/react";
import { Add, ArrowLeft2, SearchNormal1 } from "iconsax-reactjs";
import { Select } from "@heroui/react";
import DashboardLayout from "@/components/console/dashboard-layout";

const VERSUS = [
    { slug: "hour", label: "Heure" },
    { slug: "day", label: "Jour" },
    { slug: "week", label: "Semaine" },
    { slug: "month", label: "Mois" },
    { slug: "year", label: "Année" }
]

export default function Collections() {

    return (
        <DashboardLayout>
            <div className="">
                <div className="flex items-center justify-between mb-4 bg-white p-4">
                    <div className="">
                        <h2 className="flex items-center gap-1 text-2xl font-semibold">
                            <ArrowLeft2 size={18} className="font-bold" />
                            Collections</h2>
                        <p className="text-foreground/70 text-sm">Gérer vos collections sur la marketplace</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <InputGroup className="border-0 w-55 focus:border-0 hidden lg:flex shadow-none outline-0">
                            <InputGroup.Prefix>
                                <SearchNormal1 className="size-4 text-muted" />
                            </InputGroup.Prefix>
                            <InputGroup.Input className="w-full max-w-80 truncate outline-0 focus:border-0 focus:ring-0 border-0 ring-0"
                                placeholder="Rechercher une collection" />
                        </InputGroup>

                        <Button
                            className="rounded-xl text-white!"
                            variant="primary">
                            <Add size={24} className="text-white font-bold" />
                            Créer une collection
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    
                    <div className="bg-white rounded-xl border p-4 mb-6 h-64 flex items-center justify-center">

                    </div>
                    <div className="bg-white rounded-xl border p-4 mb-6 h-64 flex items-center justify-center">

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
