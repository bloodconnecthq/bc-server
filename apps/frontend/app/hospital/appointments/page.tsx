"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import {
  Calendar, Clock, Drop, TickCircle, CloseCircle, Warning2,
  ArrowRight2, SearchNormal1,
} from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospitalRdv,
  getMyAssignedRdv,
  marquerRdvEffectue,
  getMyMemberProfile,
  type RdvData,
} from "@/lib/api/hospitalApi";
import { DonationFlow } from "@/components/hospital/donations/donation-flow";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG = {
  planifie: { label: "Planifié",   color: "text-blue-700 bg-blue-50 border-blue-200",   icon: Calendar   },
  confirme: { label: "Confirmé",   color: "text-green-700 bg-green-50 border-green-200", icon: TickCircle },
  annule:   { label: "Annulé",    color: "text-red-700 bg-red-50 border-red-200",       icon: CloseCircle},
  effectue: { label: "Effectué",  color: "text-gray-600 bg-gray-50 border-gray-200",    icon: TickCircle },
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

// ── RDV Card ──────────────────────────────────────────────────────────────────

interface RdvCardProps {
  rdv: RdvData;
  isAssignedToMe: boolean;
  onPrendreEnCharge: (rdv: RdvData) => void;
  actionLoading: boolean;
}

function RdvCard({ rdv, isAssignedToMe, onPrendreEnCharge, actionLoading }: RdvCardProps) {
  const cfg  = STATUS_CFG[rdv.statut];
  const Icon = cfg.icon;
  const canTakeOver = isAssignedToMe && rdv.statut === "confirme";
  const todayMark   = isToday(rdv.dateRdv);

  return (
    <div className={clsx(
      "bg-white rounded-2xl border transition-all",
      todayMark ? "border-red-200 ring-1 ring-red-100" : "border-gray-100 hover:border-gray-200"
    )}>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Blood group */}
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
                <span className="text-xs text-gray-400">{formatDate(rdv.dateRdv)} · {formatTime(rdv.dateRdv)}</span>
                {todayMark && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">Aujourd'hui</span>
                )}
              </div>
            </div>
          </div>

          {/* Status badge */}
          <span className={clsx(
            "text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 shrink-0",
            cfg.color
          )}>
            <Icon size={10} variant="Bold" />
            {cfg.label}
          </span>
        </div>

        {/* Assignment + note */}
        <div className="mt-3 space-y-2">
          {rdv.membre ? (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Drop size={10} color="#6b7280" />
              </div>
              <span>
                Attribué à{" "}
                <span className={clsx("font-semibold", isAssignedToMe ? "text-red-600" : "text-gray-700")}>
                  {isAssignedToMe ? "vous" : rdv.membre.nomComplet ?? "—"}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <Warning2 size={12} variant="Bold" />
              <span>Non attribué</span>
            </div>
          )}

          {rdv.note && (
            <p className="text-xs text-gray-400 italic border-l-2 border-gray-100 pl-2">{rdv.note}</p>
          )}
        </div>

        {/* Action — Prendre en charge */}
        {canTakeOver && (
          <div className="mt-4 pt-3 border-t border-gray-50">
            <button
              onClick={() => onPrendreEnCharge(rdv)}
              disabled={actionLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-60"
            >
              {actionLoading ? (
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

type FilterKey = "all" | "planifie" | "confirme" | "effectue" | "mes_rdv";

export default function AppointmentsPage() {
  const { token, user } = useAuth();

  const [rdvs, setRdvs]           = useState<RdvData[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [hopitalId, setHopitalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter]       = useState<FilterKey>("all");
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  // Donation flow state
  const [flowOpen, setFlowOpen]             = useState(false);
  const [flowPrefillId, setFlowPrefillId]   = useState<string | undefined>();
  const [actionLoading, setActionLoading]   = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [profile, all, assigned] = await Promise.all([
        getMyMemberProfile(token),
        getMyHospitalRdv(token),
        getMyAssignedRdv(token),
      ]);
      setHopitalId(profile.hopitalId);
      setRdvs(all);
      setAssignedIds(new Set(assigned.map((r) => r.id)));
    } catch {
      /* handled by empty state */
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // "Prendre en charge" → mark effectué + open donation flow prefilled
  const handlePrendreEnCharge = async (rdv: RdvData) => {
    if (!token) return;
    setActionLoading(rdv.id);
    try {
      await marquerRdvEffectue(rdv.id, token);
      setFlowPrefillId(rdv.donneurId);
      setFlowOpen(true);
      await load();
    } catch (e: any) {
      showToast(e?.message ?? "Erreur", false);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const today   = rdvs.filter((r) => isToday(r.dateRdv)).length;
  const upcoming = rdvs.filter((r) => isFuture(r.dateRdv) && r.statut !== "annule").length;
  const mesRdv  = rdvs.filter((r) => assignedIds.has(r.id)).length;
  const nonAssigned = rdvs.filter((r) => !r.membreId && r.statut !== "annule" && r.statut !== "effectue").length;

  // Filters
  const FILTER_TABS: { key: FilterKey; label: string; count: number }[] = [
    { key: "all",      label: "Tous",       count: rdvs.length },
    { key: "planifie", label: "Planifiés",  count: rdvs.filter((r) => r.statut === "planifie").length },
    { key: "confirme", label: "Confirmés",  count: rdvs.filter((r) => r.statut === "confirme").length },
    { key: "effectue", label: "Effectués",  count: rdvs.filter((r) => r.statut === "effectue").length },
    { key: "mes_rdv",  label: "Mes RDV",    count: mesRdv },
  ];

  const filtered = rdvs.filter((r) => {
    if (filter === "mes_rdv"  && !assignedIds.has(r.id)) return false;
    if (filter !== "all" && filter !== "mes_rdv" && r.statut !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.donneur?.codeDonneur?.toLowerCase().includes(q) ||
        r.donneur?.groupeSanguin?.toLowerCase().includes(q) ||
        r.membre?.nomComplet?.toLowerCase().includes(q) ||
        false
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border",
          toast.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>
          {toast.ok ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-gray-900">Rendez-vous</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Dons planifiés par les donneurs — prenez en charge vos RDV attribués
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Aujourd'hui",   value: today,        color: "text-red-600",   bg: "bg-red-50"    },
          { label: "À venir",       value: upcoming,     color: "text-blue-600",  bg: "bg-blue-50"   },
          { label: "Mes RDV",       value: mesRdv,       color: "text-green-600", bg: "bg-green-50"  },
          { label: "Non attribués", value: nonAssigned,  color: "text-amber-600", bg: "bg-amber-50"  },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className={clsx("text-2xl font-black", k.color)}>
              {isLoading ? "…" : k.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + search bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <SearchNormal1 size={15} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Code donneur, groupe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={clsx(
                "px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                filter === t.key
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-red-300"
              )}
            >
              {t.label}
              <span className={clsx(
                "text-xs px-1.5 py-0.5 rounded-full",
                filter === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Calendar size={22} color="#9ca3af" />
          </div>
          <p className="text-sm font-semibold text-gray-400">Aucun rendez-vous</p>
          <p className="text-xs text-gray-300 mt-1">
            {filter === "mes_rdv"
              ? "Aucun RDV ne vous a encore été attribué"
              : "Les donneurs planifient leurs RDV depuis leur espace"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((rdv) => (
            <RdvCard
              key={rdv.id}
              rdv={rdv}
              isAssignedToMe={assignedIds.has(rdv.id)}
              onPrendreEnCharge={handlePrendreEnCharge}
              actionLoading={actionLoading === rdv.id}
            />
          ))}
        </div>
      )}

      {/* Donation flow — opened via "Prendre en charge" */}
      {token && (
        <DonationFlow
          open={flowOpen}
          token={token}
          hopitalId={hopitalId}
          prefillDonneurId={flowPrefillId}
          onClose={() => { setFlowOpen(false); setFlowPrefillId(undefined); }}
          onDone={() => {
            setFlowOpen(false);
            setFlowPrefillId(undefined);
            showToast("Don enregistré — en attente de validation");
            load();
          }}
        />
      )}
    </div>
  );
}
