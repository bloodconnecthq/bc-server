import type { HttpContext } from '@adonisjs/core/http'
import StockSanguin from '#models/stock_sanguin'
import StockSanguinTransformer from '#transformers/stock_sanguin_transformer'
import Don from '#models/don'
import Hopital from '#models/hopital'
import MembresHopital from '#models/membres_hopital'
import { DateTime } from 'luxon'

export default class StocksController {
  async index({ serialize, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const stocks = await StockSanguin.all()
    return serialize(stocks.map((s) => StockSanguinTransformer.transform(s)))
  }

  async showByHopital({ params, serialize }: HttpContext) {
    const stocks = await StockSanguin.query().where('hopital_id', params.hopitalId)
    return serialize(stocks.map((s) => StockSanguinTransformer.transform(s)))
  }

  async update({ params, request }: HttpContext) {
    const stock = await StockSanguin.findOrFail(params.id)
    const data = request.only(['quantite', 'seuilFaible', 'seuilCritique'])

    if (data.quantite !== undefined) stock.quantite = data.quantite
    if (data.seuilFaible !== undefined) stock.seuilFaible = data.seuilFaible
    if (data.seuilCritique !== undefined) stock.seuilCritique = data.seuilCritique
    stock.misAJourLe = new Date()
    await stock.save()

    return { succes: true, message: 'Stock mis à jour', donnees: StockSanguinTransformer.transform(stock) }
  }

  async resumeNational({ serialize }: HttpContext) {
    const stocks = await StockSanguin.query().preload('hopital')

    const groupesSanguins = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    const resume: Record<string, { quantiteTotale: number; nbHopitaux: number; critique: number; faible: number }> = {}

    for (const gs of groupesSanguins) {
      resume[gs] = { quantiteTotale: 0, nbHopitaux: 0, critique: 0, faible: 0 }
    }

    for (const stock of stocks) {
      const gs = stock.groupeSanguin
      if (resume[gs]) {
        resume[gs].quantiteTotale += stock.quantite
        resume[gs].nbHopitaux += 1
        if (stock.quantite <= stock.seuilCritique) resume[gs].critique += 1
        else if (stock.quantite <= stock.seuilFaible) resume[gs].faible += 1
      }
    }

    return serialize({ succes: true, donnees: resume })
  }

  async alertes({ auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    let query = StockSanguin.query()

    if (['infirmier', 'medecin', 'admin_hopital'].includes(user.role)) {
      const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!membre?.hopitalId) {
        return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
      }
      query = query.where('hopital_id', membre.hopitalId)
    }

    const stocks = await query.preload('hopital')
    const enAlerte = stocks.filter((s) => s.quantite <= s.seuilFaible)

    return serialize(
      enAlerte.map((s) => ({
        ...StockSanguinTransformer.transform(s),
        hopital: s.hopital ? { id: s.hopital.id, nom: s.hopital.nom } : null,
      }))
    )
  }

  async rapportDons({ serialize }: HttpContext) {
    const dons = await Don.query()
      .preload('hopital')
      .orderBy('date_don', 'desc')

    const total = dons.length
    const valides = dons.filter((d) => d.statut === 'valide').length
    const enAttente = dons.filter((d) => d.statut === 'en_attente').length
    const rejetes = dons.filter((d) => d.statut === 'rejete').length

    const parMois: Record<string, number> = {}
    for (const don of dons) {
      const mois = don.createdAt?.toFormat('yyyy-MM') ?? 'inconnu'
      parMois[mois] = (parMois[mois] || 0) + 1
    }

    const parTypePoche: Record<string, number> = {}
    for (const don of dons) {
      parTypePoche[don.typePoche] = (parTypePoche[don.typePoche] || 0) + 1
    }

    return serialize({
      succes: true,
      donnees: {
        total,
        valides,
        enAttente,
        rejetes,
        tauxValidation: total > 0 ? Math.round((valides / total) * 100) : 0,
        parMois,
        parTypePoche,
      },
    })
  }

  async rapportStocks({ serialize }: HttpContext) {
    const hopitaux = await Hopital.query().where('est_actif', true).preload('stocks')

    const rapportParHopital = hopitaux.map((h) => {
      const stocksCritiques = h.stocks.filter((s) => s.quantite <= s.seuilCritique).length
      const stocksFaibles = h.stocks.filter(
        (s) => s.quantite > s.seuilCritique && s.quantite <= s.seuilFaible
      ).length
      const quantiteTotale = h.stocks.reduce((acc, s) => acc + s.quantite, 0)

      return {
        hopitalId: h.id,
        nomHopital: h.nom,
        commune: h.commune,
        quantiteTotale,
        stocksCritiques,
        stocksFaibles,
        stocks: h.stocks.map((s) => StockSanguinTransformer.transform(s)),
      }
    })

    const totalPoches = rapportParHopital.reduce((acc, h) => acc + h.quantiteTotale, 0)
    const hopitauxEnCrise = rapportParHopital.filter((h) => h.stocksCritiques > 0).length

    return serialize({
      succes: true,
      donnees: {
        totalPoches,
        hopitauxEnCrise,
        parHopital: rapportParHopital,
      },
    })
  }

  async rapportPerformance({ serialize }: HttpContext) {
    const [hopitaux, dons] = await Promise.all([
      Hopital.query().where('est_actif', true).preload('dons'),
      Don.query().where('statut', 'valide').preload('donneur'),
    ])

    const parHopital = hopitaux
      .map((h) => ({
        hopitalId: h.id,
        nom: h.nom,
        totalDons: h.dons.length,
        donsValides: h.dons.filter((d) => d.statut === 'valide').length,
      }))
      .sort((a, b) => b.totalDons - a.totalDons)
      .slice(0, 10)

    const donneursActifs: Record<string, number> = {}
    for (const don of dons) {
      const id = don.donneurId
      donneursActifs[id] = (donneursActifs[id] || 0) + 1
    }
    const topDonneurs = Object.entries(donneursActifs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([donneurId, totalDons]) => ({ donneurId, totalDons }))

    const maintenant = DateTime.now()
    const donsParTrimestre: Record<string, number> = {}
    for (const don of dons) {
      const date = don.createdAt
      if (date) {
        const trimestre = `${date.year}-T${Math.ceil(date.month / 3)}`
        donsParTrimestre[trimestre] = (donsParTrimestre[trimestre] || 0) + 1
      }
    }

    return serialize({
      succes: true,
      donnees: {
        topHopitaux: parHopital,
        topDonneurs,
        donsParTrimestre,
        genereLe: maintenant.toISO(),
      },
    })
  }
}
