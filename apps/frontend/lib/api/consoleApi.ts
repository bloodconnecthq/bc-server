import { API_BASE_URL } from '@/config/api'

// ── Extraction helpers ──────────────────────────────────────────────────────
// Handles: plain { succes, donnees: [] }, BaseTransformer { $type: "collection" },
// array of { $type: "item" }, or a raw array.

function extractList<T>(raw: any): T[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (item?.$type === 'item' && Array.isArray(item.transformerData)) {
        return item.transformerData[0] as T
      }
      return item as T
    })
  }
  if (raw?.$type === 'collection' && Array.isArray(raw.transformerData)) {
    const items = raw.transformerData[0]
    if (Array.isArray(items)) return items as T[]
  }
  if (Array.isArray(raw?.donnees)) return raw.donnees as T[]
  if (Array.isArray(raw?.data)) return raw.data as T[]
  return []
}

function extractData<T>(raw: any): T {
  const inner = raw?.donnees ?? raw?.data ?? raw
  if (inner?.$type === 'item' && Array.isArray(inner.transformerData)) {
    return inner.transformerData[0] as T
  }
  return inner as T
}

async function authFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.erreur || err.message || `Erreur ${res.status}`)
  }
  return res.json()
}

// ── Donneurs ────────────────────────────────────────────────────────────────

export interface DonneurAPI {
  id: string
  codeDonneur: string
  groupeSanguin: string | null
  totalDons: number
  dateDernierDon: string | null
  dateEligibiliteSuivante: string | null
  estEligible: boolean
  niveauBadge: 'aucun' | 'bronze' | 'argent' | 'or' | 'platine'
  statut: 'actif' | 'inactif' | 'suspendu'
  utilisateur: {
    id: string
    nomComplet: string | null
    prenom: string | null
    nom: string | null
    email: string
    telephone: string | null
    commune: string | null
    departement: string | null
    dateNaissance: string | null
    estActif: boolean
  } | null
  creeLe: string
  misAJourLe: string
}

export async function getDonneurs(token: string): Promise<DonneurAPI[]> {
  const raw = await authFetch('/donneurs', token)
  return extractList<DonneurAPI>(raw)
}

export async function updateDoneurStatut(id: string, estActif: boolean, token: string) {
  return authFetch(`/donneurs/${id}/statut`, token, {
    method: 'PATCH',
    body: JSON.stringify({ estActif }),
  })
}

export interface UpdateDonneurPayload {
  prenom?: string
  nom?: string
  groupeSanguin?: string
  telephone?: string
  commune?: string
  departement?: string
  dateNaissance?: string
}

