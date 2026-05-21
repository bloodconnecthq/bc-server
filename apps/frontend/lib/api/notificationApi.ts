/**
 * Service API pour les notifications
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api'

export interface NotificationData {
  id: string
  type: 'eligible' | 'urgent' | 'badge' | 'campaign' | 'confirm' | 'reminder'
  title: string
  message: string
  date: string
  read: boolean
}

/**
 * Récupère toutes les notifications du donneur courant
 */
export async function getNotifications(token: string): Promise<NotificationData[]> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notifications.list}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des notifications')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.data || []
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string, token: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.notifications.markRead}`.replace(':id', notificationId),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Erreur lors du marquage de la notification')
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.notifications.markAllRead}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erreur lors du marquage des notifications')
  }
}
