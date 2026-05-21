"use client"

import { DonorAppointments } from "@/components/donor/donor-appointments";
import { useAuth } from "../../providers/auth-provider";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { useCenters } from "@/lib/hooks/useCenters";

export default function DonorAppointmentsPage() {
  const { token, isLoading: authLoading } = useAuth();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } = useAppointments(token);
  const { centers, isLoading: centersLoading, error: centersError } = useCenters();

  if (authLoading || appointmentsLoading || centersLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Chargement des rendez-vous...</p>
      </div>
    );
  }

  if (appointmentsError || centersError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">
          Erreur: {appointmentsError || centersError}
        </p>
      </div>
    );
  }

  const transformedAppointments = appointments.map((apt) => ({
    id: apt.id,
    center: apt.hopital?.nom || 'Centre inconnu',
    centerAddress: apt.hopital?.adresse || '',
    date: new Date(apt.dateRdv).toISOString().split('T')[0],
    time: new Date(apt.dateRdv).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    status: apt.statut as 'confirme' | 'planifie' | 'annule' | 'effectue',
    assignedTo: apt.membre?.nomComplet || null,
    bloodGroup: 'O+',
  }));

  const transformedCenters = centers.map((center) => ({
    id: center.id,
    name: center.nom,
    address: center.adresse || '',
    commune: center.commune || '',
    availableSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'], // TODO: À obtenir du backend
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
        <p className="text-sm text-gray-500 mt-1">
          Planifiez et gérez vos dons de sang
        </p>
      </div>
      <div className="mx-auto max-w-2xl space-y-4">
        <DonorAppointments
          appointments={transformedAppointments}
          centers={transformedCenters}
        />
      </div>
    </div>
  );
}