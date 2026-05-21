/**
 * Service API pour les rendez-vous
 */

import { API_BASE_URL } from '@/config/api'

export interface AppointmentData {
  id: string
  donneurId: string
  hopitalId: string
  membreId: string | null
  dateRdv: string
  statut: 'planifie' | 'confirme' | 'annule' | 'effectue'
  note: string | null
  hopital?: {
    id: string
    nom: string
    commune: string
    adresse: string | null
    telephone: string | null
  }
  membre?: {
    id: string
    nomComplet: string | null
  } | null
  creeLe: string
  misAJourLe: string
}

/**
 * Récupère tous les rendez-vous (authentifiés)
 */
export async function getAllAppointments(token: string): Promise<AppointmentData[]> {
  const response = await fetch(`${API_BASE_URL}/rendez-vous`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des rendez-vous')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Crée un rendez-vous
 */
export async function createAppointment(
  appointmentData: Partial<AppointmentData>,
  token: string
): Promise<AppointmentData> {
  const response = await fetch(`${API_BASE_URL}/rendez-vous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la création du rendez-vous')
  }

  const data = await response.json()
  return data.data || data
}

/**
 * Confirme un rendez-vous
 */
export async function confirmAppointment(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/rendez-vous/${id}/confirmer`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la confirmation')
  }
}

/**
 * Annule un rendez-vous
 */
export async function cancelAppointment(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/rendez-vous/${id}/annuler`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de l'annulation")
  }
}
