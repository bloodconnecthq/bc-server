import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Don from './don.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ResultatTest extends BaseModel {
  static table = 'resultats_tests'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare donId: string

  @column()
  declare vih: boolean

  @column()
  declare hepatiteB: boolean

  @column()
  declare hepatiteC: boolean

  @column()
  declare tpha: boolean

  @column()
  declare vdl: boolean

  @column()
  declare groupeSanguinConfirme: string | null

  @column()
  declare testeLe: DateTime | null

  @column()
  declare testeParId: string | null

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => Don)
  declare don: BelongsTo<typeof Don>

  @belongsTo(() => User, { foreignKey: 'testeParId' })
  declare testeePar: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(test: ResultatTest) {
    test.id = randomUUID()
  }
}
