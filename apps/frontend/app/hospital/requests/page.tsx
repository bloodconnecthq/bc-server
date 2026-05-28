"use client";

import { useEffect, useState, useCallback } from "react";
import { Add } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getBonsDemande, getBonsDemandeRecus, createBonDemande,
  satisfaireBonDemande, nonSatisfaireBonDemande, declinerBonDemande,
  updateBonDemande, deleteBonDemande, getMyMemberProfile,
  type BonDemandeData, type CreateBonDemandePayload,
} from "@/lib/api/hospitalApi";
import { CreateModal }   from "@/components/hospital/requests/create-modal";
import { TransferModal } from "@/components/hospital/requests/transfer-modal";
import { BonDrawer }     from "@/components/hospital/requests/bon-drawer";
import { BonTabs }       from "@/components/hospital/requests/bon-table";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border max-w-sm
      ${ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      {msg}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const { token, user } = useAuth();
  const [bons, setBons]           = useState<BonDemandeData[]>([]);
  const [recus, setRecus]         = useState<BonDemandeData[]>([]);
  const [hopitalId, setHopitalId] = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate]   = useState(false);
  const [transferBon, setTransferBon] = useState<BonDemandeData | null>(null);
  const [drawerBon, setDrawerBon]     = useState<BonDemandeData | null>(null);
  const [drawerMode, setDrawerMode]   = useState<"mes" | "recu">("mes");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const isMedecin = user?.role === "medecin";

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profile, mes, r] = await Promise.all([
        getMyMemberProfile(token), getBonsDemande(token), getBonsDemandeRecus(token),
      ]);
      setHopitalId(profile.hopitalId);
      setBons(mes); setRecus(r);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openDrawer = (bon: BonDemandeData, mode: "mes" | "recu") => {
    setDrawerBon(bon); setDrawerMode(mode); setDrawerOpen(true);
  };

  const handleCreate = async (data: Omit<CreateBonDemandePayload, "hopitalId">) => {
    if (!token || !hopitalId) throw new Error("Hôpital non identifié");
    await createBonDemande({ ...data, hopitalId }, token);
    notify("Bon créé — stock vérifié automatiquement");
    await load();
  };

  const handleAction = async (id: string, key: "sat" | "nsat" | "dec") => {
    if (!token) return;
    setActionLoading(id + key);
    try {
      if (key === "sat") { await satisfaireBonDemande(id, token); notify(drawerMode === "recu" ? "Bon accepté et satisfait" : "Bon satisfait depuis le stock"); }
      else if (key === "nsat") { await nonSatisfaireBonDemande(id, token); notify("Bon marqué non satisfait"); }
      else { await declinerBonDemande(id, token); notify("Transfert décliné — bon remis en attente à l'hôpital d'origine"); }
      setDrawerOpen(false);
      await load();
    } catch (e: any) {
      notify(e?.message ?? "Erreur", false);
    } finally { setActionLoading(null); }
  };

  const handleUpdate = async (id: string, data: Parameters<typeof updateBonDemande>[1]) => {
    if (!token) return;
    await updateBonDemande(id, data, token);
    notify("Bon modifié");
    await load();
    // Refresh drawer bon
    setDrawerBon((prev) => prev ? { ...prev, ...data } : prev);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteBonDemande(id, token);
    notify("Bon supprimé");
    setDrawerOpen(false);
    await load();
  };

  const handleTransferDone = async () => {
    setTransferBon(null);
    setDrawerOpen(false);
    notify("Bon transféré — l'établissement destinataire a été notifié");
    await load();
  };

  const pendingRecus = recus.filter((b) => b.statut === "en_attente").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Bons de demande</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gestion des demandes de sang · interconnexion inter-hôpitaux</p>
        </div>
        {isMedecin && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
            <Add size={16} color="white" />
            Nouveau bon
          </button>
        )}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Mes demandes",       value: bons.length,    color: "text-gray-900" },
          { label: "Demandes reçues",    value: recus.length,   color: "text-blue-600" },
          { label: "Reçues en attente",  value: pendingRecus,   color: pendingRecus > 0 ? "text-amber-700" : "text-gray-900", bg: pendingRecus > 0 ? "border-amber-200 bg-amber-50" : "" },
        ].map((k) => (
          <div key={k.label} className={`bg-white rounded-2xl border border-gray-100 p-5 ${k.bg ?? ""}`}>
            <p className={`text-2xl font-black ${k.color}`}>{loading ? "…" : k.value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <BonTabs bons={bons} recus={recus} loading={loading} onSelectBon={openDrawer} pendingRecus={pendingRecus} />

      {/* Modals / Drawer */}
      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={handleCreate} />

      {transferBon && token && (
        <TransferModal bon={transferBon} token={token} onClose={() => setTransferBon(null)} onDone={handleTransferDone} />
      )}

      <BonDrawer
        bon={drawerBon}
        isOpen={drawerOpen}
        mode={drawerMode}
        actionLoading={actionLoading}
        onClose={() => { setDrawerOpen(false); setDrawerBon(null); }}
        onSatisfaire={(id) => handleAction(id, "sat")}
        onNonSatisfaire={(id) => handleAction(id, "nsat")}
        onTransferer={(bon) => { setTransferBon(bon); setDrawerOpen(false); }}
        onDecliner={(id) => handleAction(id, "dec")}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
