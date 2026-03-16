"use client";
import StatCard from "@/components/console/stat-card";
import { Button, ListBox } from "@heroui/react";
import { Export } from "iconsax-reactjs";
import { Select } from "@heroui/react";
import DashboardLayout from "@/components/console/dashboard-layout";

const VERSUS = [
    { slug: "hour", label: "Heure" },
    { slug: "day", label: "Jour" },
    { slug: "week", label: "Semaine" },
    { slug: "month", label: "Mois" },
    { slug: "year", label: "Année" }
]

export default function Overview() {

    return (
        <DashboardLayout>
            <div className="">
                <div className="flex bg-white p-4 items-center justify-between mb-4">
                    <div className="">
                        <h2 className="text-2xl font-semibold">Bonjour, Sébastien</h2>
                        <p className="text-foreground/70 text-sm">Bienvenue sur votre tableau de bord Xèdo Business</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-4">
                        <Select defaultValue="hour" className="w-50">
                            <Select.Trigger className="w-full data-[hovered=true]:bg-gray-50 border shadow-none border-gray-200 rounded-lg px-3 py-2 text-sm
                                                                 bg-white flex items-center justify-between outline-none focus:ring-[1px] focus:ring-primary">
                                <Select.Value className="text-sm text-gray-700" />
                                <Select.Indicator className="text-gray-400" />
                            </Select.Trigger>
                            <Select.Popover className="bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                                <ListBox>
                                    {VERSUS.map((v) => (
                                        <ListBox.Item
                                            key={v.slug}
                                            id={v.slug}
                                            textValue={v.slug}
                                            className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                        >
                                            {v.label}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>

                        <Button
                            className="rounded-xl"
                            variant="primary">
                            <Export size={24} className="text-white font-bold" />
                            Exporter
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard title="Revenus" value="147 000 Fcfa" change="+25%" />
                        <StatCard title="Ventes" value="120" change="-10%" positive={false} />
                        <StatCard title="Visiteurs" value="561" change="+15%" />
                        <StatCard title="Taux de conversion" value="7%" change="+25%" />
                    </div>
                    <div className="bg-white rounded-xl border p-4 mb-6 h-64 flex items-center justify-center">

                    </div>
                    <div className="bg-white rounded-xl border p-4 mb-6 h-64 flex items-center justify-center">

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
