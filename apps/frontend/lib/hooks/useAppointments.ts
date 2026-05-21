/**
 * Hook pour récupérer les rendez-vous du donneur courant
 */

import { useEffect, useState, useCallback } from 'react'
import { getAllAppointments, type AppointmentData } from '@/lib/api/appointmentApi'

export interface UseAppointmentsState {
  appointments: AppointmentData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAppointments(token: string | null): UseAppointmentsState {
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    if (!token) {
      setAppointments([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const appointmentsData = await getAllAppointments(token)
      setAppointments(appointmentsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return {
    appointments,
    isLoading,
    error,
    refetch: fetchAppointments,
  }
}
