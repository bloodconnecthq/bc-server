"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Add, TickCircle, Warning2 } from "iconsax-reactjs";
import { DonationsStats } from "@/components/hospital/donations/stats";
import { DonationsTable } from "@/components/hospital/donations/table";
import { DonationFlow } from "@/components/hospital/donations/donation-flow";
import { useAuth } from "@/app/providers/auth-provider";
import {
  getMyHospitalDonations,
  validerDon,
  rejeterDon,
  getMyMemberProfile,
  type DonationData,
} from "@/lib/api/hospitalApi";

function mapDonation(don: DonationData) {
  return {
    id:          `DON-${don.id.slice(0, 8).toUpperCase()}`,
    apiId:       don.id,
    donorName:   don.donneur?.codeDonneur ?? "Donneur inconnu",
    donorId:     don.donneur?.codeDonneur ?? don.donneurId ?? "—",
    bloodGroup:  don.donneur?.groupeSanguin ?? "?",
    volume:      don.volume ?? 450,
    date:        don.dateDon ?? don.creeLe ?? new Date().toISOString(),
    agent:       don.agent?.nomComplet ?? "Agent",
    center:      don.hopital?.nom ?? "—",
    status:      (don.statut === "valide"
                    ? "validated"
                    : don.statut === "en_attente"
                      ? "pending"
                      : "rejected") as "validated" | "pending" | "rejected",
    tests:       { hiv: false, hepatiteB: false, hepatiteC: false, syphilis: false },
  };
}

export default function DonationsPage() {
  const { token } = useAuth();
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [hopitalId, setHopitalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFlow, setShowFlow]   = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [profile, data] = await Promise.all([
        getMyMemberProfile(token),
        getMyHospitalDonations(token),
      ]);
      setHopitalId(profile.hopitalId);
      setDonations(data);
    } catch {
      /* errors surfaced in loading state */
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleValider = async (apiId: string) => {
    if (!token) return;
    try {
      await validerDon(apiId, token);
      showToast("Don validé avec succès");
      await load();
    } catch (e: any) {
      showToast(e?.message ?? "Erreur lors de la validation", false);
      throw e;
    }
  };

  const handleRejeter = async (apiId: string) => {
    if (!token) return;
    try {
      await rejeterDon(apiId, token);
      showToast("Don rejeté");
      await load();
    } catch (e: any) {
      showToast(e?.message ?? "Erreur lors du rejet", false);
      throw e;
    }
  };

  const mapped   = donations.map(mapDonation);
  const validated = mapped.filter((d) => d.status === "validated").length;
  const pending   = mapped.filter((d) => d.status === "pending").length;
  const rejected  = mapped.filter((d) => d.status === "rejected").length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={clsx(
          "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border",
          toast.ok
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          {toast.ok
            ? <TickCircle size={16} variant="Bold" color="#16a34a" />
            : <Warning2 size={16} variant="Bold" color="#dc2626" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dons enregistrés</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi et validation des dons de sang
          </p>
        </div>
        <button
          onClick={() => setShowFlow(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
        >
          <Add size={16} color="white" />
          Enregistrer un don
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Chargement des dons...</p>
          </div>
        </div>
      ) : (
        <>
          <DonationsStats
            total={mapped.length}
            validated={validated}
            pending={pending}
            rejected={rejected}
          />
          <DonationsTable
            donations={mapped}
            onValider={handleValider}
            onRejeter={handleRejeter}
          />
        </>
      )}

      {token && (
        <DonationFlow
          open={showFlow}
          token={token}
          hopitalId={hopitalId}
          onClose={() => setShowFlow(false)}
          onDone={() => {
            setShowFlow(false);
            showToast("Don enregistré — en attente de validation");
            load();
          }}
        />
      )}
    </div>
  );
}
