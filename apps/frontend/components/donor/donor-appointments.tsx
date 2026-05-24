"use client";

import { useState } from "react";
import { Button, Chip } from "@heroui/react";
import clsx from "clsx";
import { cancelAppointment } from "@/lib/api/appointmentApi";

type AppointmentStatus = "planifie" | "confirme" | "annule" | "effectue";

interface Appointment {
  id: string;
  center: string;
  centerAddress: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  assignedTo: string | null;
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: "warning" | "success" | "accent" | "default" }
> = {
  planifie: { label: "Planifié", color: "warning" },
  confirme: { label: "Confirmé", color: "success" },
  annule: { label: "Annulé", color: "accent" },
  effectue: { label: "Effectué", color: "default" },
};

export function DonorAppointments({
  appointments,
  token,
  onRefresh,
}: {
  appointments: Appointment[];
  token: string | null;
  onRefresh: () => void;
}) {
  const [items, setItems] = useState(appointments);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!token) return;
    setCancellingId(id);
    setError(null);
    try {
      await cancelAppointment(id, token);
      setItems((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "annule" as AppointmentStatus } : a
        )
      );
      onRefresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'annulation"
      );
      setTimeout(() => setError(null), 4000);
    } finally {
      setCancellingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="text-4xl mb-3">📅</p>
        <p className="text-sm font-medium text-gray-500">
          Aucun rendez-vous pour le moment
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Cliquez sur « Prendre un RDV » pour planifier votre prochain don
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Tous les rendez-vous — {items.length}
      </h3>

      {items.map((appt) => {
        const cfg = statusConfig[appt.status];
        return (
          <div
            key={appt.id}
            className={clsx(
              "bg-white rounded-2xl border p-5 transition-all",
              appt.status === "annule"
                ? "border-gray-100 opacity-60"
                : "border-gray-100 hover:border-gray-200"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                  🏥
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">
                      {appt.center}
                    </p>
                    <Chip size="sm" color={cfg.color}>
                      {cfg.label}
                    </Chip>
                  </div>
                  {appt.centerAddress && (
                    <p className="text-xs text-gray-400">{appt.centerAddress}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {new Date(appt.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })}{" "}
                    · {appt.time}
                  </p>
                  {appt.assignedTo && (
                    <p className="text-xs text-green-600 mt-0.5">
                      Agent assigné : {appt.assignedTo}
                    </p>
                  )}
                </div>
              </div>

              {appt.status === "planifie" && (
                <Button
                  size="sm"
                  variant="danger"
                  isDisabled={cancellingId === appt.id}
                  onPress={() => handleCancel(appt.id)}
                  className="rounded-xl text-xs shrink-0"
                >
                  {cancellingId === appt.id ? "..." : "Annuler"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
