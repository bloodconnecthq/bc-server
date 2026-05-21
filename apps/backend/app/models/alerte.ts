import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Hopital from './hopital.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Alerte extends BaseModel {
  static table = 'alertes'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare hopitalId: string

  @column()
  declare groupeSanguin: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null

  @column()
  declare type: 'critique' | 'faible' | 'expiration'

  @column()
  declare message: string

  @column()
  declare estResolue: boolean

  @column()
  declare declencheLe: DateTime | null

  @column()
  declare resoleLe: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>

  @beforeCreate()
  static assignUuid(alerte: Alerte) {
    alerte.id = randomUUID()
  }
}
