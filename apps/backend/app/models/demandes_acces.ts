import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Hopital from './hopital.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DemandesAcces extends BaseModel {
  static table = 'demandes_acces'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare hopitalId: string

  @column()
  declare nomDemandeur: string

  @column()
  declare emailDemandeur: string

  @column()
  declare roleDemande: 'medecin' | 'infirmier'

  @column()
  declare message: string | null

  @column()
  declare statut: 'en_attente' | 'approuvee' | 'rejetee'

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>

  @beforeCreate()
  static assignUuid(demande: DemandesAcces) {
    demande.id = randomUUID()
  }
}
