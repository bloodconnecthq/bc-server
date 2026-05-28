"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  DocumentText, ArrowRight2, SearchNormal1, TickCircle,
  CloseCircle, Clock, Warning2, InfoCircle,
} from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import { getRegistrePsl, type RegistrePslData } from "@/lib/api/hospitalApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
  "O+": "bg-red-100 text-red-700", "O-": "bg-red-200 text-red-800",
  "A+": "bg-blue-100 text-blue-700", "A-": "bg-blue-200 text-blue-800",
  "B+": "bg-green-100 text-green-700", "B-": "bg-green-200 text-green-800",
  "AB+": "bg-purple-100 text-purple-700", "AB-": "bg-purple-200 text-purple-800",
};

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function fmtDateTime(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const STATUT_CFG = {
  transfere:     { label: "Transféré",     color: "bg-amber-50 text-amber-700 border-amber-200"  },
  non_satisfait: { label: "Non satisfait", color: "bg-red-50 text-red-700 border-red-200"        },
  satisfait:     { label: "Satisfait",     color: "bg-green-50 text-green-700 border-green-200"  },
  en_attente:    { label: "En attente",    color: "bg-gray-50 text-gray-600 border-gray-200"     },
} as const;

// ── Row component ─────────────────────────────────────────────────────────────

function PslRow({ entry, index }: { entry: RegistrePslData; index: number }) {
  const statutKey = (entry.bonDemande?.statut ?? "en_attente") as keyof typeof STATUT_CFG;
  const statutCfg = STATUT_CFG[statutKey] ?? STATUT_CFG.en_attente;
  const groupColor = GROUP_COLORS[entry.bonDemande?.groupeSanguinPatient ?? ""] ?? "bg-gray-100 text-gray-500";
  const retourEnregistre = !!entry.retourLe;

  return (
    <tr className="hover:bg-gray-50/60 transition-colors group">
      {/* # */}
      <td className="pl-6 pr-3 py-4 text-xs text-gray-400 font-mono">{index + 1}</td>

      {/* Date enregistrement */}
      <td className="px-3 py-4">
        <p className="text-xs font-semibold text-gray-800">{fmtDate(entry.creeLe)}</p>
        <p className="text-xs text-gray-400 mt-0.5">Enregistré</p>
      </td>

      {/* Patient + groupe */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <span className={clsx("text-xs font-black px-2 py-1 rounded-lg shrink-0", groupColor)}>
            {entry.bonDemande?.groupeSanguinPatient ?? "?"}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {entry.bonDemande?.nomPatient ?? "Patient inconnu"}
            </p>
            <p className="text-xs text-gray-400">
              {entry.bonDemande?.quantiteNecessaire ?? "?"} poche{(entry.bonDemande?.quantiteNecessaire ?? 1) > 1 ? "s" : ""} demandée{(entry.bonDemande?.quantiteNecessaire ?? 1) > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </td>

      {/* Médecin demandeur */}
      <td className="px-3 py-4">
        <p className="text-xs text-gray-700">
          {entry.bonDemande?.medecin?.nomComplet ?? "—"}
        </p>
      </td>

      {/* Motif */}
      <td className="px-3 py-4 max-w-48">
        <p className="text-xs text-gray-600 line-clamp-2">
          {entry.motif ?? <span className="text-gray-300 italic">Non précisé</span>}
        </p>
      </td>

      {/* Orienté vers */}
      <td className="px-3 py-4">
        {entry.transfereVers ? (
          <div className="flex items-center gap-1.5">
            <ArrowRight2 size={12} color="#f59e0b" />
            <p className="text-xs font-medium text-amber-700">{entry.transfereVers}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      {/* Tracé le */}
      <td className="px-3 py-4">
        <p className="text-xs text-gray-600">{fmtDateTime(entry.traceLe)}</p>
      </td>

      {/* Retour / mention */}
      <td className="px-3 py-4">
        {retourEnregistre ? (
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <TickCircle size={12} color="#16a34a" variant="Bold" />
              <span className="text-xs font-semibold text-green-700">Poche obtenue</span>
            </div>
            <p className="text-xs text-gray-400">{fmtDate(entry.retourLe)}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">En attente retour</span>
        )}
      </td>

      {/* Statut bon */}
      <td className="px-3 pr-6 py-4">
        <span className={clsx(
          "text-xs font-medium px-2.5 py-1 rounded-full border",
          statutCfg.color
        )}>
          {statutCfg.label}
        </span>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PslPage() {
  const { token } = useAuth();
  const authToken = token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const [entries, setEntries] = useState<RegistrePslData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRegistrePsl(authToken);
      setEntries(data);
    } catch (e: any) {
      setError(e?.message ?? "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? entries.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.bonDemande?.nomPatient?.toLowerCase().includes(q) ||
          e.bonDemande?.groupeSanguinPatient?.toLowerCase().includes(q) ||
          e.bonDemande?.medecin?.nomComplet?.toLowerCase().includes(q) ||
          e.transfereVers?.toLowerCase().includes(q) ||
          e.motif?.toLowerCase().includes(q)
        );
      })
    : entries;

  // KPIs
  const total        = entries.length;
  const avecRetour   = entries.filter((e) => !!e.retourLe).length;
  const sansRetour   = total - avecRetour;
  const groupes      = [...new Set(entries.map((e) => e.bonDemande?.groupeSanguinPatient).filter(Boolean))].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registre PSL</h1>
        <p className="text-sm text-gray-500 mt-1">
          Produits Sanguins Labiles — demandes non satisfaites, transferts et mentions de retour
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total enregistrements", value: total,      color: "text-gray-800",   bg: "bg-gray-50"   },
          { label: "Retour enregistré",      value: avecRetour, color: "text-green-700",  bg: "bg-green-50"  },
          { label: "En attente de retour",   value: sansRetour, color: "text-amber-700",  bg: "bg-amber-50"  },
          { label: "Groupes sanguins",       value: groupes,    color: "text-blue-700",   bg: "bg-blue-50"   },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className={clsx("text-2xl font-black", k.color)}>
              {isLoading ? "…" : k.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <SearchNormal1 size={15} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Patient, groupe, médecin, centre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 w-72"
          />
        </div>
        {search && (
          <p className="text-xs text-gray-400">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-sm text-red-700">
            <Warning2 size={16} />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="pl-6 pr-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médecin</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Motif</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orienté vers</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracé le</th>
                <th className="px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retour / Mention</th>
                <th className="px-3 pr-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut bon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-3 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <DocumentText size={22} color="#9ca3af" />
                    </div>
                    <p className="text-sm font-semibold text-gray-400">
                      {search ? "Aucun résultat pour cette recherche" : "Aucun enregistrement PSL"}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Les demandes non satisfaites et transferts apparaîtront ici
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry, i) => (
                  <PslRow key={entry.id} entry={entry} index={i} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 flex items-center gap-2">
            <InfoCircle size={14} color="#9ca3af" />
            <p className="text-xs text-gray-400">
              {filtered.length} entrée{filtered.length > 1 ? "s" : ""} dans le registre
              {avecRetour > 0 && ` · ${avecRetour} avec mention de retour`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
