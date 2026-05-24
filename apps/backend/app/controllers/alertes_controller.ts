import type { HttpContext } from '@adonisjs/core/http'
import Alerte from '#models/alerte'
import MembresHopital from '#models/membres_hopital'
import { DateTime } from 'luxon'

export default class AlertesController {
  async index({ auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    let query = Alerte.query().orderBy('created_at', 'desc')

    if (user.role === 'admin_hopital') {
      const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!membre?.hopitalId) {
        return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
      }
      query = query.where('hopital_id', membre.hopitalId)
    }

    const alertes = await query.preload('hopital')
    return serialize(alertes)
  }

  async nationales({ auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const alertes = await Alerte.query()
      .where('est_resolue', false)
      .preload('hopital')
      .orderBy('created_at', 'desc')

    return serialize(alertes)
  }

  async store({ request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const data = request.only(['hopitalId', 'groupeSanguin', 'type', 'message'])

    if (!data.hopitalId || !data.type || !data.message) {
      return response.badRequest({ erreur: 'hopitalId, type et message sont requis' })
    }

    const alerte = await Alerte.create({
      hopitalId: data.hopitalId,
      groupeSanguin: data.groupeSanguin ?? null,
      type: data.type,
      message: data.message,
      estResolue: false,
      declencheLe: DateTime.now(),
      resoleLe: null,
    })

    return serialize(alerte)
  }

  async resoudre({ params }: HttpContext) {
    const alerte = await Alerte.findOrFail(params.id)
    alerte.estResolue = true
    alerte.resoleLe = DateTime.now()
    await alerte.save()

    return { succes: true, message: 'Alerte résolue' }
  }
}
