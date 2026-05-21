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

  const data = await response.json()
  return data.data || data
}

/**
 * Met à jour le profil courant
 * Note: Cette route peut nécessiter d'être créée/complétée au backend
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

  const data = await response.json()
  return data.data || data
}
