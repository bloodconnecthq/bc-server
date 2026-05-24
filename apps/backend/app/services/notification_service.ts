import Notification from '#models/notification'
import { DateTime } from 'luxon'

type NotifType = 'confirm' | 'urgent' | 'eligible' | 'badge' | 'campaign'

interface CreateNotifPayload {
  utilisateurId: string
  type: NotifType
  titre: string
  message: string
}

export default class NotificationService {
  static async create(payload: CreateNotifPayload): Promise<void> {
    await Notification.create({
      utilisateurId: payload.utilisateurId,
      type: payload.type,
      titre: payload.titre,
      message: payload.message,
      estLue: false,
      envoyeeLe: DateTime.now(),
    })
  }
}
