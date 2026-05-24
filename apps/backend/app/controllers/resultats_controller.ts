import type { HttpContext } from '@adonisjs/core/http'
import ResultatTest from '#models/resultat_test'
import Don from '#models/don'
import PocheSang from '#models/poche_sang'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'

export default class ResultatsController {
  async store({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const don = await Don.findOrFail(params.donId)

    const existant = await ResultatTest.query().where('don_id', don.id).first()
    if (existant) {
      return response.conflict({
        succes: false,
        erreur: 'Des résultats de tests existent déjà pour ce don. Utilisez la mise à jour.',
      })
    }

    const data = request.only([
      'vih',
      'hepatiteB',
      'hepatiteC',
      'tpha',
      'vdl',
      'groupeSanguinConfirme',
      'testeLe',
    ])

    const resultat = await ResultatTest.create({
      id: randomUUID(),
      donId: don.id,
      vih: data.vih ?? false,
      hepatiteB: data.hepatiteB ?? false,
      hepatiteC: data.hepatiteC ?? false,
      tpha: data.tpha ?? false,
      vdl: data.vdl ?? false,
      groupeSanguinConfirme: data.groupeSanguinConfirme ?? null,
      testeLe: data.testeLe ? DateTime.fromISO(data.testeLe) : DateTime.now(),
      testeParId: user.id,
    })

    const estNegatif = resultat.estNegatif()

    if (estNegatif) {
      const groupeSanguin = data.groupeSanguinConfirme as string | undefined

      if (!groupeSanguin) {
        return response.badRequest({
          succes: false,
          erreur: 'groupeSanguinConfirme est requis pour créer la poche (tests négatifs)',
        })
      }

      const dateExpiration = DateTime.now().plus({ days: 42 }).toJSDate()
      await PocheSang.create({
        id: randomUUID(),
        donId: don.id,
        groupeSanguin: groupeSanguin as any,
        volume: don.volume,
        typePoche: don.typePoche,
        dateExpiration,
        statut: 'disponible',
      })
    } else {
      don.statut = 'rejete'
      await don.save()
    }

    return response.created({
      succes: true,
      message: estNegatif
        ? 'Tests négatifs. Poche de sang créée et disponible.'
        : 'Tests positifs. Don rejeté automatiquement.',
      donnees: this.serialiser(resultat),
      pocheCreee: estNegatif,
    })
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const resultat = await ResultatTest.query()
      .where('don_id', params.donId)
      .preload('testeePar')
      .preload('don')
      .first()

    if (!resultat) {
      return response.notFound({ succes: false, erreur: 'Aucun résultat de test pour ce don' })
    }

    return response.ok({ succes: true, donnees: this.serialiser(resultat) })
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const resultat = await ResultatTest.query().where('don_id', params.donId).firstOrFail()

    const data = request.only([
      'vih',
      'hepatiteB',
      'hepatiteC',
      'tpha',
      'vdl',
      'groupeSanguinConfirme',
      'testeLe',
    ])

    const payload: Record<string, any> = {}
    for (const [cle, val] of Object.entries(data)) {
      if (val !== undefined) payload[cle] = val
    }
    if (payload.testeLe) {
      payload.testeLe = DateTime.fromISO(payload.testeLe)
    }

    resultat.merge(payload)
    resultat.testeParId = user.id
    await resultat.save()

    const don = await Don.findOrFail(params.donId)
    const estNegatif = resultat.estNegatif()

    if (!estNegatif && don.statut !== 'rejete') {
      don.statut = 'rejete'
      await don.save()

      await PocheSang.query().where('don_id', don.id).update({ statut: 'detruite' })
    }

    return response.ok({
      succes: true,
      message: 'Résultats mis à jour',
      donnees: this.serialiser(resultat),
    })
  }

  private serialiser(resultat: ResultatTest) {
    return {
      id: resultat.id,
      donId: resultat.donId,
      vih: resultat.vih,
      hepatiteB: resultat.hepatiteB,
      hepatiteC: resultat.hepatiteC,
      tpha: resultat.tpha,
      vdl: resultat.vdl,
      groupeSanguinConfirme: resultat.groupeSanguinConfirme,
      testeLe: resultat.testeLe?.toISO() ?? null,
      testeParId: resultat.testeParId,
      estNegatif: resultat.estNegatif(),
      testeePar: (resultat as any).testeePar
        ? {
            id: (resultat as any).testeePar.id,
            nomComplet: (resultat as any).testeePar.nomComplet,
          }
        : null,
      creeLe: resultat.creeLe?.toISO() ?? null,
    }
  }
}
