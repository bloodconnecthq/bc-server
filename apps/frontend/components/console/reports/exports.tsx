"use client";

import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getDonneurs, getHopitaux, getRapportDons,
  getRapportDonneurs, getRapportStocks, getRapportHopitaux,
} from "@/lib/api/consoleApi";
import { buildCSV, buildExcel, printPDF, downloadBlob, type CSVSection } from "@/lib/utils/export";

// ── Config ───────────────────────────────────────────────────────────────────

type ExportFormat = "csv" | "excel" | "pdf";
type ExportPeriod = "week" | "month" | "quarter" | "year";

interface ExportType {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const exportTypes: ExportType[] = [
  { id: "donors",    emoji: "👥", title: "Rapport des donneurs",        description: "Liste complète des donneurs avec groupe, statut, dons, badges" },
  { id: "stocks",    emoji: "📦", title: "Rapport des stocks",           description: "Inventaire par hôpital et groupe sanguin"                      },
  { id: "hospitals", emoji: "🏥", title: "Rapport des établissements",  description: "Liste des hôpitaux, membres, activité de collecte"             },
  { id: "donations", emoji: "🩸", title: "Rapport des dons",             description: "Statistiques de dons par mois, type et statut"                 },
  { id: "performance", emoji: "📊", title: "Rapport de performance",    description: "KPIs nationaux : taux de collecte, validation, stocks"         },
];

const periods: { key: ExportPeriod; label: string }[] = [
  { key: "week",    label: "Cette semaine"  },
  { key: "month",   label: "Ce mois"        },
  { key: "quarter", label: "Ce trimestre"   },
  { key: "year",    label: "Cette année"    },
];

const formats: { key: ExportFormat; label: string; emoji: string; desc: string }[] = [
  { key: "csv",   emoji: "📄", label: "CSV",   desc: "Universel"        },
  { key: "excel", emoji: "📗", label: "Excel", desc: "Tableau .xls"     },
  { key: "pdf",   emoji: "📕", label: "PDF",   desc: "Impression"       },
];

// ── Data builders ────────────────────────────────────────────────────────────

const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];

function fmtMonth(key: string) {
  const [, m] = key.split("-");
  return MONTHS_FR[parseInt(m) - 1] ?? key;
}

