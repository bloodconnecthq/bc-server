"use client";

import { useState } from "react";
import { Button, Alert } from "@heroui/react";
import { DonorAppointments } from "@/components/donor/donor-appointments";
import { AppointmentModal } from "@/components/donor/appointment-modal";
import { AppointmentStats } from "@/components/donor/appointment-stats";
import { useAuth } from "../../providers/auth-provider";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useCenters } from "@/lib/hooks/useCenters";

export default function DonorAppointmentsPage() {
  const { token, isLoading: authLoading } = useAuth();
  const { appointments, isLoading, error, refetch } = useAppointments(token);
  const { centers, isLoading: centersLoading } = useCenters();

  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  if (authLoading || isLoading || centersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement des rendez-vous...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  const planifie = appointments.filter((a) => a.statut === "planifie").length;
  const confirme = appointments.filter((a) => a.statut === "confirme").length;
  const effectue = appointments.filter((a) => a.statut === "effectue").length;

  const transformedAppointments = appointments.map((apt) => ({
    id: apt.id,
    center: apt.hopital?.nom || "Centre inconnu",
    centerAddress: apt.hopital?.adresse || "",
    date: new Date(apt.dateRdv).toISOString().split("T")[0],
    time: new Date(apt.dateRdv).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: apt.statut as "confirme" | "planifie" | "annule" | "effectue",
    assignedTo: apt.membre?.nomComplet || null,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
          <p className="text-sm text-gray-500 mt-1">Planifiez et gérez vos dons de sang</p>
        </div>
        <Button
          onPress={() => setModalOpen(true)}
          className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold px-5"
        >
          + Prendre un RDV
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <Alert status={feedback.type === "success" ? "success" : "danger"}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{feedback.msg}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}

      {/* Stats */}
      <AppointmentStats planifie={planifie} confirme={confirme} effectue={effectue} />

      {/* Liste */}
      <DonorAppointments
        appointments={transformedAppointments}
        token={token}
        onRefresh={refetch}
      />

      {/* Modal création RDV */}
      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        centers={centers}
        token={token}
        onSuccess={(msg) => { refetch(); showFeedback("success", msg); }}
        onError={(msg) => showFeedback("error", msg)}
      />
    </div>
  );
}
