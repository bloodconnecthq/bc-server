import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'

import User from './user.ts'
import Hopital from './hopital.ts'

export default class MembresHopital extends BaseModel {
  public static table = 'membres_hopital'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare utilisateurId: string

  @column()
  declare hopitalId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'utilisateurId',
  })
  declare utilisateur: BelongsTo<typeof User>

  @belongsTo(() => Hopital, {
    foreignKey: 'hopitalId',
  })
  declare hopital: BelongsTo<typeof Hopital>

  @beforeCreate()
  static assignUuid(membre: MembresHopital) {
    membre.id = randomUUID()
  }
}
