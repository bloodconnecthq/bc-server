import type { HttpContext } from '@adonisjs/core/http'
import Hopital from '#models/hopital'
import HopitalTransformer from '#transformers/hopital_transformer'
import StockSanguin from '#models/stock_sanguin'
import StockSanguinTransformer from '#transformers/stock_sanguin_transformer'
import Don from '#models/don'
import DonTransformer from '#transformers/don_transformer'
import MembresHopital from '#models/membres_hopital'
import RendezVous from '#models/rendez_vous'
import RendezVousTransformer from '#transformers/rendez_vous_transformer'
import DemandesAcces from '#models/demandes_acces'
import User from '#models/user'
import { randomUUID } from 'crypto'

export default class HopitauxController {
  async index({ serialize }: HttpContext) {
    const hopitaux = await Hopital.all()
    return serialize(hopitaux.map((h) => HopitalTransformer.transform(h)))
  }

  async store({ request, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const hopital = await Hopital.create(await request.all())
    return serialize(HopitalTransformer.transform(hopital))
  }

  async show({ params, serialize }: HttpContext) {
    const hopital = await Hopital.findOrFail(params.id)
    return serialize(HopitalTransformer.transform(hopital))
  }

  async update({ params, request, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const hopital = await Hopital.findOrFail(params.id)

    if (user.role !== 'super_admin' && user.role !== 'admin_hopital') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    hopital.merge(await request.all())
    await hopital.save()

    return serialize(HopitalTransformer.transform(hopital))
  }

  async updateStatut({ params, request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const hopital = await Hopital.findOrFail(params.id)
    hopital.estActif = request.input('estActif', true)
    await hopital.save()

    return serialize(HopitalTransformer.transform(hopital))
  }

  async hopitauxAvecStock({ request, auth, response }: HttpContext) {
    auth.getUserOrFail()

    const groupeSanguin = request.input('groupeSanguin')
    const quantite = Number(request.input('quantite', 1))

    if (!groupeSanguin) {
      return response.badRequest({ erreur: 'groupeSanguin requis' })
    }

    const stocks = await StockSanguin.query()
      .where('groupe_sanguin', groupeSanguin)
      .where('quantite', '>=', quantite)
      .preload('hopital')

    return stocks
      .filter((s) => s.hopital)
      .map((s) => ({
        id: s.hopital.id,
        nom: s.hopital.nom,
        commune: s.hopital.commune,
        adresse: s.hopital.adresse,
        telephone: s.hopital.telephone,
        stock: {
          quantite: s.quantite,
          seuilFaible: s.seuilFaible,
          seuilCritique: s.seuilCritique,
        },
      }))
  }

  async membres({ params, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membres = await MembresHopital.query()
      .where('hopital_id', params.id)
      .preload('utilisateur')
    return serialize(membres)
  }

  async stocks({ params, serialize }: HttpContext) {
    const stocks = await StockSanguin.query().where('hopital_id', params.id)
    return serialize(stocks.map((stock) => StockSanguinTransformer.transform(stock)))
  }

  async mesStocks({ auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()

    if (!membre?.hopitalId) {
      return response.forbidden({
        erreur: "Vous n'êtes membre d'aucun hôpital. Veuillez vérifier votre affiliation.",
      })
    }

    const stocks = await StockSanguin.query().where('hopital_id', membre.hopitalId)
    return serialize(stocks.map((stock) => StockSanguinTransformer.transform(stock)))
  }

  async dons({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const dons = await Don.query()
      .where('hopital_id', params.id)
      .preload('hopital')
      .preload('agent')
      .preload('donneur')
      .orderBy('date_don', 'desc')
      .limit(10)

    return dons.map((don) => new DonTransformer(don).toObject())
  }

  async mesDons({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()

    if (!membre?.hopitalId) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const dons = await Don.query()
      .where('hopital_id', membre.hopitalId)
      .preload('hopital')
      .preload('agent')
      .preload('donneur')
      .orderBy('date_don', 'desc')
      .limit(10)

    return dons.map((don) => new DonTransformer(don).toObject())
  }

  async rendezVous({ params, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const rendezVous = await RendezVous.query()
      .where('hopital_id', params.id)
      .preload('donneur')
      .orderBy('date_rdv', 'asc')

    return serialize(rendezVous.map((rdv) => RendezVousTransformer.transform(rdv)))
  }

  async mesRendezVous({ auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()

    if (!membre?.hopitalId) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const rendezVous = await RendezVous.query()
      .where('hopital_id', membre.hopitalId)
      .preload('donneur')
      .orderBy('date_rdv', 'asc')

    return serialize(rendezVous.map((rdv) => RendezVousTransformer.transform(rdv)))
  }

  async getCentres({ serialize }: HttpContext) {
    const centres = await Hopital.query()
      .select('id', 'nom', 'latitude', 'longitude', 'commune', 'adresse', 'telephone', 'type')
      .where('est_actif', true)

    return serialize(centres)
  }

  async centresProches({ request, serialize }: HttpContext) {
    const lat = parseFloat(request.input('latitude', 0))
    const lon = parseFloat(request.input('longitude', 0))
    const rayon = parseFloat(request.input('rayon', 50))

    const centres = await Hopital.query()
      .select('id', 'nom', 'latitude', 'longitude', 'commune', 'adresse', 'telephone', 'type')
      .where('est_actif', true)
      .whereNotNull('latitude')
      .whereNotNull('longitude')

    const avecDistance = centres
      .map((c) => {
        const dLat = ((c.latitude! - lat) * Math.PI) / 180
        const dLon = ((c.longitude! - lon) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat * Math.PI) / 180) *
            Math.cos((c.latitude! * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2
        const distanceKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return { ...c.toJSON(), distanceKm: Math.round(distanceKm * 10) / 10 }
      })
      .filter((c) => c.distanceKm <= rayon)
      .sort((a, b) => a.distanceKm - b.distanceKm)

    return serialize(avecDistance)
  }

  async detailCentre({ params, serialize }: HttpContext) {
    const centre = await Hopital.query()
      .where('id', params.id)
      .where('est_actif', true)
      .preload('stocks')
      .firstOrFail()

    const stocksDisponibles = centre.stocks.map((s) => StockSanguinTransformer.transform(s))

    return serialize({
      ...HopitalTransformer.transform(centre),
      stocks: stocksDisponibles,
    })
  }

  async demandesAccesIndex({ auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()

    let query = DemandesAcces.query().preload('hopital').orderBy('created_at', 'desc')

    if (user.role === 'admin_hopital') {
      const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!membre?.hopitalId) {
        return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
      }
      query = query.where('hopital_id', membre.hopitalId)
    }

    const demandes = await query
    return serialize(demandes)
  }

  async demandesAccesStore({ request, serialize }: HttpContext) {
    const data = request.only([
      'hopitalId',
      'nomDemandeur',
      'emailDemandeur',
      'roleDemande',
      'message',
    ])

    const demande = await DemandesAcces.create({
      hopitalId: data.hopitalId,
      nomDemandeur: data.nomDemandeur,
      emailDemandeur: data.emailDemandeur,
      roleDemande: data.roleDemande,
      message: data.message ?? null,
      statut: 'en_attente',
    })

    return serialize(demande)
  }

  async demandesAccesApprouver({ params, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await DemandesAcces.findOrFail(params.id)

    if (user.role === 'admin_hopital') {
      const monMembre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!monMembre || monMembre.hopitalId !== demande.hopitalId) {
        return response.forbidden({ erreur: 'Cette demande ne concerne pas votre hôpital' })
      }
    }

    demande.statut = 'approuvee'
    await demande.save()

    const candidat = await User.findBy('email', demande.emailDemandeur)

    if (candidat) {
      candidat.role = demande.roleDemande
      await candidat.save()

      const membreExistant = await MembresHopital.query()
        .where('utilisateur_id', candidat.id)
        .where('hopital_id', demande.hopitalId)
        .first()

      if (!membreExistant) {
        await MembresHopital.create({
          id: randomUUID(),
          utilisateurId: candidat.id,
          hopitalId: demande.hopitalId,
        })
      }
    }

    return serialize({
      succes: true,
      message: candidat
        ? `Demande approuvée. ${candidat.nomComplet || candidat.email} a été ajouté comme membre.`
        : 'Demande approuvée. Le membre pourra rejoindre après son inscription.',
      membreAjoute: !!candidat,
    })
  }

  async demandesAccesRejeter({ params, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const demande = await DemandesAcces.findOrFail(params.id)

    if (user.role === 'admin_hopital') {
      const monMembre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!monMembre || monMembre.hopitalId !== demande.hopitalId) {
        return response.forbidden({ erreur: 'Cette demande ne concerne pas votre hôpital' })
      }
    }

    demande.statut = 'rejetee'
    await demande.save()

    return serialize({ succes: true, message: 'Demande rejetée' })
  }

  async monHopital({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const membre = await MembresHopital.query()
      .where('utilisateur_id', user.id)
      .preload('hopital')
      .first()

    if (!membre?.hopital) {
      return response.notFound({ erreur: "Vous n'êtes membre d'aucun hôpital" })
    }

    return response.ok({ data: HopitalTransformer.transform(membre.hopital) })
  }

  async updateMonHopital({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'admin_hopital') {
      return response.forbidden({ erreur: "Seul l'administrateur de l'hôpital peut modifier ces informations" })
    }

    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
    if (!membre?.hopitalId) {
      return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
    }

    const hopital = await Hopital.findOrFail(membre.hopitalId)
    const data = request.only(['nom', 'adresse', 'commune', 'departement', 'telephone', 'email'])
    hopital.merge(data)
    await hopital.save()

    return response.ok({ data: HopitalTransformer.transform(hopital), succes: true })
  }

  async mesMembres({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()

    if (!membre?.hopitalId) {
      return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
    }

    const membres = await MembresHopital.query()
      .where('hopital_id', membre.hopitalId)
      .preload('utilisateur')

    return response.ok({
      data: membres.map((m) => ({
        id: m.id,
        utilisateurId: m.utilisateurId,
        hopitalId: m.hopitalId,
        utilisateur: m.utilisateur
          ? {
              id: m.utilisateur.id,
              nomComplet: m.utilisateur.nomComplet,
              email: m.utilisateur.email,
              role: m.utilisateur.role,
              telephone: m.utilisateur.telephone,
            }
          : null,
      })),
    })
  }

  async supprimerMembre({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const membre = await MembresHopital.findOrFail(params.id)

    if (user.role === 'admin_hopital') {
      const monMembre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!monMembre || monMembre.hopitalId !== membre.hopitalId) {
        return response.forbidden({ erreur: 'Accès non autorisé' })
      }
    }

    await membre.delete()
    return { succes: true, message: 'Membre supprimé de l\'hôpital' }
  }

  async rapportHopitaux({ serialize }: HttpContext) {
    const hopitaux = await Hopital.query().preload('membres').preload('dons')

    const total = hopitaux.length
    const actifs = hopitaux.filter((h) => h.estActif).length

    const parType: Record<string, number> = {}
    for (const h of hopitaux) {
      parType[h.type] = (parType[h.type] || 0) + 1
    }

    const parDepartement: Record<string, number> = {}
    for (const h of hopitaux) {
      if (h.departement) {
        parDepartement[h.departement] = (parDepartement[h.departement] || 0) + 1
      }
    }

    const parActivite = hopitaux
      .map((h) => ({
        hopitalId: h.id,
        nom: h.nom,
        commune: h.commune,
        totalMembres: h.membres.length,
        totalDons: h.dons.length,
      }))
      .sort((a, b) => b.totalDons - a.totalDons)

    return serialize({
      succes: true,
      donnees: {
        total,
        actifs,
        inactifs: total - actifs,
        parType,
        parDepartement,
        parActivite,
      },
    })
  }
}
