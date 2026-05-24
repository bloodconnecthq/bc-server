import type StockSanguin from '#models/stock_sanguin'

export default class StockSanguinTransformer {
  static transform(stock: StockSanguin) {
    return {
      id: stock.id,
      hopitalId: stock.hopitalId,
      groupeSanguin: stock.groupeSanguin,
      quantite: stock.quantite,
      seuilFaible: stock.seuilFaible,
      seuilCritique: stock.seuilCritique,
      misAJourLe: stock.misAJourLe ? new Date(stock.misAJourLe).toISOString() : null,
      niveauAlerte:
        stock.quantite <= stock.seuilCritique
          ? 'critique'
          : stock.quantite <= stock.seuilFaible
            ? 'faible'
            : 'normal',
    }
  }
}
