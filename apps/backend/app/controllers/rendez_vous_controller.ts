import type { HttpContext } from '@adonisjs/core/http'
import RendezVous from '#models/rendez_vous'

export default class RendezVousController {
  async index({ serialize }: HttpContext) {
    const rdv = await RendezVous.query().orderBy('date_rdv', 'asc')
    return serialize(rdv)
  }

  async store({ request, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.all()

    const rdv = await RendezVous.create({
      ...data,
      donneurId: user.id,
      statut: 'planifie',
    })

    return serialize(rdv)
  }

  async confirmer({ params }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)
    rdv.statut = 'confirme'
    await rdv.save()

    return { succes: true, message: 'RDV confirmé' }
  }

  async annuler({ params }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)
    rdv.statut = 'annule'
    await rdv.save()

    return { succes: true, message: 'RDV annulé' }
  }
}
