import Notification from '#models/notification'
import { DateTime } from 'luxon'

function toISO(val: DateTime | Date | string | null | undefined): string {
  if (!val) return new Date().toISOString()
  if (val instanceof DateTime) return val.toISO() ?? new Date().toISOString()
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export default class NotificationTransformer {
  static transform(n: Notification) {
    return {
      id: n.id,
      type: n.type,
      title: n.titre,
      message: n.message,
      date: toISO(n.envoyeeLe ?? n.creeLe),
      read: n.estLue,
    }
  }
}
