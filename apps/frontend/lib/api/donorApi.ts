/**
 * Service API pour les donneurs
 * Contient toutes les fonctions de communication avec l'API backend pour les donneurs
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'

export interface DonorProfile {
  id: string
  codeDonneur: string
  groupeSanguin: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null
  totalDons: number
  dateDernierDon: string | null
  dateEligibiliteSuivante: string | null
  niveauBadge: 'aucun' | 'bronze' | 'argent' | 'or' | 'platine'
  donneesQrCode: string | null
  utilisateur: {
    id: string
    nomComplet: string | null
    prenom: string | null
    nom: string | null
    email: string
    telephone: string | null
    commune: string | null
    dateNaissance: string | null
  } | null
  creeLe: string
  misAJourLe: string
}

export interface DonHistory {
  id: string
  donneurId: string
  hopitalId: string
  agentId: string
  dateDon: string
  typePoche: 'DCL' | 'PCL'
  volume: number
  statut: 'en_attente' | 'valide' | 'rejete'
  hopital?: {
    id: string
    nom: string
    commune: string
  }
  agent?: {
    id: string
    nomComplet: string | null
  }
  creeLe: string
  misAJourLe: string
}

/**
 * Récupère le profil du donneur courant (authentifié)
 */
export async function getDonorProfile(token: string): Promise<DonorProfile> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.donneurs.monProfil}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la récupération du profil')
  }

  const data = await response.json()
  return data.donnees || data.donor
}

/**
 * Récupère l'historique des dons du donneur courant
 */
export async function getDonorDonHistory(token: string): Promise<DonHistory[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.dons.historiqueMonDonneur}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors de la récupération de l'historique")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Récupère tous les donneurs (publique)
 */
export async function getAllDonors(): Promise<DonorProfile[]> {
  const response = await fetch(`${API_BASE_URL}/donneurs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des donneurs')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Récupère les détails d'un donneur spécifique
 */
export async function getDonorById(id: string): Promise<DonorProfile> {
  const response = await fetch(`${API_BASE_URL}/donneurs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du donneur')
  }

  const data = await response.json()
  return data.data || data
}

/**
 * Crée un nouveau donneur
 */
export async function createDonor(
  donorData: Partial<DonorProfile>,
  token: string
): Promise<DonorProfile> {
  const response = await fetch(`${API_BASE_URL}/donneurs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(donorData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la création du donneur')
  }

  const data = await response.json()
  return data.data || data
}
