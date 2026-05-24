import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Donor from './donneur.ts'
import User from './user.js'
import Hopital from './hopital.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class RendezVous extends BaseModel {
  static table = 'rendez_vous'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare donneurId: string

  @column()
  declare membreId: string | null

  @column()
  declare hopitalId: string

  @column()
  declare dateRdv: DateTime

  @column()
  declare statut: 'planifie' | 'confirme' | 'annule' | 'effectue'

  @column()
  declare note: string | null

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => Donor)
  declare donneur: BelongsTo<typeof Donor>

  @belongsTo(() => User, { foreignKey: 'membreId' })
  declare membre: BelongsTo<typeof User> | null

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>

  @beforeCreate()
  static assignUuid(rdv: RendezVous) {
    rdv.id = randomUUID()
  }
}
