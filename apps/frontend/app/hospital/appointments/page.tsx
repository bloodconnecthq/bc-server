import { AppointmentsCalendar } from "@/components/appointments/appointments-calendar";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { AppointmentsStats } from "@/components/appointments/appointments-stats";

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
  const today = appointments.filter((a) => a.date === "2026-04-28").length;
  const planifie = appointments.filter((a) => a.status === "planifie").length;
  const confirme = appointments.filter((a) => a.status === "confirme").length;
  const nonAssigne = appointments.filter(
    (a) => !a.assignedTo && a.status !== "annule"
  ).length;

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

      <AppointmentsCalendar appointments={appointments} />

      <AppointmentsList appointments={appointments} members={members} />
    </div>
  );
}