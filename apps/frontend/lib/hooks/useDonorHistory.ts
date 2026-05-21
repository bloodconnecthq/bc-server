/**
 * Hook pour récupérer l'historique des dons du donneur courant
 */

import { useEffect, useState, useCallback } from 'react'
import { getDonorDonHistory, type DonHistory } from '@/lib/api/donorApi'

export interface UseDonorHistoryState {
  donations: DonHistory[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDonorHistory(token: string | null): UseDonorHistoryState {
  const [donations, setDonations] = useState<DonHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    if (!token) {
      setDonations([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const historyData = await getDonorDonHistory(token)
      setDonations(historyData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setDonations([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    donations,
    isLoading,
    error,
    refetch: fetchHistory,
  }
}
