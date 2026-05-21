import type StockSanguin from '#models/stock_sanguin'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class StockSanguinTransformer extends BaseTransformer<StockSanguin> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'hopitalId',
      'groupeSanguin',
      'quantite',
      'seuilFaible',
      'seuilCritique',
      'creeLe',
      'misAJourLe',
    ])
  }
}
