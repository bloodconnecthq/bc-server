"use client";

import { useState } from "react";
import { Button, Chip, Alert } from "@heroui/react";
import clsx from "clsx";

type RequestStatus = "pending" | "approved" | "rejected";

interface MemberRequest {
    id: string;
    name: string;
    email: string;
    role: string;
    hospital: string;
    hospitalId: string;
    requestedAt: string;
    status: RequestStatus;
    message: string;
}

const filters = ["Toutes", "En attente", "Approuvées", "Rejetées"];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .slice(-2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export function MemberRequests({ requests }: { requests: MemberRequest[] }) {
    const [items, setItems] = useState(requests);
    const [activeFilter, setActiveFilter] = useState("Toutes");
    const [lastAction, setLastAction] = useState<{
        id: string;
        type: "approved" | "rejected";
    } | null>(null);

    const pendingCount = items.filter((r) => r.status === "pending").length;

    const filtered = items.filter((r) => {
        if (activeFilter === "Toutes") return true;
        if (activeFilter === "En attente") return r.status === "pending";
        if (activeFilter === "Approuvées") return r.status === "approved";
        if (activeFilter === "Rejetées") return r.status === "rejected";
        return true;
    });

    const handleApprove = (id: string) => {
        setItems((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
        );
        setLastAction({ id, type: "approved" });
        setTimeout(() => setLastAction(null), 3000);
    };

    const handleReject = (id: string) => {
        setItems((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
        );
        setLastAction({ id, type: "rejected" });
        setTimeout(() => setLastAction(null), 3000);
    };

    return (
        <div className="space-y-4">
            
            {lastAction && (
                <Alert
                    color={lastAction.type === "approved" ? "success" : "danger"}
                    title={
                        lastAction.type === "approved"
                            ? "Accès approuvé — L'utilisateur recevra une notification par email."
                            : "Demande rejetée — L'utilisateur a été informé du refus."
                    }
                />
            )}

            
            <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                    <Button
                        key={f}
                        size="sm"
                        variant={activeFilter === f ? "primary" : "outline"}
                        onPress={() => setActiveFilter(f)}
                        className={clsx(
                            "rounded-full text-xs",
                            activeFilter === f && "bg-red-600 border-red-600 text-white"
                        )}
                    >
                        {f}
                        {f === "En attente" && pendingCount > 0 && (
                            <span className="ml-1.5 w-4 h-4 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {pendingCount}
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <p className="text-sm text-gray-400">
                            Aucune demande dans cette catégorie
                        </p>
                    </div>
                )}

                {filtered.map((req) => (
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
                            
                            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-red-600">
                                    {getInitials(req.name)}
                                </span>
                            </div>

                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <p className="text-sm font-bold text-gray-900">
                                                {req.name}
                                            </p>
                                            <Chip
                                                size="sm"
                                                color={
                                                    req.status === "pending"
                                                        ? "warning"
                                                        : req.status === "approved"
                                                            ? "success"
                                                            : "danger"
                                                }
                                            >
                                                {req.status === "pending"
                                                    ? "En attente"
                                                    : req.status === "approved"
                                                        ? "Approuvé"
                                                        : "Rejeté"}
                                            </Chip>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {req.role} · {req.hospital}
                                        </p>
                                        <p className="text-xs text-gray-400">{req.email}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 shrink-0">
                                        {formatDate(req.requestedAt)}
                                    </p>
                                </div>

                                
                                <div className="bg-gray-50 rounded-xl px-4 py-3 mt-3 mb-4">
                                    <p className="text-xs text-gray-600 leading-relaxed italic">
                                        « {req.message} »
                                    </p>
                                </div>

                                
                                {req.status === "pending" && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onPress={() => handleApprove(req.id)}
                                            className="rounded-xl text-xs font-semibold bg-green-600 text-white hover:bg-green-700"
                                        >
                                            ✓ Approuver l'accès
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onPress={() => handleReject(req.id)}
                                            className="rounded-xl text-xs font-semibold"
                                        >
                                            ✕ Rejeter
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-xl text-xs font-semibold text-gray-600 ml-auto"
                                        >
                                            Voir l'établissement →
                                        </Button>
                                    </div>
                                )}

                                
                                {req.status !== "pending" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="rounded-xl text-xs font-semibold text-gray-500"
                                        onPress={() =>
                                            setItems((prev) =>
                                                prev.map((r) =>
                                                    r.id === req.id ? { ...r, status: "pending" } : r
                                                )
                                            )
                                        }
                                    >
                                        ↩ Remettre en attente
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}