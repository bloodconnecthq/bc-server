import type { HttpContext } from '@adonisjs/core/http'
import StockSanguin from '#models/stock_sanguin'
import StockSanguinTransformer from '#transformers/stock_sanguin_transformer'

export default class StocksController {
  async index({ serialize, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role === 'super_admin') {
      const stocks = await StockSanguin.all()
      return serialize(stocks.map((s) => StockSanguinTransformer.transform(s)))
    }

    return response.forbidden({ erreur: 'Accès non autorisé' })
  }

  async showByHopital({ params, serialize }: HttpContext) {
    const stocks = await StockSanguin.query().where('hopital_id', params.hopitalId)
    return serialize(stocks.map((s) => StockSanguinTransformer.transform(s)))
  }

  async update({ params, request, response }: HttpContext) {
    const stock = await StockSanguin.findOrFail(params.id)
    const { quantite } = await request.all()

    stock.quantite = quantite
    stock.misAJourLe = new Date()
    await stock.save()

    return { succes: true, message: 'Stock mis à jour' }
  }
}
