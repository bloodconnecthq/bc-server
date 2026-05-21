/**
 * Hook pour récupérer les centres de collecte
 */

import { useEffect, useState, useCallback } from 'react'
import { getCollectionCenters, type CenterData } from '@/lib/api/hospitalApi'

export interface UseCentersState {
  centers: CenterData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCenters(): UseCentersState {
  const [centers, setCenters] = useState<CenterData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCenters = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const centersData = await getCollectionCenters()
      setCenters(centersData)
      console.log("Centres de collecte récupérés:", centersData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setCenters([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCenters()
  }, [fetchCenters])

  return {
    centers,
    isLoading,
    error,
    refetch: fetchCenters,
  }
}
