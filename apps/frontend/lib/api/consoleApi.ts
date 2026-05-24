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