export async function updateDoneurAdmin(id: string, data: UpdateDonneurPayload, token: string) {
  return authFetch(`/donneurs/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteDonneur(id: string, token: string) {
  return authFetch(`/donneurs/${id}`, token, { method: 'DELETE' })
}

export async function getRapportDonneurs(token: string) {
  const raw = await authFetch('/rapports/donneurs', token)
  return extractData<{
    total: number
    actifs: number
    inactifs: number
    eligibles: number
    nonEligibles: number
    ayantDonne: number
    sansDonn: number
    parGroupeSanguin: Record<string, number>
    parNiveauBadge: Record<string, number>
  }>(raw)
}

// ── Hôpitaux ─────────────────────────────────────────────────────────────────

export interface HopitalAPI {
  id: string
  nom: string
  type: string | null
  adresse: string | null
  commune: string | null
  departement: string | null
  telephone: string | null
  email: string | null
  estActif: boolean
  createdAt?: string
  updatedAt?: string
}

export async function getHopitaux(token: string): Promise<HopitalAPI[]> {
  const raw = await authFetch('/hopitaux', token)
  return extractList<HopitalAPI>(raw)
}

export interface HospitalPayload {
  nom: string
  type: string
  adresse?: string
  commune?: string
  departement?: string
  telephone?: string
  email?: string
  latitude?: number | null
  longitude?: number | null
}

export async function createHopital(data: HospitalPayload, token: string) {
  return authFetch('/hopitaux', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateHopital(id: string, data: HospitalPayload, token: string) {
  return authFetch(`/hopitaux/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function updateHopitalStatut(id: string, estActif: boolean, token: string) {
  return authFetch(`/hopitaux/${id}/statut`, token, {
    method: 'PATCH',
    body: JSON.stringify({ estActif }),
  })
}

// ── Stocks ───────────────────────────────────────────────────────────────────

export interface ResumeNationalAPI {
  [groupe: string]: {
    quantiteTotale: number
    nbHopitaux: number
    critique: number
    faible: number
  }
}

export async function getStocksResumeNational(token: string): Promise<ResumeNationalAPI> {
  const raw = await authFetch('/stocks/resume-national', token)
  return extractData<ResumeNationalAPI>(raw)
}

export interface RapportStocksAPI {
  totalPoches: number
  hopitauxEnCrise: number
  parHopital: {
    hopitalId: string
    nomHopital: string
    commune: string | null
    quantiteTotale: number
    stocksCritiques: number
    stocksFaibles: number
    stocks: { groupeSanguin: string; quantite: number; seuilCritique: number; seuilFaible: number }[]
  }[]
}

export interface RapportHopitauxAPI {
  total: number
  actifs: number
  inactifs: number
  parType: Record<string, number>
  parDepartement: Record<string, number>
  parActivite: {
    hopitalId: string
    nom: string
    commune: string | null
    totalMembres: number
    totalDons: number
  }[]
}

export async function getRapportHopitaux(token: string): Promise<RapportHopitauxAPI> {
  const raw = await authFetch('/rapports/hopitaux', token)
  return extractData<RapportHopitauxAPI>(raw)
}

export async function getRapportStocks(token: string): Promise<RapportStocksAPI> {
  const raw = await authFetch('/rapports/stocks', token)
  return extractData<RapportStocksAPI>(raw)
}

// ── Demandes d'accès ─────────────────────────────────────────────────────────

export interface DemandeAccesAPI {
  id: string
  nomDemandeur: string
  emailDemandeur: string
  roleDemande: string
  hopital?: { id: string; nom: string } | null
  statut: string
  createdAt?: string
}

export async function getDemandesAcces(token: string): Promise<DemandeAccesAPI[]> {
  const raw = await authFetch('/membres/demandes', token)
  return extractList<DemandeAccesAPI>(raw)
}

export async function approuverDemande(id: string, token: string) {
  return authFetch(`/membres/demandes/${id}/approuver`, token, { method: 'PATCH' })
}

export async function rejeterDemande(id: string, token: string) {
  return authFetch(`/membres/demandes/${id}/rejeter`, token, { method: 'PATCH' })
}

// ── Utilisateurs ─────────────────────────────────────────────────────────────

export interface UserAPI {
  id: string
  nomComplet: string | null
  prenom: string | null
  nom: string | null
  email: string
  role: 'donneur' | 'infirmier' | 'medecin' | 'admin_hopital' | 'super_admin'
  telephone: string | null
  commune: string | null
  departement: string | null
  dateNaissance: string | null
  estActif: boolean
  photoProfil: string | null
  hopital: { id: string; nom: string } | null
  membreId: string | null
  creeLe: string
  misAJourLe: string | null
}

export interface UserStatsAPI {
  total: number
  actifs: number
  inactifs: number
  parRole: Record<string, number>
}

export interface UpdateUserPayload {
  nomComplet?: string
  prenom?: string
  nom?: string
  email?: string
  telephone?: string
  commune?: string
  departement?: string
  role?: string
  estActif?: boolean
}

export async function getUsers(token: string, params?: { search?: string; role?: string; statut?: string }): Promise<UserAPI[]> {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.role)   qs.set('role', params.role)
  if (params?.statut) qs.set('statut', params.statut)
  const raw = await authFetch(`/users?${qs}`, token)
  return Array.isArray(raw?.data) ? raw.data : []
}

export async function getUserStats(token: string): Promise<UserStatsAPI> {
  const raw = await authFetch('/users/stats', token)
  return raw?.data ?? raw
}

export async function updateUser(id: string, data: UpdateUserPayload, token: string): Promise<UserAPI> {
  const raw = await authFetch(`/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return raw?.data ?? raw
}

export async function updateUserStatut(id: string, estActif: boolean, token: string): Promise<UserAPI> {
  const raw = await authFetch(`/users/${id}/statut`, token, {
    method: 'PATCH',
    body: JSON.stringify({ estActif }),
  })
  return raw?.data ?? raw
}

export async function resetUserPassword(id: string, nouveauMotDePasse: string, token: string): Promise<void> {
  await authFetch(`/users/${id}/reset-password`, token, {
    method: 'PATCH',
    body: JSON.stringify({ nouveauMotDePasse }),
  })
}

export async function deleteUser(id: string, token: string): Promise<void> {
  await authFetch(`/users/${id}`, token, { method: 'DELETE' })
}

// ── Dons (poches de sang) ────────────────────────────────────────────────────

export interface DonAPI {
  id: string
  donneurId: string
  hopitalId: string | null
  agentId: string | null
  dateDon: string | null
  typePoche: string | null
  volume: number | null
  statut: 'en_attente' | 'valide' | 'rejete'
  hopital: { id: string; nom: string; commune: string } | null
  agent: { id: string; nomComplet: string } | null
  donneur: { id: string; codeDonneur: string; groupeSanguin: string } | null
  nomDonneur: string | null
  dateExpiration: string | null
  creeLe: string | null
}

export interface DonStatsAPI {
  total: number
  valides: number
  enAttente: number
  rejetes: number
  tauxValidation: number
}

export async function getDons(token: string): Promise<DonAPI[]> {
  const raw = await authFetch('/dons', token)
  return extractList<DonAPI>(raw)
}

export async function getDonStats(token: string): Promise<DonStatsAPI> {
  const raw = await authFetch('/dons/statistiques', token)
  return extractData<DonStatsAPI>(raw)
}

export async function validerDon(id: string, token: string): Promise<void> {
  await authFetch(`/dons/${id}/valider`, token, { method: 'PATCH' })
}

export async function rejeterDon(id: string, token: string): Promise<void> {
  await authFetch(`/dons/${id}/rejeter`, token, { method: 'PATCH' })
}

// ── Rapport dons ─────────────────────────────────────────────────────────────

export async function getRapportDons(token: string) {
  const raw = await authFetch('/rapports/dons', token)
  return extractData<{
    total: number
    valides: number
    enAttente: number
    rejetes: number
    tauxValidation: number
    parMois: Record<string, number>
    parTypePoche: Record<string, number>
  }>(raw)
}
