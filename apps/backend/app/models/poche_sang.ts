import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Don from './don.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PocheSang extends BaseModel {
  static table = 'poches_sang'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare donId: string

  @column()
  declare groupeSanguin: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

  @column()
  declare volume: number

  @column()
  declare typePoche: 'DCL' | 'PCL'

  @column()
  declare dateExpiration: Date

  @column()
  declare statut: 'disponible' | 'utilisee' | 'expiree' | 'detruite'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Don)
  declare don: BelongsTo<typeof Don>

  @beforeCreate()
  static assignUuid(poche: PocheSang) {
    poche.id = randomUUID()
  }
}
