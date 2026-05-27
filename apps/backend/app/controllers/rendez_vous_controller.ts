import type { HttpContext } from '@adonisjs/core/http'
import RendezVous from '#models/rendez_vous'
import RendezVousTransformer from '#transformers/rendez_vous_transformer'
import Donneur from '#models/donneur'
import NotificationService from '#services/notification_service'
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

    const dateFormatee = DateTime.fromISO(data.dateRdv)
      .setLocale('fr')
      .toLocaleString(DateTime.DATETIME_MED)

    await NotificationService.create({
      utilisateurId: user.id,
      type: 'confirm',
      titre: 'Rendez-vous planifié',
      message: `Votre rendez-vous au ${rdv.hopital?.nom ?? 'centre'} est planifié pour le ${dateFormatee}.`,
    })

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

  // Tout membre d'hôpital peut s'attribuer un RDV non encore pris en charge
  async sAttribuer({ params, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const rdv = await RendezVous.findOrFail(params.id)

    if (rdv.membreId) {
      return response.conflict({ succes: false, erreur: 'Ce rendez-vous a déjà été pris en charge par un autre membre.' })
    }

    rdv.membreId = user.id
    if (rdv.statut === 'planifie') rdv.statut = 'confirme'
    await rdv.save()

    await rdv.load('donneur')
    await rdv.load('hopital')

    // Notifier le donneur
    if (rdv.donneur) {
      const dateRdv = rdv.dateRdv instanceof Date
        ? DateTime.fromJSDate(rdv.dateRdv)
        : typeof rdv.dateRdv === 'string'
          ? DateTime.fromISO(rdv.dateRdv)
          : rdv.dateRdv
      const dateFormatee = dateRdv.setLocale('fr').toLocaleString(DateTime.DATETIME_MED)
      await NotificationService.create({
        utilisateurId: rdv.donneur.utilisateurId,
        type: 'confirm',
        titre: 'Rendez-vous confirmé ✅',
        message: `Votre rendez-vous du ${dateFormatee} au ${rdv.hopital?.nom ?? 'centre'} a été pris en charge et confirmé.`,
      })
    }

    return serialize(RendezVousTransformer.transform(rdv))
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

    await rdv.load('donneur')
    await rdv.load('hopital')

    if (rdv.donneur) {
      const d1 = rdv.dateRdv instanceof Date ? DateTime.fromJSDate(rdv.dateRdv) : typeof rdv.dateRdv === 'string' ? DateTime.fromISO(rdv.dateRdv) : rdv.dateRdv
      const dateFormatee = d1.setLocale('fr').toLocaleString(DateTime.DATETIME_MED)
      await NotificationService.create({
        utilisateurId: rdv.donneur.utilisateurId,
        type: 'confirm',
        titre: 'Rendez-vous confirmé ✅',
        message: `Votre rendez-vous du ${dateFormatee} au ${rdv.hopital?.nom ?? 'centre'} a été confirmé.`,
      })
    }

    return { succes: true, message: 'RDV confirmé' }
  }

  async annuler({ params, auth }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)
    rdv.statut = 'annule'
    await rdv.save()

    await rdv.load('donneur')
    await rdv.load('hopital')

    if (rdv.donneur) {
      const d2 = rdv.dateRdv instanceof Date ? DateTime.fromJSDate(rdv.dateRdv) : typeof rdv.dateRdv === 'string' ? DateTime.fromISO(rdv.dateRdv) : rdv.dateRdv
      const dateFormatee = d2.setLocale('fr').toLocaleString(DateTime.DATETIME_MED)
      await NotificationService.create({
        utilisateurId: rdv.donneur.utilisateurId,
        type: 'urgent',
        titre: 'Rendez-vous annulé',
        message: `Votre rendez-vous du ${dateFormatee} au ${rdv.hopital?.nom ?? 'centre'} a été annulé.`,
      })
    }

    return { succes: true, message: 'RDV annulé' }
  }

  async marquerEffectue({ params }: HttpContext) {
    const rdv = await RendezVous.findOrFail(params.id)
    rdv.statut = 'effectue'
    await rdv.save()

    return { succes: true, message: 'RDV marqué comme effectué' }
  }
}
