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

// ── Rendez-vous ───────────────────────────────────────────────────────────────

export interface RdvData {
  id: string
  dateRdv: string
  statut: 'planifie' | 'confirme' | 'annule' | 'effectue'
  note: string | null
  donneurId: string
  membreId: string | null
  hopitalId: string
  donneur: {
    id: string
    codeDonneur: string
    groupeSanguin: string | null
  } | null
  membre: {
    id: string
    nomComplet: string | null
    role: string
  } | null
  hopital: { id: string; nom: string } | null
  creeLe: string | null
  misAJourLe: string | null
}

export interface RdvMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface RdvPaginatedResponse {
  data: RdvData[]
  meta: RdvMeta
}

function extractRdvList(raw: any): RdvData[] {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.donnees)) return raw.donnees
  return []
}

// File commune : RDVs non attribués de l'hôpital, paginés par 10
export async function getMyHospitalRdv(token: string, page = 1): Promise<RdvPaginatedResponse> {
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.hopitaux.moiRendezVous}?page=${page}`,
    { headers: createHeaders(token) }
  )
  const raw = await res.json()
  return {
    data: Array.isArray(raw?.data) ? raw.data : [],
    meta: raw?.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1, firstPage: 1 },
  }
}

// Mes RDVs attribués
export async function getMyAssignedRdv(token: string): Promise<RdvData[]> {
  const res = await fetch(`${API_BASE_URL}/rendez-vous/attribues`, { headers: createHeaders(token) })
  return extractRdvList(await res.json())
}

// S'attribuer un RDV non pris en charge
export async function sAttribuerRdv(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rendez-vous/${id}/s-attribuer`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de l\'attribution')
  }
}

export async function marquerRdvEffectue(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/rendez-vous/${id}/effectue`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur')
  }
}

// ── Profil membre hôpital ─────────────────────────────────────────────────────

export interface HospitalMemberProfile {
  id: string
  nomComplet: string | null
  prenom: string | null
  nom: string | null
  email: string
  role: string
  photoProfil: string | null
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
  statut: 'en_attente' | 'satisfait' | 'non_satisfait' | 'transfere'
  transfereVersHopitalId: string | null
  transfereVers: { id: string; nom: string } | null
  stockDisponible: number
  peutEtreSatisfait: boolean
  medecin: { id: string; nomComplet: string | null } | null
  hopital: { id: string; nom: string } | null
  creeLe: string | null
}

export interface CreateBonDemandePayload {
  hopitalId: string
  nomPatient: string
  groupeSanguinPatient: string
  quantiteNecessaire: number
}

export interface HospitalWithStock {
  id: string
  nom: string
  commune: string | null
  adresse: string | null
  telephone: string | null
  stock: {
    quantite: number
    seuilFaible: number
    seuilCritique: number
  }
}

function extractBonList(raw: any): BonDemandeData[] {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.donnees)) return raw.donnees
  return []
}

export async function getBonsDemande(token: string): Promise<BonDemandeData[]> {
  const res = await fetch(`${API_BASE_URL}/bons-demande`, { headers: createHeaders(token) })
  return extractBonList(await res.json())
}

export async function getBonsDemandeRecus(token: string): Promise<BonDemandeData[]> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/recus`, { headers: createHeaders(token) })
  return extractBonList(await res.json())
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

export async function transfererBonDemande(id: string, hopitalId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}/transferer`, {
    method: 'PATCH',
    headers: createHeaders(token),
    body: JSON.stringify({ hopitalId }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors du transfert')
  }
}

export async function updateBonDemande(
  id: string,
  payload: { nomPatient?: string; groupeSanguinPatient?: string; quantiteNecessaire?: number },
  token: string
): Promise<BonDemandeData> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.erreur ?? 'Erreur lors de la modification')
  return data?.data ?? data
}

export async function deleteBonDemande(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de la suppression')
  }
}

export async function declinerBonDemande(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/bons-demande/${id}/decliner`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur')
  }
}

export async function getHopitauxAvecStock(
  groupeSanguin: string,
  quantite: number,
  token: string
): Promise<HospitalWithStock[]> {
  const params = new URLSearchParams({ groupeSanguin, quantite: String(quantite) })
  const res = await fetch(`${API_BASE_URL}/hopitaux/avec-stock?${params}`, {
    headers: createHeaders(token),
  })
  const data = await res.json()
  return Array.isArray(data) ? data : data?.data ?? []
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

// ── Settings ──────────────────────────────────────────────────────────────────

export interface MemberData {
  id: string
  utilisateurId: string
  hopitalId: string
  utilisateur: {
    id: string
    nomComplet: string | null
    email: string
    role: string
    telephone: string | null
  } | null
}

export interface DemandeAccesData {
  id: string
  hopitalId: string
  nomDemandeur: string
  emailDemandeur: string
  roleDemande: 'medecin' | 'infirmier'
  message: string | null
  statut: 'en_attente' | 'approuvee' | 'rejetee'
  creeLe: string
}

export async function getMyHospital(token: string): Promise<HospitalData> {
  const res = await fetch(`${API_BASE_URL}/hopitaux/moi`, { headers: createHeaders(token) })
  const data = await res.json()
  return data?.data ?? data
}

export async function updateMyHospital(
  payload: Partial<Pick<HospitalData, 'nom' | 'adresse' | 'commune' | 'departement' | 'telephone' | 'email'>>,
  token: string
): Promise<HospitalData> {
  const res = await fetch(`${API_BASE_URL}/hopitaux/moi`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.erreur ?? 'Erreur lors de la mise à jour')
  return data?.data ?? data
}

export async function getMyMembers(token: string): Promise<MemberData[]> {
  const res = await fetch(`${API_BASE_URL}/hopitaux/moi/membres`, { headers: createHeaders(token) })
  const data = await res.json()
  return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
}

export async function supprimerMembre(membreId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/membres/demandes/${membreId}`, {
    method: 'DELETE',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de la suppression')
  }
}

export async function getDemandesAcces(token: string): Promise<DemandeAccesData[]> {
  const res = await fetch(`${API_BASE_URL}/membres/demandes`, { headers: createHeaders(token) })
  const data = await res.json()
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

export async function soumettreDemandeAcces(
  payload: { hopitalId: string; nomDemandeur: string; emailDemandeur: string; roleDemande: string; message?: string },
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/membres/demandes`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de la soumission')
  }
}

export async function approuverDemandeAcces(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/membres/demandes/${id}/approuver`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de l\'approbation')
  }
}

export async function rejeterDemandeAcces(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/membres/demandes/${id}/rejeter`, {
    method: 'PATCH',
    headers: createHeaders(token),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors du rejet')
  }
}

export async function updateStockSeuils(
  stockId: string,
  payload: { seuilFaible: number; seuilCritique: number },
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/stocks/${stockId}`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors de la mise à jour des seuils')
  }
}

export async function updatePassword(
  motDePasseActuel: string,
  nouveauMotDePasse: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/compte/mot-de-passe`, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify({ motDePasseActuel, nouveauMotDePasse }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.erreur ?? 'Erreur lors du changement de mot de passe')
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
