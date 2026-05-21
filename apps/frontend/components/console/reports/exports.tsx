"use client";

import { useState } from "react";
import { Button, Alert } from "@heroui/react";
import clsx from "clsx";

type ExportFormat = "csv" | "pdf" | "excel";
type ExportPeriod = "week" | "month" | "quarter" | "year";

interface ExportConfig {
  id: string;
  title: string;
  description: string;
  emoji: string;
  available: boolean;
}

const exportTypes: ExportConfig[] = [
  {
    id: "donations",
    title: "Rapport des dons",
    description: "Liste complète des dons avec statuts, tests et centres",
    emoji: "🩸",
    available: true,
  },
  {
    id: "donors",
    title: "Rapport des donneurs",
    description: "Base de données des donneurs actifs, badges et historique",
    emoji: "👥",
    available: true,
  },
  {
    id: "stocks",
    title: "Rapport des stocks",
    description: "Inventaire national par département et groupe sanguin",
    emoji: "📦",
    available: true,
  },
  {
    id: "hospitals",
    title: "Rapport des établissements",
    description: "Liste des hôpitaux et centres affiliés avec leurs indicateurs",
    emoji: "🏥",
    available: true,
  },
  {
    id: "alerts",
    title: "Rapport des alertes",
    description: "Historique des alertes déclenchées et resolues",
    emoji: "🚨",
    available: true,
  },
  {
    id: "performance",
    title: "Rapport de performance",
    description: "KPIs nationaux : taux de collecte, fidélisation, rejet",
    emoji: "📊",
    available: true,
  },
];

const periods: { key: ExportPeriod; label: string }[] = [
  { key: "week",    label: "Cette semaine"    },
  { key: "month",   label: "Ce mois"          },
  { key: "quarter", label: "Ce trimestre"     },
  { key: "year",    label: "Cette année"      },
];

const formats: { key: ExportFormat; label: string; emoji: string }[] = [
  { key: "csv",   label: "CSV",   emoji: "📄" },
  { key: "pdf",   label: "PDF",   emoji: "📕" },
  { key: "excel", label: "Excel", emoji: "📗" },
];

export function ReportsExports() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["donations"]);
  const [selectedPeriod, setSelectedPeriod] = useState<ExportPeriod>("month");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selectedTypes.length === 0) return;
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 4000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Exporter des données
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Configurez et téléchargez vos rapports personnalisés
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Feedback export */}
        {exported && (
          <Alert status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Export généré avec succès !</Alert.Title>
              <Alert.Description>
                {selectedTypes.length} rapport{selectedTypes.length > 1 ? "s" : ""} exporté{selectedTypes.length > 1 ? "s" : ""} au format {selectedFormat.toUpperCase()} — période : {periods.find((p) => p.key === selectedPeriod)?.label}
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Colonne 1 — Types de rapports */}
          <div className="col-span-2 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              1. Sélectionnez les rapports
            </p>
            <div className="grid grid-cols-2 gap-3">
              {exportTypes.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <div
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      isSelected
                        ? "border-red-300 bg-red-50 ring-1 ring-red-200"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-xl shrink-0">{type.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-900">
                          {type.title}
                        </p>
                        <div className={clsx(
                          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                          isSelected
                            ? "border-red-600 bg-red-600"
                            : "border-gray-300"
                        )}>
                          {isSelected && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne 2 — Période + Format + Action */}
          <div className="space-y-5">
            {/* Période */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                2. Période
              </p>
              <div className="space-y-2">
                {periods.map((p) => (
                  <div
                    key={p.key}
                    onClick={() => setSelectedPeriod(p.key)}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm",
                      selectedPeriod === p.key
                        ? "border-red-300 bg-red-50 text-red-700 font-semibold"
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    )}
                  >
                    {p.label}
                    {selectedPeriod === p.key && (
                      <div className="w-2 h-2 bg-red-600 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                3. Format
              </p>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((f) => (
                  <div
                    key={f.key}
                    onClick={() => setSelectedFormat(f.key)}
                    className={clsx(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all",
                      selectedFormat === f.key
                        ? "border-red-300 bg-red-50"
                        : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <span className="text-lg">{f.emoji}</span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      selectedFormat === f.key ? "text-red-700" : "text-gray-600"
                    )}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton export */}
            <div className="pt-2">
              {selectedTypes.length === 0 ? (
                <Alert status="warning">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>
                      Sélectionnez au moins un rapport
                    </Alert.Title>
                  </Alert.Content>
                </Alert>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  isPending={isExporting}
                  onPress={handleExport}
                  className="bg-red-600 text-white rounded-xl py-3 font-semibold"
                >
                  {isExporting
                    ? "Génération en cours..."
                    : `Exporter ${selectedTypes.length} rapport${selectedTypes.length > 1 ? "s" : ""}`}
                </Button>
              )}

              {selectedTypes.length > 0 && !isExporting && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  {selectedFormat.toUpperCase()} · {periods.find((p) => p.key === selectedPeriod)?.label}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}