async function buildSections(
  selectedTypes: string[],
  period: ExportPeriod,
  token: string
): Promise<CSVSection[]> {
  const periodLabel = periods.find((p) => p.key === period)?.label ?? period;
  const sections: CSVSection[] = [];

  // Fetch only what's needed
  const needs = {
    donors:      selectedTypes.includes("donors")      || selectedTypes.includes("performance"),
    stocks:      selectedTypes.includes("stocks")      || selectedTypes.includes("performance"),
    hospitals:   selectedTypes.includes("hospitals")   || selectedTypes.includes("performance"),
    donations:   selectedTypes.includes("donations")   || selectedTypes.includes("performance"),
    donneursRap: selectedTypes.includes("performance") || selectedTypes.includes("donors"),
    hopitauxRap: selectedTypes.includes("performance") || selectedTypes.includes("hospitals"),
  };

  const [
    doneursList, stocksRap, hopitauxList, donsRap, donneursRap, hopitauxRap,
  ] = await Promise.all([
    needs.donors    ? getDonneurs(token)            : null,
    needs.stocks    ? getRapportStocks(token)       : null,
    needs.hospitals ? getHopitaux(token)            : null,
    needs.donations ? getRapportDons(token)         : null,
    needs.donneursRap ? getRapportDonneurs(token)   : null,
    needs.hopitauxRap ? getRapportHopitaux(token)   : null,
  ]);

  // ── Donneurs ──────────────────────────────────────────────────────────────
  if (selectedTypes.includes("donors") && doneursList) {
    sections.push({
      title:   `Donneurs — ${periodLabel}`,
      headers: ["Code", "Prénom", "Nom", "Groupe sanguin", "Email", "Téléphone", "Commune", "Département", "Total dons", "Badge", "Statut", "Éligible", "Inscrit le"],
      rows: (doneursList ?? []).map((d) => [
        d.codeDonneur,
        d.utilisateur?.prenom ?? "",
        d.utilisateur?.nom    ?? "",
        d.groupeSanguin       ?? "",
        d.utilisateur?.email  ?? "",
        d.utilisateur?.telephone  ?? "",
        d.utilisateur?.commune    ?? "",
        d.utilisateur?.departement ?? "",
        d.totalDons,
        d.niveauBadge,
        d.statut,
        d.estEligible ? "Oui" : "Non",
        d.creeLe ? new Date(d.creeLe).toLocaleDateString("fr-FR") : "",
      ]),
    });

    if (donneursRap) {
      sections.push({
        title:   "Statistiques donneurs",
        headers: ["Métrique", "Valeur"],
        rows: [
          ["Total inscrits",        donneursRap.total],
          ["Actifs",                donneursRap.actifs],
          ["Inactifs",              donneursRap.inactifs],
          ["Éligibles maintenant",  donneursRap.eligibles],
          ["Non éligibles",         donneursRap.nonEligibles],
          ["Ayant déjà donné",      donneursRap.ayantDonne],
          ["N'ayant jamais donné",  donneursRap.sansDonn],
        ],
      });

      const groupRows = Object.entries(donneursRap.parGroupeSanguin ?? {})
        .sort(([, a], [, b]) => b - a)
        .map(([g, n]) => [g, n]);
      if (groupRows.length > 0) {
        sections.push({
          title:   "Répartition par groupe sanguin",
          headers: ["Groupe", "Nombre de donneurs"],
          rows:    groupRows,
        });
      }

      const badgeRows = Object.entries(donneursRap.parNiveauBadge ?? {})
        .map(([b, n]) => [b, n]);
      if (badgeRows.length > 0) {
        sections.push({
          title:   "Répartition par badge",
          headers: ["Badge", "Nombre"],
          rows:    badgeRows,
        });
      }
    }
  }

  // ── Stocks ────────────────────────────────────────────────────────────────
  if (selectedTypes.includes("stocks") && stocksRap) {
    sections.push({
      title:   `Stocks par établissement — ${periodLabel}`,
      headers: ["Hôpital", "Commune", "Poches totales", "Sites critiques", "Sites faibles"],
      rows: (stocksRap.parHopital ?? []).map((h) => [
        h.nomHopital       ?? "",
        h.commune          ?? "",
        h.quantiteTotale   ?? 0,
        h.stocksCritiques  ?? 0,
        h.stocksFaibles    ?? 0,
      ]),
    });

    // Detailed stock per hospital
    const detailRows: (string | number)[][] = [];
    for (const h of stocksRap.parHopital ?? []) {
      for (const s of h.stocks ?? []) {
        detailRows.push([
          h.nomHopital,
          h.commune ?? "",
          s.groupeSanguin,
          s.quantite,
          s.seuilCritique,
          s.seuilFaible,
          s.quantite <= s.seuilCritique ? "Critique" : s.quantite <= s.seuilFaible ? "Faible" : "Normal",
        ]);
      }
    }
    if (detailRows.length > 0) {
      sections.push({
        title:   "Détail stocks par groupe sanguin",
        headers: ["Hôpital", "Commune", "Groupe", "Quantité", "Seuil critique", "Seuil faible", "État"],
        rows:    detailRows,
      });
    }

    sections.push({
      title:   "Résumé stocks",
      headers: ["Métrique", "Valeur"],
      rows: [
        ["Total poches en stock",      stocksRap.totalPoches],
        ["Établissements en crise",    stocksRap.hopitauxEnCrise],
      ],
    });
  }

  // ── Hôpitaux ──────────────────────────────────────────────────────────────
  if (selectedTypes.includes("hospitals") && hopitauxList) {
    const actMap: Record<string, { totalMembres: number; totalDons: number }> = {};
    for (const h of hopitauxRap?.parActivite ?? []) actMap[h.hopitalId] = h;

    sections.push({
      title:   `Établissements — ${periodLabel}`,
      headers: ["Nom", "Type", "Commune", "Département", "Adresse", "Téléphone", "Email", "Statut", "Membres", "Dons"],
      rows: (hopitauxList ?? []).map((h) => [
        h.nom,
        h.type ?? "",
        h.commune     ?? "",
        h.departement ?? "",
        h.adresse     ?? "",
        h.telephone   ?? "",
        h.email       ?? "",
        h.estActif ? "Actif" : "Inactif",
        actMap[h.id]?.totalMembres ?? 0,
        actMap[h.id]?.totalDons    ?? 0,
      ]),
    });

    if (hopitauxRap) {
      sections.push({
        title:   "Statistiques établissements",
        headers: ["Métrique", "Valeur"],
        rows: [
          ["Total établissements", hopitauxRap.total],
          ["Actifs",               hopitauxRap.actifs],
          ["Inactifs",             hopitauxRap.inactifs],
        ],
      });

      const typeRows = Object.entries(hopitauxRap.parType ?? {}).map(([t, n]) => [t, n]);
      if (typeRows.length > 0) {
        sections.push({
          title:   "Répartition par type",
          headers: ["Type", "Nombre"],
          rows:    typeRows,
        });
      }
    }
  }

  // ── Dons ──────────────────────────────────────────────────────────────────
  if (selectedTypes.includes("donations") && donsRap) {
    sections.push({
      title:   `Statistiques des dons — ${periodLabel}`,
      headers: ["Métrique", "Valeur"],
      rows: [
        ["Total dons",        donsRap.total],
        ["Validés",           donsRap.valides],
        ["En attente",        donsRap.enAttente],
        ["Rejetés",           donsRap.rejetes],
        ["Taux de validation",`${donsRap.tauxValidation}%`],
      ],
    });

    const moisRows = Object.entries(donsRap.parMois ?? {})
      .filter(([k]) => k !== "inconnu" && /^\d{4}-\d{2}$/.test(k))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, n]) => [`${fmtMonth(k)} ${k.split("-")[0]}`, n]);
    if (moisRows.length > 0) {
      sections.push({
        title:   "Dons par mois",
        headers: ["Mois", "Nombre de dons"],
        rows:    moisRows,
      });
    }

    const pocheRows = Object.entries(donsRap.parTypePoche ?? {})
      .sort(([, a], [, b]) => b - a)
      .map(([t, n]) => [t, n]);
    if (pocheRows.length > 0) {
      sections.push({
        title:   "Dons par type de poche",
        headers: ["Type de poche", "Nombre"],
        rows:    pocheRows,
      });
    }
  }

  // ── Performance ───────────────────────────────────────────────────────────
  if (selectedTypes.includes("performance") && donsRap && donneursRap && stocksRap && hopitauxRap) {
    sections.push({
      title:   `KPIs nationaux — ${periodLabel}`,
      headers: ["Indicateur", "Valeur", "Catégorie"],
      rows: [
        ["Total dons collectés",          donsRap.total,                   "Dons"],
        ["Taux de validation",            `${donsRap.tauxValidation}%`,    "Dons"],
        ["Dons en attente",               donsRap.enAttente,               "Dons"],
        ["Total donneurs inscrits",       donneursRap.total,               "Donneurs"],
        ["Donneurs actifs",               donneursRap.actifs,              "Donneurs"],
        ["Donneurs éligibles",            donneursRap.eligibles,           "Donneurs"],
        ["Donneurs ayant donné",          donneursRap.ayantDonne,          "Donneurs"],
        ["Total poches en stock",         stocksRap.totalPoches,           "Stocks"],
        ["Établissements en crise",       stocksRap.hopitauxEnCrise,       "Stocks"],
        ["Total établissements actifs",   hopitauxRap.actifs,              "Hôpitaux"],
        ["Total établissements inactifs", hopitauxRap.inactifs,            "Hôpitaux"],
      ],
    });
  }

  return sections;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReportsExports() {
  const { token } = useAuth();
  const [selectedTypes, setSelectedTypes]   = useState<string[]>(["donors", "donations"]);
  const [selectedPeriod, setSelectedPeriod] = useState<ExportPeriod>("month");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [status, setStatus]                 = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);

  const toggleType = (id: string) =>
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );

  const handleExport = async () => {
    if (!token || selectedTypes.length === 0) return;
    setStatus("loading");
    setErrorMsg(null);

    try {
      const sections = await buildSections(selectedTypes, selectedPeriod, token);
      if (sections.length === 0) throw new Error("Aucune donnée à exporter");

      const periodLabel = periods.find((p) => p.key === selectedPeriod)?.label ?? selectedPeriod;
      const dateStr     = new Date().toISOString().slice(0, 10);
      const title       = `Rapports Blood-Connect — ${periodLabel}`;
      const baseName    = `bloodconnect-rapport-${dateStr}`;

      if (selectedFormat === "csv") {
        downloadBlob(buildCSV(sections), `${baseName}.csv`, "text/csv;charset=utf-8;");
      } else if (selectedFormat === "excel") {
        downloadBlob(buildExcel(sections, title), `${baseName}.xls`, "application/vnd.ms-excel");
      } else if (selectedFormat === "pdf") {
        printPDF(sections, title);
      }

      setStatus("done");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Une erreur est survenue");
      setStatus("error");
    }
  };

  const canExport  = selectedTypes.length > 0 && status !== "loading";
  const periodLabel = periods.find((p) => p.key === selectedPeriod)?.label;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Exporter des données</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Téléchargez vos rapports en CSV, Excel ou PDF
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Feedback */}
        {status === "done" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
            <span className="text-lg">✅</span>
            {selectedFormat === "pdf"
              ? "Fenêtre d'impression ouverte."
              : `Fichier ${selectedFormat.toUpperCase()} téléchargé avec succès.`}
            {" "}— {selectedTypes.length} rapport{selectedTypes.length > 1 ? "s" : ""} · {periodLabel}
          </div>
        )}
        {status === "error" && errorMsg && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <span className="text-lg">⚠️</span>
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Col 1 — Types (2/3 width) */}
          <div className="col-span-2 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              1. Rapports à inclure
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {exportTypes.map((type) => {
                const active = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={clsx(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer text-left transition-all group",
                      active
                        ? "border-red-300 bg-red-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{type.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={clsx(
                          "text-xs font-bold",
                          active ? "text-red-700" : "text-gray-800"
                        )}>
                          {type.title}
                        </p>
                        {/* Checkbox */}
                        <div className={clsx(
                          "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all",
                          active ? "border-red-600 bg-red-600" : "border-gray-300 group-hover:border-gray-400"
                        )}>
                          {active && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2 — Config (1/3) */}
          <div className="space-y-5">
            {/* Période */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                2. Période
              </p>
              <div className="space-y-1.5">
                {periods.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPeriod(p.key)}
                    className={clsx(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all",
                      selectedPeriod === p.key
                        ? "border-red-300 bg-red-50 text-red-700 font-semibold"
                        : "border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {p.label}
                    {selectedPeriod === p.key && (
                      <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                3. Format
              </p>
              <div className="grid grid-cols-3 gap-2">
                {formats.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSelectedFormat(f.key)}
                    className={clsx(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all",
                      selectedFormat === f.key
                        ? "border-red-300 bg-red-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-xl">{f.emoji}</span>
                    <span className={clsx(
                      "text-xs font-bold",
                      selectedFormat === f.key ? "text-red-700" : "text-gray-600"
                    )}>{f.label}</span>
                    <span className="text-xs text-gray-400">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export button */}
            <div className="pt-1">
              <button
                onClick={handleExport}
                disabled={!canExport}
                className={clsx(
                  "w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2.5",
                  canExport
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {status === "loading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Récupération des données...
                  </>
                ) : (
                  <>
                    <span className="text-base">{formats.find((f) => f.key === selectedFormat)?.emoji}</span>
                    {selectedTypes.length === 0
                      ? "Sélectionnez un rapport"
                      : `Exporter ${selectedTypes.length} rapport${selectedTypes.length > 1 ? "s" : ""}`}
                  </>
                )}
              </button>

              {canExport && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  {selectedFormat.toUpperCase()} · {periodLabel} ·{" "}
                  {selectedTypes.map((id) => exportTypes.find((t) => t.id === id)?.emoji).join(" ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
