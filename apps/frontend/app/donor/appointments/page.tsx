import { DonorAppointments } from "@/components/donor/donor-appointments";

const myAppointments = [
  {
    id: "RDV-001",
    center: "CNTS Cotonou",
    centerAddress: "Avenue Jean-Paul II, Cotonou",
    date: "2026-04-28",
    time: "09:00",
    status: "confirme" as const,
    assignedTo: "Inf. Tossou",
    bloodGroup: "O+",
  },
  {
    id: "RDV-004",
    center: "CHU de Cotonou",
    centerAddress: "BP 386, Cotonou",
    date: "2026-05-15",
    time: "10:30",
    status: "planifie" as const,
    assignedTo: null,
    bloodGroup: "O+",
  },
];

const centers = [
  {
    id: "h1",
    name: "CNTS Cotonou",
    address: "Avenue Jean-Paul II, Cotonou",
    commune: "Cotonou",
    availableSlots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
  },
  {
    id: "h2",
    name: "CHU de Cotonou",
    address: "BP 386, Cotonou",
    commune: "Cotonou",
    availableSlots: ["09:00", "10:30", "11:00", "14:30"],
  },
  {
    id: "h3",
    name: "Antenne CNTS Parakou",
    address: "Avenue du Stade, Parakou",
    commune: "Parakou",
    availableSlots: ["08:30", "10:00", "14:00"],
  },
];

export default function DonorAppointmentsPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
        <p className="text-sm text-gray-500 mt-1">
          Planifiez et gérez vos dons de sang
        </p>
      </div>
      <DonorAppointments
        appointments={myAppointments}
        centers={centers}
      />
    </div>
  );
}