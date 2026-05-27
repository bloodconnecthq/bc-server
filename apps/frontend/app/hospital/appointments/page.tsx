"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  Calendar, Clock, Drop, TickCircle, CloseCircle, Warning2,
  ArrowRight2, SearchNormal1, ArrowLeft2, People,
} from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospitalRdv, getMyAssignedRdv, sAttribuerRdv,
  marquerRdvEffectue, getMyMemberProfile,
  type RdvData, type RdvMeta,
} from "@/lib/api/hospitalApi";
import { DonationFlow } from "@/components/hospital/donations/donation-flow";

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  planifie: { label: "Planifié",  color: "text-blue-700 bg-blue-50 border-blue-200",    icon: Calendar    },
  confirme: { label: "Confirmé",  color: "text-green-700 bg-green-50 border-green-200", icon: TickCircle  },
  annule:   { label: "Annulé",   color: "text-red-700 bg-red-50 border-red-200",        icon: CloseCircle },
  effectue: { label: "Effectué", color: "text-gray-600 bg-gray-50 border-gray-200",     icon: TickCircle  },
} as const;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function isToday(d: string) {
  return new Date(d).toDateString() === new Date().toDateString();
}
function isFuture(d: string) {
  return new Date(d) > new Date();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={clsx(
      "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border",
      ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
    )}>
      {ok ? "✅" : "⚠️"} {msg}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ meta, onChange }: { meta: RdvMeta; onChange: (p: number) => void }) {
  if (meta.lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-gray-400">
        {meta.total} rendez-vous · page {meta.currentPage}/{meta.lastPage}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(meta.currentPage - 1)}
          disabled={meta.currentPage <= 1}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft2 size={13} /> Précédent
        </button>
        {Array.from({ length: meta.lastPage }, (_, i) => i + 1)
          .filter((p) => Math.abs(p - meta.currentPage) <= 2)
          .map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={clsx(
                "w-8 h-8 text-xs font-bold rounded-lg transition-all",
                p === meta.currentPage
                  ? "bg-red-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-red-300"
              )}
            >
              {p}
            </button>
          ))}
        <button
          onClick={() => onChange(meta.currentPage + 1)}
          disabled={meta.currentPage >= meta.lastPage}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Suivant <ArrowRight2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── RDV Card — File commune ───────────────────────────────────────────────────

