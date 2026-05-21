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

  async membres({ params, auth, serialize, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (!['admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membres = await MembresHopital.query().where('hopital_id', params.id)
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

  async dons({ params, auth, serialize, response }: HttpContext) {
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

  async mesDons({ auth, serialize, response }: HttpContext) {
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
      .orderBy('heure_rdv', 'asc')

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
      .orderBy('heure_rdv', 'asc')

    return serialize(rendezVous.map((rdv) => RendezVousTransformer.transform(rdv)))
  }

  async getCentres({ serialize }: HttpContext) {
    const centres = await Hopital.query()
      .select('id', 'nom', 'latitude', 'longitude', 'commune', 'adresse', 'telephone')
      .where('est_actif', true)

    return serialize(centres)
  }
}
