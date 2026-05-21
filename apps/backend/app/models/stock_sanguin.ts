import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Hopital from './hopital.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class StockSanguin extends BaseModel {
  static table = 'stocks_sanguins'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare hopitalId: string

  @column()
  declare groupeSanguin: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

  @column()
  declare quantite: number

  @column()
  declare seuilFaible: number

  @column()
  declare seuilCritique: number

  @column()
  declare misAJourLe: Date | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>

  @beforeCreate()
  static assignUuid(stock: StockSanguin) {
    stock.id = randomUUID()
  }
}
