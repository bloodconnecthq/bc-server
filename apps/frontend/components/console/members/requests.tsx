"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  TickCircle, CloseCircle, Clock, Building, SearchNormal1,
  People, ArrowRight2,
} from "iconsax-reactjs";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface MemberRequest {
  id: string;
  name: string;
  email: string;
  role: string;
  hospital: string;
  hospitalId: string | null;
  requestedAt: string;
  status: RequestStatus;
  message: string;
}

interface Props {
  requests: MemberRequest[];
  isLoading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const STATUS_CFG = {
  pending:  { label: "En attente", color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock       },
  approved: { label: "Approuvée",  color: "bg-green-50 text-green-700 border-green-200",   icon: TickCircle  },
  rejected: { label: "Rejetée",    color: "bg-red-50 text-red-600 border-red-200",         icon: CloseCircle },
} as const;

const ROLE_LABELS: Record<string, string> = {
  medecin:      "Médecin",
  infirmier:    "Infirmier(e)",
  admin_hopital:"Administrateur hôpital",
  super_admin:  "Super Admin",
};

const filters = ["Toutes", "En attente", "Approuvées", "Rejetées"] as const;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Hier";
  if (diffD < 7) return `Il y a ${diffD} jours`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((n) => n[0]).join("").toUpperCase();
}

export function MemberRequests({ requests, isLoading, onApprove, onReject }: Props) {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>("Toutes");
  const [search, setSearch]             = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const filtered = requests.filter((r) => {
    const matchFilter =
      activeFilter === "Toutes"      ||
      (activeFilter === "En attente" && r.status === "pending")  ||
      (activeFilter === "Approuvées" && r.status === "approved") ||
      (activeFilter === "Rejetées"   && r.status === "rejected");
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(q)     ||
      r.email.toLowerCase().includes(q)    ||
      r.hospital.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const handle = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action);
    try {
      if (action === "approve") await onApprove(id);
      else await onReject(id);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filters */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeFilter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {f}
              {f === "En attente" && pendingCount > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <SearchNormal1 size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Nom, email, établissement…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-red-400 w-56"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-32 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <People size={22} color="#9ca3af" />
            </div>
            <p className="text-sm font-semibold text-gray-400">Aucune demande dans cette catégorie</p>
          </div>
        ) : (
          filtered.map((req) => {
            const cfg  = STATUS_CFG[req.status];
            const Sicon = cfg.icon;
            const isActing = actionLoading?.startsWith(req.id);

            return (
              <div
                key={req.id}
                className={clsx(
                  "bg-white rounded-2xl border p-5 transition-all",
                  req.status === "pending"
                    ? "border-amber-200 ring-1 ring-amber-50"
                    : "border-gray-100"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar initiales */}
                  <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-red-600">{getInitials(req.name)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-bold text-gray-900">{req.name}</p>
                          <span className={clsx(
                            "text-xs font-medium px-2 py-0.5 rounded-full border flex items-center gap-1",
                            cfg.color
                          )}>
                            <Sicon size={10} variant="Bold" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-gray-500">
                            {ROLE_LABELS[req.role] ?? req.role}
                          </p>
                          {req.hospital && (
                            <>
                              <span className="text-gray-300">·</span>
                              <div className="flex items-center gap-1">
                                <Building size={11} color="#9ca3af" />
                                <p className="text-xs text-gray-500">{req.hospital}</p>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{req.email}</p>
                      </div>
                      <p className="text-xs text-gray-400 shrink-0">{formatDate(req.requestedAt)}</p>
                    </div>

                    {/* Message */}
                    {req.message && (
                      <div className="bg-gray-50 rounded-xl px-4 py-3 mt-3 mb-4">
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          « {req.message} »
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handle(req.id, "approve")}
                          disabled={!!isActing}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-60"
                        >
                          {actionLoading === req.id + "approve" ? (
                            <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <TickCircle size={13} variant="Bold" />
                          )}
                          Approuver l'accès
                        </button>
                        <button
                          onClick={() => handle(req.id, "reject")}
                          disabled={!!isActing}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-60"
                        >
                          {actionLoading === req.id + "reject" ? (
                            <span className="w-3.5 h-3.5 border border-red-400/40 border-t-red-600 rounded-full animate-spin" />
                          ) : (
                            <CloseCircle size={13} variant="Bold" />
                          )}
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
