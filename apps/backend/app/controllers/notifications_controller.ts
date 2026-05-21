import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const notifications = await Notification.query()
      .where('utilisateur_id', user.id)
      .orderBy('created_at', 'desc')

    return serialize(notifications)
  }

  async marquerLue({ params, response }: HttpContext) {
    const notification = await Notification.findOrFail(params.id)
    notification.estLue = true
    await notification.save()

    return { succes: true, message: 'Notification marquée comme lue' }
  }

  async marquerToutesLues({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await Notification.query()
      .where('utilisateur_id', user.id)
      .where('est_lue', false)
      .update({ estLue: true })

    return { succes: true, message: 'Toutes les notifications marquées comme lues' }
  }
}
