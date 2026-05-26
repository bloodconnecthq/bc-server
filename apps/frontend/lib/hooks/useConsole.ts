import { useCallback, useEffect, useState } from 'react'
import {
  getDonneurs, getRapportDonneurs, getHopitaux, getRapportHopitaux,
  getStocksResumeNational, getRapportStocks, getDemandesAcces, getRapportDons,
  getUsers, getUserStats,
  type DonneurAPI, type HopitalAPI, type ResumeNationalAPI,
  type RapportStocksAPI, type RapportHopitauxAPI, type DemandeAccesAPI,
  type UserAPI, type UserStatsAPI,
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

export function useRapportHopitaux(token: string | null) {
  return useAsync<RapportHopitauxAPI>(
    () =>
      token
        ? getRapportHopitaux(token)
        : Promise.resolve({ total: 0, actifs: 0, inactifs: 0, parType: {}, parDepartement: {}, parActivite: [] }),
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

export function useUsers(token: string | null, params?: { search?: string; role?: string; statut?: string }) {
  return useAsync<UserAPI[]>(
    () => (token ? getUsers(token, params) : Promise.resolve([])),
    [token, params?.search, params?.role, params?.statut]
  )
}

export function useUserStats(token: string | null) {
  return useAsync<UserStatsAPI>(
    () => (token ? getUserStats(token) : Promise.resolve({ total: 0, actifs: 0, inactifs: 0, parRole: {} })),
    [token]
  )
}
