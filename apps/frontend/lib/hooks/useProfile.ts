/**
 * Hook pour récupérer et mettre à jour le profil utilisateur
 */

import { useEffect, useState, useCallback } from 'react'
import { getProfile, updateProfile, type UpdateProfileData } from '@/lib/api/profileApi'
import { type User } from '@/config/api'

export interface UseProfileState {
  profile: User | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  saveError: string | null
  refetch: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
}

export function useProfile(token: string | null): UseProfileState {
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setProfile(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const profileData = await getProfile(token)
      setProfile(profileData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const handleUpdateProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!token) {
        setSaveError('Authentification requise')
        return
      }

      setIsSaving(true)
      setSaveError(null)

      try {
        const updatedProfile = await updateProfile(data, token)
        setProfile(updatedProfile)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
        setSaveError(errorMessage)
      } finally {
        setIsSaving(false)
      }
    },
    [token]
  )

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    isLoading,
    isSaving,
    error,
    saveError,
    refetch: fetchProfile,
    updateProfile: handleUpdateProfile,
  }
}
