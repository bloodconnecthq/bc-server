import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Donor from './donneur.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Badge extends BaseModel {
  static table = 'badges'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare donneurId: string

  @column()
  declare niveau: 'bronze' | 'argent' | 'or' | 'platine'

  @column()
  declare debloqueLe: DateTime | null

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => Donor)
  declare donneur: BelongsTo<typeof Donor>

  @beforeCreate()
  static assignUuid(badge: Badge) {
    badge.id = randomUUID()
  }
}
