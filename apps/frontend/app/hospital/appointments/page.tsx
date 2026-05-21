'use client';

import { AppointmentsCalendar } from "@/components/appointments/appointments-calendar";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { AppointmentsStats } from "@/components/appointments/appointments-stats";
import { useAuth } from "@/app/providers/auth-provider";
import { useHospitalDashboard } from "@/lib/hooks/useHospitalDashboard";

const appointments = [
  {
    id: "RDV-001",
    donorName: "Koffi Agossou",
    donorId: "BC-2024-08412",
    bloodGroup: "O+",
    date: "2026-04-28",
    time: "09:00",
    status: "confirme" as const,
    assignedTo: "Inf. Tossou",
    assignedId: "MEM-003",
    note: "Donneur régulier, 7 dons",
  },
  {
    id: "RDV-002",
    donorName: "Mèdéssè Dossou",
    donorId: "BC-2024-07234",
    bloodGroup: "A+",
    date: "2026-04-28",
    time: "10:30",
    status: "planifie" as const,
    assignedTo: null,
    assignedId: null,
    note: "",
  },
  {
    id: "RDV-003",
    donorName: "Fèmi Hounkpè",
    donorId: "BC-2023-05891",
    bloodGroup: "B-",
    date: "2026-04-28",
    time: "11:00",
    status: "planifie" as const,
    assignedTo: null,
    assignedId: null,
    note: "Groupe rare — prioritaire",
  },
  {
    id: "RDV-004",
    donorName: "Roland Tossou",
    donorId: "BC-2024-09102",
    bloodGroup: "AB+",
    date: "2026-04-29",
    time: "09:30",
    status: "confirme" as const,
    assignedTo: "Dr. Hounkpè",
    assignedId: "MEM-001",
    note: "",
  },
  {
    id: "RDV-005",
    donorName: "Céleste Gbénou",
    donorId: "BC-2024-08899",
    bloodGroup: "B+",
    date: "2026-04-29",
    time: "14:00",
    status: "planifie" as const,
    assignedTo: null,
    assignedId: null,
    note: "",
  },
  {
    id: "RDV-006",
    donorName: "Brice Sènou",
    donorId: "BC-2023-04321",
    bloodGroup: "A-",
    date: "2026-04-30",
    time: "08:30",
    status: "confirme" as const,
    assignedTo: "Inf. Tossou",
    assignedId: "MEM-003",
    note: "Platine — 28 dons",
  },
  {
    id: "RDV-007",
    donorName: "Adjoua Kpèdé",
    donorId: "BC-2024-06543",
    bloodGroup: "O-",
    date: "2026-04-30",
    time: "10:00",
    status: "annule" as const,
    assignedTo: null,
    assignedId: null,
    note: "Annulé par le donneur",
  },
  {
    id: "RDV-008",
    donorName: "Aminatou Chabi",
    donorId: "BC-2024-05432",
    bloodGroup: "AB-",
    date: "2026-05-02",
    time: "09:00",
    status: "planifie" as const,
    assignedTo: null,
    assignedId: null,
    note: "Groupe très rare",
  },
];

const members = [
  { id: "MEM-001", name: "Dr. Hounkpè", role: "medecin" as const },
  { id: "MEM-002", name: "Dr. Ahounou", role: "medecin" as const },
  { id: "MEM-003", name: "Inf. Tossou", role: "infirmier" as const },
  { id: "MEM-004", name: "Inf. Amoussou", role: "infirmier" as const },
];

export default function AppointmentsPage() {
  const { appointments: apiAppointments, isLoading: loading, appointmentsError } = useHospitalDashboard();

  // Convertir les données API au format attendu par les composants
  const appointmentsData = apiAppointments?.map(appointment => ({
    id: `RDV-${appointment.id}`,
    donorName: appointment.donneur?.nomComplet || "Anonyme",
    donorId: appointment.donneur?.numeroDonneur || `BC-${appointment.id}`,
    bloodGroup: appointment.donneur?.groupeSanguin || "Non défini",
    date: appointment.dateRdv,
    time: appointment.heureRdv,
    status: appointment.statut === 'planifie' ? "planifie" as const :
      appointment.statut === 'confirme' ? "confirme" as const :
        appointment.statut === 'annule' ? "annule" as const :
          appointment.statut === 'effectue' ? "effectue" as const : "planifie" as const,
    assignedTo: appointment.agent?.nomComplet || null,
    assignedId: appointment.agent?.id || null,
    note: appointment.notes || "",
  })) || [];

  const members = [
    { id: "MEM-001", name: "Dr. Hounkpè", role: "medecin" as const },
    { id: "MEM-002", name: "Dr. Ahounou", role: "medecin" as const },
    { id: "MEM-003", name: "Inf. Tossou", role: "infirmier" as const },
    { id: "MEM-004", name: "Inf. Amoussou", role: "infirmier" as const },
  ];

  const today = appointmentsData.filter((a) => a.date === new Date().toISOString().split('T')[0]).length;
  const planifie = appointmentsData.filter((a) => a.status === "planifie").length;
  const confirme = appointmentsData.filter((a) => a.status === "confirme").length;
  const nonAssigne = appointmentsData.filter(
    (a) => !a.assignedTo && a.status !== "annule"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  if (appointmentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement des rendez-vous</p>
          <p className="text-sm text-gray-500 mt-2">{appointmentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rendez-vous
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestion des rendez-vous de don — CNTS Cotonou
          </p>
        </div>
      </div>

      <AppointmentsStats
        today={today}
        planifie={planifie}
        confirme={confirme}
        nonAssigne={nonAssigne}
      />

      <AppointmentsCalendar appointments={appointmentsData} />

      <AppointmentsList appointments={appointmentsData} members={members} />
    </div>
  );
}