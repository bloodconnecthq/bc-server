"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { SearchNormal1, Location } from "iconsax-reactjs";
import { CenterCard } from "./center-card";

// Import dynamique pour éviter SSR avec Leaflet
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

const centers: Center[] = [
  {
    id: "cnts-cotonou",
    name: "CNTS Cotonou",
    type: "fixed",
    commune: "Cotonou",
    address: "Avenue Jean-Paul II, Cotonou",
    phone: "+229 21 31 20 02",
    lat: 6.3702,
    lng: 2.3912,
    distance: 1.2,
    hours: "Lun–Ven 07h–17h · Sam 08h–12h",
    openNow: true,
    stocks: { critical: ["B-", "AB-"], needed: ["O-"] },
  },
  {
    id: "chu-cnhu",
    name: "Banque de sang CNHU",
    type: "fixed",
    commune: "Cotonou",
    address: "CHU de Cotonou, Bp 386",
    phone: "+229 21 30 01 15",
    lat: 6.3654,
    lng: 2.4218,
    distance: 3.8,
    hours: "Lun–Dim 08h–20h",
    openNow: true,
    stocks: { critical: ["O-"], needed: ["A-", "B-"] },
  },
  {
    id: "hopital-zone-pn",
    name: "Hôpital de Zone Porto-Novo",
    type: "fixed",
    commune: "Porto-Novo",
    address: "Rue des Jardins, Porto-Novo",
    phone: "+229 20 21 43 78",
    lat: 6.4969,
    lng: 2.6289,
    distance: 28.5,
    hours: "Lun–Ven 08h–16h",
    openNow: false,
    stocks: { critical: ["AB-", "B-"], needed: ["O+"] },
  },
  {
    id: "cnts-parakou",
    name: "Antenne CNTS Parakou",
    type: "fixed",
    commune: "Parakou",
    address: "Avenue du Stade, Parakou",
    phone: "+229 23 61 07 44",
    lat: 9.337,
    lng: 2.628,
    distance: 410,
    hours: "Lun–Ven 07h30–16h30",
    openNow: true,
    stocks: { critical: ["AB+", "AB-"], needed: ["A-"] },
  },
  {
    id: "centre-godomey",
    name: "Centre de Santé Godomey",
    type: "mobile",
    commune: "Abomey-Calavi",
    address: "Carrefour Godomey, Abomey-Calavi",
    phone: "+229 97 55 44 33",
    lat: 6.4074,
    lng: 2.3318,
    distance: 8.6,
    hours: "Mar & Jeu 09h–15h",
    openNow: false,
    stocks: { critical: [], needed: ["O-", "B-"] },
  },
  {
    id: "uac-collecte",
    name: "Collecte UAC Abomey-Calavi",
    type: "mobile",
    commune: "Abomey-Calavi",
    address: "Université d'Abomey-Calavi",
    phone: "+229 21 36 00 74",
    lat: 6.4226,
    lng: 2.3375,
    distance: 10.1,
    hours: "Mer 08h–13h (sessions mensuelles)",
    openNow: false,
    stocks: { critical: [], needed: ["O+", "A+"] },
  },
];

const communes = ["Toutes", "Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi"];

export function CentersPageClient() {
  const [search, setSearch] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("Toutes");
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.3702, 2.3912]);

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
  }, [search, selectedCommune]);

  const handleSelectCenter = (center: Center) => {
    setSelectedCenter(center);
    setMapCenter([center.lat, center.lng]);
  };

  return (
    <div className="grid grid-cols-5 gap-6 h-[calc(100vh-220px)]">
      {/* Panneau gauche — liste */}
      <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
        {/* Recherche */}
        <div className="space-y-3">
          <div className="relative">
            <SearchNormal1
              size={16}
              color="#9ca3af"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Rechercher un centre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Filtre communes */}
          <div className="flex gap-2 flex-wrap">
            {communes.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCommune(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCommune === c
                    ? "bg-red-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats */}
        <p className="text-xs text-gray-400">
          {filtered.length} centre{filtered.length > 1 ? "s" : ""} trouvé
          {filtered.length > 1 ? "s" : ""}
        </p>

        {/* Liste scrollable */}
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

      {/* Carte — 3 colonnes */}
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