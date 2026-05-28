/**
 * Configuration API
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1'

export const API_ENDPOINTS = {
  // Auth
  auth: {
    inscription: '/auth/inscription',
    connexion: '/auth/connexion',
    deconnexion: '/auth/deconnexion',
    verifier: '/auth/verifier',
  },
  // Account
  compte: {
    profil: '/compte/profil',
  },
  // Donor
  donneurs: {
    monProfil: '/donneurs/moi/profil',
  },
  // Dons
  dons: {
    historiqueMonDonneur: '/dons/moi/historique',
  },
  // Hôpitaux
  hopitaux: {
    index: '/hopitaux',
    show: '/hopitaux/:id',
    stocks: '/hopitaux/:id/stocks',
    dons: '/hopitaux/:id/dons',
    rendezVous: '/hopitaux/:id/rendez-vous',
    moiStocks: '/hopitaux/moi/stocks',
    moiDons: '/hopitaux/moi/dons',
    moiRendezVous: '/hopitaux/moi/rendez-vous',
  },
  // Notifications
  notifications: {
    list: '/notifications',
    markRead: '/notifications/:id/lire',
    markAllRead: '/notifications/tout-lire',
  },
}

export interface User {
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
  creeLe: string
  misAJourLe: string | null
  initials: string
  hopitalId?: string | null
  roleMembre?: 'medecin' | 'infirmier' | 'admin_hopital' | null
  hopital?: {
    id: string
    nom: string
    commune: string | null
    departement: string | null
    adresse?: string | null
    telephone?: string | null
    email?: string | null
  } | null
}

export interface AuthResponse {
  message: string
  user: User
  token: string
  authenticated?: boolean
}

export interface SignupData {
  nomComplet: string
  prenom?: string
  nom?: string
  email: string
  motDePasse: string
  motDePasseConfirmation: string
  role?: 'donneur' | 'infirmier' | 'medecin' | 'admin_hopital' | 'super_admin'
  telephone?: string
  groupeSanguin?: string
  commune?: string
  departement?: string
  dateNaissance?: string
}

export interface LoginData {
  email: string
  motDePasse: string
}
