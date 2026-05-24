import { useCallback, useEffect, useState } from 'react'
import {
  getDonneurs, getRapportDonneurs, getHopitaux,
  getStocksResumeNational, getRapportStocks, getDemandesAcces, getRapportDons,
  type DonneurAPI, type HopitalAPI, type ResumeNationalAPI,
  type RapportStocksAPI, type DemandeAccesAPI,
} from '@/lib/api/consoleApi'

function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: unknown[]
): { data: T | null; isLoading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetcher()
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false) } })
      .catch((e) => { if (!cancelled) { setError(e.message ?? 'Erreur'); setIsLoading(false) } })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { data, isLoading, error, refetch }
}

export function useDonneurs(token: string | null) {
  return useAsync<DonneurAPI[]>(
    () => (token ? getDonneurs(token) : Promise.resolve([])),
    [token]
  )
}

export function useRapportDonneurs(token: string | null) {
  return useAsync(
    () => (token ? getRapportDonneurs(token) : Promise.resolve(null)),
    [token]
  )
}

export function useHopitaux(token: string | null) {
  return useAsync<HopitalAPI[]>(
    () => (token ? getHopitaux(token) : Promise.resolve([])),
    [token]
  )
}

export function useStocksResumeNational(token: string | null) {
  return useAsync<ResumeNationalAPI>(
    () => (token ? getStocksResumeNational(token) : Promise.resolve({})),
    [token]
  )
}

export function useRapportStocks(token: string | null) {
  return useAsync<RapportStocksAPI>(
    () => (token ? getRapportStocks(token) : Promise.resolve({ totalPoches: 0, hopitauxEnCrise: 0, parHopital: [] })),
    [token]
  )
}

export function useDemandesAcces(token: string | null) {
  return useAsync<DemandeAccesAPI[]>(
    () => (token ? getDemandesAcces(token) : Promise.resolve([])),
    [token]
  )
}

export function useRapportDons(token: string | null) {
  return useAsync(
    () => (token ? getRapportDons(token) : Promise.resolve(null)),
    [token]
  )
}
