/**
 * Service API pour le profil utilisateur/donneur
 */

import { API_BASE_URL, API_ENDPOINTS, type User } from '@/config/api'

export interface UpdateProfileData {
  prenom?: string
  nom?: string
  telephone?: string
  email?: string
  commune?: string
  dateNaissance?: string
}

function extractUser(raw: any): User {
  const inner = raw?.data ?? raw?.donnees ?? raw
  if (inner?.$type === 'item' && Array.isArray(inner.transformerData)) {
    return inner.transformerData[0] as User
  }
  return inner as User
}

/**
 * Récupère le profil courant
 */
export async function getProfile(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.compte.profil}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du profil')
  }

  return extractUser(await response.json())
}

/**
 * Met à jour le profil courant
 */
export async function updateProfile(profileData: UpdateProfileData, token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.compte.profil}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erreur lors de la mise à jour du profil')
  }

  return extractUser(await response.json())
}

/**
 * Change le mot de passe de l'utilisateur connecté
 */
export async function changerMotDePasse(
  ancienMotDePasse: string,
  nouveauMotDePasse: string,
  token: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/compte/mot-de-passe`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.erreur || error.message || 'Erreur lors du changement de mot de passe')
  }
}

/**
 * Met à jour la photo de profil (base64)
 */
export async function uploadProfilePhoto(photoBase64: string, token: string): Promise<{ photoProfil: string }> {
  const response = await fetch(`${API_BASE_URL}/compte/photo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ photoProfil: photoBase64 }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.erreur || 'Erreur lors du téléchargement de la photo')
  }

  const data = await response.json()
  return data.donnees || data
}
