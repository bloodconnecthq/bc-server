import type { HttpContext } from '@adonisjs/core/http'
import RendezVous from '#models/rendez_vous'
import RendezVousTransformer from '#transformers/rendez_vous_transformer'
import Donneur from '#models/donneur'
import { DateTime } from 'luxon'

export default class RendezVousController {
  async index({ serialize }: HttpContext) {
    const rdv = await RendezVous.query()
      .preload('donneur')
      .preload('hopital')
      .orderBy('date_rdv', 'asc')
    return serialize(rdv.map((r) => RendezVousTransformer.transform(r)))
  }

  async store({ request, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const donneur = await Donneur.query().where('utilisateur_id', user.id).first()
    if (!donneur) {
      return response.notFound({ succes: false, erreur: 'Profil donneur introuvable' })
    }

    const data = request.only(['hopitalId', 'dateRdv', 'note'])

    if (!data.hopitalId || !data.dateRdv) {
      return response.badRequest({ succes: false, erreur: 'hopitalId et dateRdv sont requis' })
    }

    const rdv = await RendezVous.create({
      donneurId: donneur.id,
      hopitalId: data.hopitalId,
      dateRdv: DateTime.fromISO(data.dateRdv),
      note: data.note ?? null,
      membreId: null,
      statut: 'planifie',
    })

    await rdv.load('donneur')
    await rdv.load('hopital')

    return serialize(RendezVousTransformer.transform(rdv))
  }

  async show({ params, serialize }: HttpContext) {
    const rdv = await RendezVous.query()
      .where('id', params.id)
      .preload('donneur')
      .preload('hopital')
      .firstOrFail()
    return serialize(RendezVousTransformer.transform(rdv))
  }

  async mesRendezVous({ auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const donneur = await Donneur.query().where('utilisateur_id', user.id).first()
    if (!donneur) {
      return response.notFound({ succes: false, erreur: 'Profil donneur introuvable' })
    }

    const rdv = await RendezVous.query()
      .where('donneur_id', donneur.id)
      .preload('hopital')
      .orderBy('date_rdv', 'desc')

    return serialize(rdv.map((r) => RendezVousTransformer.transform(r)))
  }

  async rendezVousAttribues({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const rdv = await RendezVous.query()
      .where('membre_id', user.id)
      .preload('donneur')
      .preload('hopital')
      .orderBy('date_rdv', 'asc')

    return serialize(rdv.map((r) => RendezVousTransformer.transform(r)))
  }

  async assigner({ params, request, response, serialize }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)

    const membreId = request.input('membreId')
    if (!membreId) {
      return response.badRequest({ succes: false, erreur: 'membreId est requis' })
    }

    rdv.membreId = membreId
    if (rdv.statut === 'planifie') rdv.statut = 'confirme'
    await rdv.save()

    await rdv.load('donneur')
    await rdv.load('hopital')

    return serialize(RendezVousTransformer.transform(rdv))
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

  async marquerEffectue({ params }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)
    rdv.statut = 'effectue'
    await rdv.save()

    return { succes: true, message: 'RDV marqué comme effectué' }
  }
}
