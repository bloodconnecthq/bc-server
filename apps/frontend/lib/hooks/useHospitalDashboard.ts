import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import {
  getMyHospitalDonations,
  getMyHospitalStocks,
  getMyHospitalAppointments,
  type DonationData,
  type StockData,
  type AppointmentData,
} from '@/lib/api/hospitalApi'

export interface HospitalDashboardState {
  stocks: StockData[]
  donations: DonationData[]
  appointments: AppointmentData[]
  isLoading: boolean
  error: string | null
  stocksError: string | null
  donationsError: string | null
  appointmentsError: string | null
  refetch: () => Promise<void>
}

export function useHospitalDashboard() {
  const { token, isLoading: authLoading } = useAuth()
  const [stocks, setStocks] = useState<StockData[]>([])
  const [donations, setDonations] = useState<DonationData[]>([])
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stocksError, setStocksError] = useState<string | null>(null)
  const [donationsError, setDonationsError] = useState<string | null>(null)
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    if (!token) {
      setStocks([])
      setDonations([])
      setAppointments([])
      setStocksError(null)
      setDonationsError(null)
      setAppointmentsError(null)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setStocksError(null)
    setDonationsError(null)
    setAppointmentsError(null)

    const [stocksResult, donationsResult, appointmentsResult] = await Promise.allSettled([
      getMyHospitalStocks(token),
      getMyHospitalDonations(token),
      getMyHospitalAppointments(token),
    ])

    if (stocksResult.status === 'fulfilled') {
      setStocks(stocksResult.value)
    } else {
      setStocks([])
      setStocksError(
        stocksResult.reason instanceof Error
          ? stocksResult.reason.message
          : 'Erreur lors de la récupération des stocks'
      )
    }

    if (donationsResult.status === 'fulfilled') {
      setDonations(donationsResult.value)
    } else {
      setDonations([])
      setDonationsError(
        donationsResult.reason instanceof Error
          ? donationsResult.reason.message
          : 'Erreur lors de la récupération des dons'
      )
    }

    if (appointmentsResult.status === 'fulfilled') {
      setAppointments(appointmentsResult.value)
    } else {
      setAppointments([])
      setAppointmentsError(
        appointmentsResult.reason instanceof Error
          ? appointmentsResult.reason.message
          : 'Erreur lors de la récupération des rendez-vous'
      )
    }

    const allFailed =
      stocksResult.status === 'rejected' &&
      donationsResult.status === 'rejected' &&
      appointmentsResult.status === 'rejected'

    if (allFailed) {
      setError('Impossible de charger les données du tableau de bord')
    } else {
      setError(null)
    }

    setIsLoading(false)
  }, [token])

  useEffect(() => {
    if (!authLoading) {
      void fetchDashboard()
    }
  }, [authLoading, fetchDashboard])

  return {
    stocks,
    donations,
    appointments,
    isLoading,
    error,
    stocksError,
    donationsError,
    appointmentsError,
    refetch: fetchDashboard,
  }
}
