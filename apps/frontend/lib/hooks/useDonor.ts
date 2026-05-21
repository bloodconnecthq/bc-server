/**
 * Hook pour récupérer le profil du donneur courant
 */

import { useEffect, useState, useCallback } from 'react'
import { getDonorProfile, type DonorProfile } from '@/lib/api/donorApi'

export interface UseDonorState {
  donor: DonorProfile | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDonor(token: string | null): UseDonorState {
  const [donor, setDonor] = useState<DonorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDonor = useCallback(async () => {
    if (!token) {
      setDonor(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const profileData = await getDonorProfile(token)
      console.log("Profil du donneur récupéré:", profileData)
      setDonor(profileData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setDonor(null)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchDonor()
  }, [fetchDonor])

  return {
    donor,
    isLoading,
    error,
    refetch: fetchDonor,
  }
}
