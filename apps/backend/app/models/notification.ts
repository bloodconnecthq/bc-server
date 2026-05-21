import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Notification extends BaseModel {
  static table = 'notifications'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare utilisateurId: string

  @column()
  declare type: 'rappel' | 'alerte' | 'confirmation' | 'urgence'

  @column()
  declare titre: string

  @column()
  declare message: string

  @column()
  declare estLue: boolean

  @column()
  declare envoyeeLe: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => User)
  declare utilisateur: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(notif: Notification) {
    notif.id = randomUUID()
  }
}