function RdvCardCommune({
  rdv, onSAttribuer, loading,
}: {
  rdv: RdvData;
  onSAttribuer: (rdv: RdvData) => void;
  loading: boolean;
}) {
  const cfg     = STATUS_CFG[rdv.statut];
  const Icon    = cfg.icon;
  const today   = isToday(rdv.dateRdv);
  const future  = isFuture(rdv.dateRdv);

  return (
    <div className={clsx(
      "bg-white rounded-2xl border transition-all",
      today ? "border-red-200 ring-1 ring-red-100" : "border-gray-100 hover:border-gray-200"
    )}>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={clsx(
              "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0",
              rdv.donneur?.groupeSanguin ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"
            )}>
              {rdv.donneur?.groupeSanguin ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {rdv.donneur?.codeDonneur ?? "Donneur inconnu"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock size={11} color="#9ca3af" />
                <span className="text-xs text-gray-400">
                  {formatDate(rdv.dateRdv)} · {formatTime(rdv.dateRdv)}
                </span>
                {today && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                    Aujourd'hui
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={clsx(
            "text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 shrink-0",
            cfg.color
          )}>
            <Icon size={10} variant="Bold" />
            {cfg.label}
          </span>
        </div>

        {rdv.note && (
          <p className="mt-2 text-xs text-gray-400 italic border-l-2 border-gray-100 pl-2">{rdv.note}</p>
        )}

        {/* Claim button — only for upcoming/today, not cancelled/done */}
        {rdv.statut !== "annule" && rdv.statut !== "effectue" && (
          <div className="mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => onSAttribuer(rdv)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <People size={13} color="white" variant="Bold" />
                  S'attribuer ce rendez-vous
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── RDV Card — Mes RDV ────────────────────────────────────────────────────────

function RdvCardMine({
  rdv, onPrendreEnCharge, loading,
}: {
  rdv: RdvData;
  onPrendreEnCharge: (rdv: RdvData) => void;
  loading: boolean;
}) {
  const cfg  = STATUS_CFG[rdv.statut];
  const Icon = cfg.icon;
  const today = isToday(rdv.dateRdv);

  return (
    <div className={clsx(
      "bg-white rounded-2xl border transition-all",
      today ? "border-red-200 ring-1 ring-red-100" : "border-gray-100 hover:border-gray-200"
    )}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={clsx(
              "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0",
              rdv.donneur?.groupeSanguin ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"
            )}>
              {rdv.donneur?.groupeSanguin ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {rdv.donneur?.codeDonneur ?? "Donneur inconnu"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock size={11} color="#9ca3af" />
                <span className="text-xs text-gray-400">
                  {formatDate(rdv.dateRdv)} · {formatTime(rdv.dateRdv)}
                </span>
                {today && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                    Aujourd'hui
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className={clsx(
            "text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 shrink-0",
            cfg.color
          )}>
            <Icon size={10} variant="Bold" />
            {cfg.label}
          </span>
        </div>

        {rdv.note && (
          <p className="mt-2 text-xs text-gray-400 italic border-l-2 border-gray-100 pl-2">{rdv.note}</p>
        )}

        {/* "Prendre en charge → Enregistrer don" only for confirmed RDVs */}
        {rdv.statut === "confirme" && (
          <div className="mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => onPrendreEnCharge(rdv)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Drop size={13} color="white" variant="Bold" />
                  Prendre en charge → Enregistrer le don
                  <ArrowRight2 size={13} color="white" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "commune" | "mes_rdv";

export default function AppointmentsPage() {
  const { token } = useAuth();

  // File commune state
  const [communeRdvs, setCommuneRdvs] = useState<RdvData[]>([]);
  const [communeMeta, setCommuneMeta] = useState<RdvMeta>({ total: 0, perPage: 10, currentPage: 1, lastPage: 1, firstPage: 1 });
  const [communePage, setCommunePage] = useState(1);

  // Mes RDVs state
  const [mesRdvs, setMesRdvs] = useState<RdvData[]>([]);

  const [hopitalId, setHopitalId]   = useState<string | null>(null);
  const [tab, setTab]               = useState<Tab>("commune");
  const [search, setSearch]         = useState("");
  const [isLoading, setIsLoading]   = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null);

  // Donation flow
  const [flowOpen, setFlowOpen]         = useState(false);
  const [flowPrefillId, setFlowPrefillId] = useState<string | undefined>();

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const authToken = token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const loadCommune = useCallback(async (page: number) => {
    if (!authToken) return;
    try {
      const res = await getMyHospitalRdv(authToken, page);
      setCommuneRdvs(res.data);
      setCommuneMeta(res.meta);
    } catch { /* handled by empty state */ }
  }, [authToken]);

  const loadMes = useCallback(async () => {
    if (!authToken) return;
    try {
      const mine = await getMyAssignedRdv(authToken);
      setMesRdvs(mine);
    } catch { /* handled by empty state */ }
  }, [authToken]);

  const loadAll = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const profile = await getMyMemberProfile(authToken);
      setHopitalId(profile.hopitalId);
      await Promise.all([loadCommune(communePage), loadMes()]);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, communePage, loadCommune, loadMes]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Page change in commune tab
  const handlePageChange = async (p: number) => {
    setCommunePage(p);
    if (!authToken) return;
    setIsLoading(true);
    try { await loadCommune(p); } finally { setIsLoading(false); }
  };

  // S'attribuer un RDV
  const handleSAttribuer = async (rdv: RdvData) => {
    if (!authToken) return;
    setActionLoading(rdv.id);
    try {
      await sAttribuerRdv(rdv.id, authToken);
      showToast("RDV attribué — visible dans « Mes RDV »");
      await Promise.all([loadCommune(communePage), loadMes()]);
    } catch (e: any) {
      showToast(e?.message ?? "Erreur", false);
    } finally {
      setActionLoading(null);
    }
  };

  // Prendre en charge (mes RDV confirmés → enregistrer don)
  const handlePrendreEnCharge = async (rdv: RdvData) => {
    if (!authToken) return;
    setActionLoading(rdv.id);
    try {
      await marquerRdvEffectue(rdv.id, authToken);
      setFlowPrefillId(rdv.donneurId);
      setFlowOpen(true);
      await loadMes();
    } catch (e: any) {
      showToast(e?.message ?? "Erreur", false);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered lists
  const communeFiltered = search
    ? communeRdvs.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.donneur?.codeDonneur?.toLowerCase().includes(q) ||
          r.donneur?.groupeSanguin?.toLowerCase().includes(q)
        );
      })
    : communeRdvs;

  const mesFiltered = search
    ? mesRdvs.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.donneur?.codeDonneur?.toLowerCase().includes(q) ||
          r.donneur?.groupeSanguin?.toLowerCase().includes(q)
        );
      })
    : mesRdvs;

  // KPIs
  const todayCount  = [...communeRdvs, ...mesRdvs].filter((r) => isToday(r.dateRdv)).length;
  const futureCount = communeRdvs.filter((r) => isFuture(r.dateRdv)).length;

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1>
        <p className="text-sm text-gray-500 mt-1">
          File commune des RDV non attribués · Attribuez-vous un RDV pour le prendre en charge
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "File commune",  value: communeMeta.total, color: "text-amber-600",  bg: "bg-amber-50"  },
          { label: "Aujourd'hui",   value: todayCount,        color: "text-red-600",    bg: "bg-red-50"    },
          { label: "À venir",       value: futureCount,       color: "text-blue-600",   bg: "bg-blue-50"   },
          { label: "Mes RDV",       value: mesRdvs.length,   color: "text-green-600",  bg: "bg-green-50"  },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className={clsx("text-2xl font-black", k.color)}>
              {isLoading ? "…" : k.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {([
            { key: "commune" as Tab, label: "File commune", count: communeMeta.total },
            { key: "mes_rdv" as Tab, label: "Mes RDV",      count: mesRdvs.length },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                tab === t.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t.label}
              <span className={clsx(
                "text-xs px-1.5 py-0.5 rounded-full font-bold",
                tab === t.key ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <SearchNormal1 size={15} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Code donneur, groupe…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 w-64"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : tab === "commune" ? (
        <>
          {communeFiltered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar size={22} color="#9ca3af" />
              </div>
              <p className="text-sm font-semibold text-gray-400">Aucun rendez-vous en attente</p>
              <p className="text-xs text-gray-300 mt-1">
                {search ? "Aucun résultat pour cette recherche" : "Les donneurs planifient leurs RDV depuis leur espace"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {communeFiltered.map((rdv) => (
                <RdvCardCommune
                  key={rdv.id}
                  rdv={rdv}
                  onSAttribuer={handleSAttribuer}
                  loading={actionLoading === rdv.id}
                />
              ))}
            </div>
          )}
          {!search && <Pagination meta={communeMeta} onChange={handlePageChange} />}
        </>
      ) : (
        mesFiltered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <People size={22} color="#16a34a" />
            </div>
            <p className="text-sm font-semibold text-gray-400">Aucun RDV attribué</p>
            <p className="text-xs text-gray-300 mt-1">
              {search ? "Aucun résultat" : "Attribuez-vous des RDV depuis la file commune"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {mesFiltered.map((rdv) => (
              <RdvCardMine
                key={rdv.id}
                rdv={rdv}
                onPrendreEnCharge={handlePrendreEnCharge}
                loading={actionLoading === rdv.id}
              />
            ))}
          </div>
        )
      )}

      {/* Donation flow — triggered from "Mes RDV" confirmed appointments */}
      {authToken && (
        <DonationFlow
          open={flowOpen}
          token={authToken}
          hopitalId={hopitalId}
          prefillDonneurId={flowPrefillId}
          onClose={() => { setFlowOpen(false); setFlowPrefillId(undefined); }}
          onDone={() => {
            setFlowOpen(false);
            setFlowPrefillId(undefined);
            showToast("Don enregistré — en attente de validation");
            loadMes();
          }}
        />
      )}
    </div>
  );
}
