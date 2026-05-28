import { BaseModel, column, belongsTo, hasOne, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import Donor from './donneur.ts'
import Hopital from './hopital.js'
import User from './user.js'
import PocheSang from './poche_sang.js'
import ResultatTest from './resultat_test.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

export default class Don extends BaseModel {
  static table = 'dons'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare donneurId: string

  @column()
  declare hopitalId: string

  @column()
  declare agentId: string

  @column()
  declare dateDon: DateTime

  @column()
  declare typePoche: 'DCL' | 'PCL'

  @column()
  declare volume: number

  @column()
  declare statut: 'en_attente' | 'valide' | 'rejete'

  @column()
  declare questionnaireReponses: Record<string, unknown> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Donor)
  declare donneur: BelongsTo<typeof Donor>

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>

  @belongsTo(() => User, { foreignKey: 'agentId' })
  declare agent: BelongsTo<typeof User>

  @hasOne(() => PocheSang)
  declare poche: HasOne<typeof PocheSang>

  @hasOne(() => ResultatTest)
  declare resultat: HasOne<typeof ResultatTest>

  @beforeCreate()
  static assignUuid(don: Don) {
    don.id = randomUUID()
  }
}
