"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, TickCircle, CloseCircle } from "iconsax-reactjs";
import { useAuth } from "@/app/providers/auth-provider";
import { MemberRequests, type MemberRequest } from "@/components/console/members/requests";
import {
  getDemandesAcces,
  approuverDemande,
  rejeterDemande,
} from "@/lib/api/consoleApi";

function mapStatut(statut: string): MemberRequest["status"] {
  if (statut === "approuvee") return "approved";
  if (statut === "rejetee")   return "rejected";
  return "pending";
}

export default function MembersPage() {
  const { token } = useAuth();
  const authToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const [requests, setRequests]   = useState<MemberRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const data = await getDemandesAcces(authToken);
      setRequests(
        data.map((d) => ({
          id:          d.id,
          name:        d.nomDemandeur,
          email:       d.emailDemandeur,
          role:        d.roleDemande,
          hospital:    d.hopital?.nom ?? "Sans établissement",
          hospitalId:  d.hopital?.id ?? null,
          requestedAt: d.createdAt ?? new Date().toISOString(),
          status:      mapStatut(d.statut),
          message:     d.message ?? "",
        }))
      );
    } catch {
      showToast("Erreur de chargement", false);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string) => {
    if (!authToken) return;
    await approuverDemande(id, authToken);
    showToast("Accès approuvé — l'utilisateur a été notifié");
    await load();
  };

  const handleReject = async (id: string) => {
    if (!authToken) return;
    await rejeterDemande(id, authToken);
    showToast("Demande rejetée");
    await load();
  };

  const pending  = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const kpis = [
    { label: "En attente", value: pending,  bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200",  icon: Clock,        iconColor: "#d97706" },
    { label: "Approuvées", value: approved, bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200",  icon: TickCircle,   iconColor: "#16a34a" },
    { label: "Rejetées",   value: rejected, bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200",    icon: CloseCircle,  iconColor: "#dc2626" },
  ];

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border ${
          toast.ok
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {toast.ok
            ? <TickCircle size={16} variant="Bold" color="#16a34a" />
            : <CloseCircle size={16} variant="Bold" color="#dc2626" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demandes d'accès</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isLoading
            ? "Chargement…"
            : `${pending} demande${pending > 1 ? "s" : ""} en attente de validation`}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border}`}>
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} color={s.iconColor} variant="Bold" />
              </div>
              <p className={`text-2xl font-black ${s.text}`}>
                {isLoading ? "…" : s.value}
              </p>
              <p className="text-xs font-medium text-gray-700 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* List */}
      <MemberRequests
        requests={requests}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
