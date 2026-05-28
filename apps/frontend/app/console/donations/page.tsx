"use client";

import { useState, useEffect, useCallback } from "react";
import { Drop, DocumentDownload } from "iconsax-reactjs";
import { ConsoleDonationsList } from "@/components/console/donations/list";
import { ConsoleDonationsStats } from "@/components/console/donations/stats";
import { getDons, getDonStats, validerDon, rejeterDon, type DonAPI, type DonStatsAPI } from "@/lib/api/consoleApi";
import { useAuth } from "@/app/providers/auth-provider";

function exportCSV(dons: DonAPI[]) {
  const headers = ["ID", "Donneur", "Code donneur", "Groupe sanguin", "Volume (ml)", "Type poche", "Centre", "Commune", "Agent", "Date don", "Statut", "Expiration"];
  const rows = dons.map((d) => [
    d.id,
    d.nomDonneur ?? "",
    d.donneur?.codeDonneur ?? "",
    d.donneur?.groupeSanguin ?? "",
    d.volume ?? "",
    d.typePoche ?? "",
    d.hopital?.nom ?? "",
    d.hopital?.commune ?? "",
    d.agent?.nomComplet ?? "",
    d.dateDon ? new Date(d.dateDon).toLocaleString("fr-FR") : "",
    d.statut,
    d.dateExpiration ? new Date(d.dateExpiration).toLocaleDateString("fr-FR") : "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dons-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ConsoleDonationsPage() {
  const { token } = useAuth();
  const [dons, setDons] = useState<DonAPI[]>([]);
  const [stats, setStats] = useState<DonStatsAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [d, s] = await Promise.all([getDons(token), getDonStats(token)]);
      setDons(d);
      setStats(s);
    } catch {
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleValidate = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await validerDon(id, token);
      showToast("Don validé avec succès");
      await load();
    } catch (e: any) {
      showToast(e.message || "Erreur lors de la validation", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      await rejeterDon(id, token);
      showToast("Don rejeté");
      await load();
    } catch (e: any) {
      showToast(e.message || "Erreur lors du rejet", "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg transition-all ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
            <Drop size={20} color="#dc2626" variant="Bold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Poches de sang</h1>
            <p className="text-sm text-gray-500 mt-0.5">Suivi national de tous les dons collectés</p>
          </div>
        </div>
        <button
          onClick={() => exportCSV(dons)}
          disabled={dons.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <DocumentDownload size={16} />
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <ConsoleDonationsStats
        total={stats?.total ?? 0}
        valides={stats?.valides ?? 0}
        enAttente={stats?.enAttente ?? 0}
        rejetes={stats?.rejetes ?? 0}
        tauxValidation={stats?.tauxValidation ?? 0}
        loading={loading}
      />

      {/* List */}
      <ConsoleDonationsList
        dons={dons}
        loading={loading}
        onValidate={handleValidate}
        onReject={handleReject}
        actionId={actionId}
      />
    </div>
  );
}
