/**
 * Service API pour les hôpitaux et centres de collecte
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'

export interface HospitalData {
  id: string
  nom: string
  type: 'cnts' | 'chu' | 'antenne' | 'hopital' | 'centre' | 'mobile'
  adresse: string | null
  commune: string | null
  departement: string | null
  telephone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  estActif: boolean
  creeLe: string
  misAJourLe: string
}

export interface CenterData {
  id: string
  nom: string
  latitude: number | null
  longitude: number | null
  commune: string | null
  adresse: string | null
  telephone: string | null
}

export interface StockData {
  id: string
  hopitalId: string
  groupeSanguin: string | null
  quantite: number
  seuilFaible: number
  seuilCritique: number
  creeLe: string
  misAJourLe: string
}

export interface AppointmentData {
  id: string
  dateRdv: string
  heureRdv: string
  statut: 'planifie' | 'confirme' | 'annule' | 'effectue'
  notes: string | null
  donneur: {
    id: string
    nomComplet: string | null
    numeroDonneur: string | null
    groupeSanguin: string | null
    telephone: string | null
  } | null
  agent: {
    id: string
    nomComplet: string | null
    role: string
  } | null
  hopital: {
    id: string
    nom: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface DonationData {
  id: string
  donneurId: string | null
  hopitalId: string | null
  agentId: string | null
  dateDon: string | null
  typePoche: string | null
  volume: number | null
  statut: 'en_attente' | 'valide' | 'rejete'
  hopital: {
    id: string
    nom: string
    commune: string | null
  } | null
  agent: {
    id: string
    nomComplet: string | null
  } | null
  donneur: {
    id: string
    codeDonneur: string | null
    groupeSanguin: string | null
  } | null
  creeLe: string | null
  misAJourLe: string | null
}

function createHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Récupère tous les hôpitaux
 */
export async function getAllHospitals(token?: string): Promise<HospitalData[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.hopitaux.index}`, {
    method: 'GET',
    headers: createHeaders(token),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des hôpitaux')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Récupère les détails d'un hôpital spécifique
 */
export async function getHospitalById(id: string, token?: string): Promise<HospitalData> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.hopitaux.show.replace(':id', id)}`, {
    method: 'GET',
    headers: createHeaders(token),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'hôpital")
  }

  const data = await response.json()
  return data.data || data
}

export async function getHospitalStocks(hopitalId: string, token?: string): Promise<StockData[]> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.hopitaux.stocks.replace(':id', hopitalId)}`,
    {
      method: 'GET',
      headers: createHeaders(token),
    }
  )

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des stocks de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

export async function getMyHospitalStocks(token?: string): Promise<StockData[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.hopitaux.moiStocks}`, {
    method: 'GET',
    headers: createHeaders(token),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des stocks de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

export async function getHospitalDonations(
  hopitalId: string,
  token?: string
): Promise<DonationData[]> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.hopitaux.dons.replace(':id', hopitalId)}`,
    {
      method: 'GET',
      headers: createHeaders(token),
    }
  )

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des dons de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

export async function getMyHospitalDonations(token?: string): Promise<DonationData[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.hopitaux.moiDons}`, {
    method: 'GET',
    headers: createHeaders(token),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des dons de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

export async function getHospitalAppointments(
  hopitalId: string,
  token?: string
): Promise<AppointmentData[]> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.hopitaux.rendezVous.replace(':id', hopitalId)}`,
    {
      method: 'GET',
      headers: createHeaders(token),
    }
  )

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des rendez-vous de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

export async function getMyHospitalAppointments(token?: string): Promise<AppointmentData[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.hopitaux.moiRendezVous}`, {
    method: 'GET',
    headers: createHeaders(token),
  })

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des rendez-vous de l'hôpital")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

// ── Profil membre hôpital ─────────────────────────────────────────────────────

export interface HospitalMemberProfile {
  id: string
  nomComplet: string | null
  prenom: string | null
  nom: string | null
  email: string
  role: string
  hopitalId: string | null
  hopital: HospitalData | null
}

export async function getMyMemberProfile(token: string): Promise<HospitalMemberProfile> {
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.compte.profil}`, { headers: createHeaders(token) })
  const data = await res.json()
  return data?.data ?? data
}

// ── Bons de demande ───────────────────────────────────────────────────────────

export interface BonDemandeData {
  id: string
  medecinId: string
  hopitalId: string
  nomPatient: string
  groupeSanguinPatient: string
  quantiteNecessaire: number
  statut: 'en_attente' | 'satisfait' | 'non_satisfait'
  medecin: { id: string; nomComplet: string | null } | null
  hopital: { id: string; nom: string } | null
  creeLe: string
}

export interface CreateBonDemandePayload {
  hopitalId: string
  nomPatient: string
  groupeSanguinPatient: string
  quantiteNecessaire: number
}

export async function getBonsDemande(token: string): Promise<BonDemandeData[]> {
  const res = await fetch(`${API_BASE_URL}/bons-demande`, { headers: createHeaders(token) })
  const data = await res.json()
  return Array.isArray(data) ? data : data?.data ?? data?.donnees ?? []
}

export async function createBonDemande(payload: CreateBonDemandePayload, token: string): Promise<BonDemandeData> {
  const res = await fetch(`${API_BASE_URL}/bons-demande`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.erreur ?? 'Erreur lors de la création du bon')
  return data?.data ?? data
}

export async function satisfaireBonDemande(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}/satisfaire`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur')
  }
}

export async function nonSatisfaireBonDemande(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}/non-satisfaire`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur')
  }
}

// ── Actions sur les dons ──────────────────────────────────────────────────────

export interface CreateDonPayload {
  donneurId: string
  hopitalId: string
  dateDon: string
  typePoche: 'DCL' | 'PCL'
  volume: number
  questionnaireReponses: Record<string, unknown>
}

export async function createDon(payload: CreateDonPayload, token: string): Promise<DonationData> {
  const res = await fetch(`${API_BASE_URL}/dons`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.erreur ?? 'Erreur lors de l\'enregistrement du don')
  return data?.data ?? data
}

export async function validerDon(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/dons/${id}/valider`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de la validation')
  }
}

export async function rejeterDon(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/dons/${id}/rejeter`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors du rejet')
  }
}

/**
 * Récupère tous les centres de collecte actifs
 */
export async function getCollectionCenters(): Promise<CenterData[]> {
  const response = await fetch(`${API_BASE_URL}/centres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des centres')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Récupère les centres proches basés sur la latitude/longitude
 */
export async function getNearestCenters(
  latitude: number,
  longitude: number
): Promise<CenterData[]> {
  const response = await fetch(
    `${API_BASE_URL}/centres/proches?latitude=${latitude}&longitude=${longitude}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des centres proches')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}
