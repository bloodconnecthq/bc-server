import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import BonDemande from './bon_demande.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class RegistrePsl extends BaseModel {
  static table = 'registre_psl'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare bonDemandeId: string

  @column()
  declare motif: string | null

  @column()
  declare transfereVers: string | null

  @column()
  declare traceLe: DateTime | null

  @column()
  declare retourLe: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => BonDemande)
  declare bonDemande: BelongsTo<typeof BonDemande>

  @beforeCreate()
  static assignUuid(psl: RegistrePsl) {
    psl.id = randomUUID()
  }
}
