"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospital, getMyHospitalStocks, getMyHospitalDonations,
  type HospitalData, type StockData, type DonationData,
} from "@/lib/api/hospitalApi";
import { StockCard } from "@/components/hospital/stock-card";
import { StatsOverview, type StatItem } from "@/components/hospital/stats-overview";
import { RecentDonations } from "@/components/hospital/recent-donations";
import { AlertsBanner } from "@/components/hospital/alerts-banner";
import { Drop, People, Warning2, TickCircle } from "iconsax-reactjs";
import Link from "next/link";

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeStatus(quantite: number, seuilFaible: number, seuilCritique: number): "ok" | "low" | "critical" {
  if (quantite <= seuilCritique) return "critical";
  if (quantite <= seuilFaible) return "low";
  return "ok";
}

function computeLevel(quantite: number, seuilFaible: number): number {
  const max = Math.max(seuilFaible * 3, 1);
  return Math.min(100, Math.round((quantite / max) * 100));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Aujourd'hui, ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Hier, ${time}`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) + `, ${time}`;
}

function mapStatut(statut: string): "validated" | "pending" | "rejected" {
  if (statut === "valide") return "validated";
  if (statut === "rejete") return "rejected";
  return "pending";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HospitalDashboard() {
  const { token } = useAuth();
  const [hopital, setHopital]     = useState<HospitalData | null>(null);
  const [stocks, setStocks]       = useState<StockData[]>([]);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    const authToken = token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
    if (!authToken) return;
    setLoading(true);
    setError(null);
    try {
      const [h, s, d] = await Promise.all([
        getMyHospital(authToken),
        getMyHospitalStocks(authToken),
        getMyHospitalDonations(authToken),
      ]);
      setHopital(h);
      setStocks(s);
      setDonations(d);
    } catch (err) {
      setError("Impossible de charger les données du tableau de bord.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // ── Computed stocks ──────────────────────────────────────────────────────────
  const ORDER = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const bloodStocks = [...stocks]
    .sort((a, b) => ORDER.indexOf(a.groupeSanguin ?? "") - ORDER.indexOf(b.groupeSanguin ?? ""))
    .map((s) => ({
      group:  s.groupeSanguin ?? "?",
      units:  s.quantite,
      level:  computeLevel(s.quantite, s.seuilFaible || 15),
      status: computeStatus(s.quantite, s.seuilFaible || 15, s.seuilCritique || 5),
    }));

  const criticalAlerts = bloodStocks
    .filter((s) => s.status === "critical")
    .map((s) => ({
      group:   s.group,
      message: `Stock critique — ${s.units} poche${s.units !== 1 ? "s" : ""} restante${s.units !== 1 ? "s" : ""}`,
    }));

  // ── Computed stats ───────────────────────────────────────────────────────────
  const now = new Date();
  const donsThisMonth = donations.filter((d) => {
    const dt = new Date(d.creeLe ?? d.dateDon ?? "");
    return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
  });
  const totalPoches      = stocks.reduce((sum, s) => sum + s.quantite, 0);
  const criticalCount    = bloodStocks.filter((s) => s.status === "critical").length;
  const enAttenteCount   = donations.filter((d) => d.statut === "en_attente").length;

  const stats: StatItem[] = [
    {
      label:    "Dons ce mois",
      value:    String(donsThisMonth.length),
      change:   `${donations.length} au total`,
      positive: true,
      icon:     Drop,
      color:    "bg-red-50 text-red-600",
    },
    {
      label:    "Total poches",
      value:    String(totalPoches),
      change:   `${stocks.length} groupe${stocks.length !== 1 ? "s" : ""} sanguin${stocks.length !== 1 ? "s" : ""}`,
      positive: true,
      icon:     TickCircle,
      color:    "bg-green-50 text-green-600",
    },
    {
      label:    "Stocks critiques",
      value:    String(criticalCount),
      change:   criticalCount > 0 ? "Action requise" : "Tous les stocks OK",
      positive: criticalCount === 0,
      icon:     Warning2,
      color:    criticalCount > 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600",
    },
    {
      label:    "Dons en attente",
      value:    String(enAttenteCount),
      change:   enAttenteCount > 0 ? "À valider" : "Rien en attente",
      positive: enAttenteCount === 0,
      icon:     People,
      color:    "bg-blue-50 text-blue-600",
    },
  ];

  // ── Computed recent donations ─────────────────────────────────────────────────
  const recentDonations = donations.slice(0, 5).map((d) => ({
    id:     d.donneur?.codeDonneur ?? d.id.slice(0, 8).toUpperCase(),
    donor:  d.donneur?.codeDonneur ?? "—",
    group:  d.donneur?.groupeSanguin ?? "—",
    date:   formatDate(d.dateDon ?? d.creeLe),
    status: mapStatut(d.statut),
  }));

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-52 bg-gray-100 rounded-lg" />
            <div className="h-4 w-72 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-10 w-40 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        </div>
        <div className="h-72 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hopital?.nom ?? "Établissement"} — Mis à jour {formatDate(new Date().toISOString())}
          </p>
        </div>
        <Link
          href="/hospital/donations"
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          + Enregistrer un don
        </Link>
      </div>

      {/* Alertes critiques */}
      {criticalAlerts.length > 0 && <AlertsBanner alerts={criticalAlerts} />}

      {/* Stats globales */}
      <StatsOverview stats={stats} />

      {/* Stocks sanguins */}
      {bloodStocks.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Stocks sanguins par groupe
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {bloodStocks.map((stock) => (
              <StockCard key={stock.group} {...stock} />
            ))}
          </div>
        </div>
      )}

      {/* Dons récents */}
      {recentDonations.length > 0 ? (
        <RecentDonations donations={recentDonations} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-400">Aucun don enregistré pour le moment.</p>
        </div>
      )}
    </div>
  );
}
