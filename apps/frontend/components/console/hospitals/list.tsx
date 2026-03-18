"use client";

import { useState } from "react";
import clsx from "clsx";
import { SearchNormal1, Edit, Trash, Eye } from "iconsax-reactjs";
import { Button } from "@heroui/react";

type HospitalType = "cnts" | "chu" | "antenne" | "hopital" | "centre" | "mobile";
type HospitalStatus = "active" | "inactive";
type StockStatus = "ok" | "low" | "critical";

interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  commune: string;
  department: string;
  address: string;
  phone: string;
  email: string;
  members: number;
  donations: number;
  stock: number;
  status: HospitalStatus;
  stockStatus: StockStatus;
  createdAt: string;
}

const typeConfig: { [key in HospitalType]: { label: string; bg: string; text: string } } = {
  cnts:    { label: "CNTS",    bg: "bg-red-50",    text: "text-red-700"    },
  chu:     { label: "CHU",     bg: "bg-blue-50",   text: "text-blue-700"   },
  antenne: { label: "Antenne", bg: "bg-purple-50", text: "text-purple-700" },
  hopital: { label: "Hôpital", bg: "bg-green-50",  text: "text-green-700"  },
  centre:  { label: "Centre",  bg: "bg-amber-50",  text: "text-amber-700"  },
  mobile:  { label: "Mobile",  bg: "bg-gray-100",  text: "text-gray-600"   },
};

const stockConfig: { [key in StockStatus]: { badge: string } } = {
  ok:       { badge: "bg-green-50 text-green-700" },
  low:      { badge: "bg-amber-50 text-amber-700" },
  critical: { badge: "bg-red-50 text-red-700"     },
};

const typeFilters = ["Tous", "CNTS", "CHU", "Antenne", "Hôpital", "Centre", "Mobile"];

export function HospitalsList({ hospitals }: { hospitals: Hospital[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [selected, setSelected] = useState<Hospital | null>(null);

  const filtered = hospitals.filter((h) => {
    const matchSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.commune.toLowerCase().includes(search.toLowerCase()) ||
      h.department.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === "Tous" ||
      typeConfig[h.type].label === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4">
      {/* Filtres + Recherche */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1
            size={15}
            color="#9ca3af"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher un établissement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={clsx(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                typeFilter === f
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Tableau */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* En-tête */}
          <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Établissement</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1 text-center">Membres</div>
            <div className="col-span-1 text-center">Dons</div>
            <div className="col-span-1 text-center">Stock</div>
            <div className="col-span-1 text-center">Stocks</div>
            <div className="col-span-1 text-center">Statut</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Aucun établissement trouvé
              </div>
            )}
            {filtered.map((h) => {
              const tConfig = typeConfig[h.type];
              const sConfig = stockConfig[h.stockStatus];

              return (
                <div
                  key={h.id}
                  onClick={() => setSelected(h)}
                  className={clsx(
                    "grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-gray-50",
                    selected?.id === h.id && "bg-red-50"
                  )}
                >
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.commune} · {h.department}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", tConfig.bg, tConfig.text)}>
                      {tConfig.label}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-medium text-gray-700">{h.members}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-medium text-gray-700">{h.donations}</p>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="text-sm font-medium text-gray-700">{h.stock}</p>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", sConfig.badge)}>
                      {h.stockStatus === "ok" ? "Normal" : h.stockStatus === "low" ? "Faible" : "Critique"}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <div className={clsx(
                      "w-2 h-2 rounded-full",
                      h.status === "active" ? "bg-green-500" : "bg-gray-300"
                    )} />
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(h); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panneau détail */}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 self-start">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Détails</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Type + statut */}
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  typeConfig[selected.type].bg,
                  typeConfig[selected.type].text
                )}>
                  {typeConfig[selected.type].label}
                </span>
                <span className={clsx(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  selected.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                )}>
                  {selected.status === "active" ? "Actif" : "Inactif"}
                </span>
              </div>

              <div>
                <p className="text-base font-bold text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selected.commune} · {selected.department}</p>
              </div>

              {[
                { label: "Adresse", value: selected.address },
                { label: "Téléphone", value: selected.phone },
                { label: "Email", value: selected.email },
                { label: "Ajouté le", value: new Date(selected.createdAt).toLocaleDateString("fr-FR") },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              ))}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { label: "Membres", value: selected.members, color: "text-blue-600" },
                  { label: "Dons", value: selected.donations, color: "text-red-600" },
                  { label: "Poches", value: selected.stock, color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                  <Edit size={13} /> Modifier
                </Button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                  <Trash size={13} />
                  {selected.status === "active" ? "Suspendre" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}