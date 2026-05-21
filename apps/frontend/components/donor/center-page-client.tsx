"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { SearchNormal1, Location } from "iconsax-reactjs";
import { CenterCard } from "./center-card";
import { Button, Input, TextField } from "@heroui/react";
import { useCenters } from "@/lib/hooks/useCenters";

const CentersMap = dynamic(() => import("./centers-map"), { ssr: false });

export type Center = {
  id: string;
  name: string;
  type: "fixed" | "mobile";
  commune: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance: number;
  hours: string;
  openNow: boolean;
  stocks: {
    critical: string[];
    needed: string[];
  };
};

export function CentersPageClient() {
  const { centers: apiCenters, isLoading, error } = useCenters();
  const [search, setSearch] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("Toutes");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.3702, 2.3912]);

  const centers: Center[] = useMemo(() => {
    return apiCenters.map((center) => ({
      id: center.id,
      name: center.nom,
      type: "fixed" as const,
      commune: center.commune || "",
      address: center.adresse || "",
      phone: center.telephone || "+229 XX XX XX XX",
      lat: center.latitude || 6.3702,
      lng: center.longitude || 2.3912,
      distance: 0,
      hours: "Lun–Ven 07h–17h · Sam 08h–12h",
      openNow: true,
      stocks: { critical: [], needed: [] },
    }));
  }, [apiCenters]);

  const communes = useMemo(() => {
    const uniqueCommunes = ["Toutes", ...new Set(centers.map((c) => c.commune).filter(Boolean))];
    return uniqueCommunes;
  }, [centers]);

  const filtered = useMemo(() => {
    return centers
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.commune.toLowerCase().includes(search.toLowerCase()) ||
          c.address.toLowerCase().includes(search.toLowerCase());
        const matchesCommune =
          selectedCommune === "Toutes" || c.commune === selectedCommune;
        return matchesSearch && matchesCommune;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [search, selectedCommune, centers]);

  const handleSelectCenter = (center: Center) => {
    setSelectedCenter(center);
    setMapCenter([center.lat, center.lng]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Chargement des centres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6 h-[calc(100vh-220px)]">
      <div className="col-span-2 flex flex-col gap-4 overflow-hidden">

        <div className="space-y-3">
          <div className="relative">
            <TextField>
              <div className="relative mt-1">
                <span className="absolute  top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchNormal1
                    size={16}
                    color="#9ca3af"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </span>
                <Input
                  type="text"
                  placeholder="Rechercher un centre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 shadow-none! rounded-xl border border-gray-200 bg-white focus-visible:border-red-500 focus-visible:ring-0"
                />
              </div>
            </TextField>
          </div>


          <div className="flex gap-2 flex-wrap">
            {communes.map((c) => (
              <Button
                key={c}
                onClick={() => setSelectedCommune(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCommune === c
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
                  }`}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>


        <p className="text-xs text-gray-400">
          {filtered.length} centre{filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
        </p>


        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Location size={32} color="#d1d5db" />
              <p className="text-sm text-gray-400 mt-3">Aucun centre trouvé</p>
              <p className="text-xs text-gray-300 mt-1">
                Essayez une autre commune
              </p>
            </div>
          ) : (
            filtered.map((center) => (
              <CenterCard
                key={center.id}
                center={center}
                isSelected={selectedCenter?.id === center.id}
                onSelect={() => handleSelectCenter(center)}
              />
            ))
          )}
        </div>
      </div>

      <div className="col-span-3 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <CentersMap
          centers={filtered}
          selectedCenter={selectedCenter}
          mapCenter={mapCenter}
          onSelectCenter={handleSelectCenter}
        />
      </div>
    </div>
  );
}