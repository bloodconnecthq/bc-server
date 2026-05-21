import type { HttpContext } from '@adonisjs/core/http'
import Alerte from '#models/alerte'

export default class AlertesController {
  async index({ auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const alertes = await Alerte.all()
    return serialize(alertes)
  }

  async resoudre({ params, response }: HttpContext) {
    const alerte = await Alerte.findOrFail(params.id)
    alerte.estResolue = true
    await alerte.save()

    return { succes: true, message: 'Alerte résolue' }
  }
}
