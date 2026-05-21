/**
 * Hook pour récupérer les notifications du donneur courant
 */

import { useEffect, useState, useCallback } from 'react'
import { getNotifications, type NotificationData } from '@/lib/api/notificationApi'

export interface UseNotificationsState {
  notifications: NotificationData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNotifications(token: string | null): UseNotificationsState {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const notificationsData = await getNotifications(token)
      setNotifications(notificationsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchNotifications,
  }
}
