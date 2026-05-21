import { BaseModel, column, hasOne, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import User from './user.js'
import Hopital from './hopital.js'
import RegistrePsl from './registre_psl.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

export default class BonDemande extends BaseModel {
  static table = 'bons_demande'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare medecinId: string

  @column()
  declare hopitalId: string

  @column()
  declare nomPatient: string

  @column()
  declare groupeSanguinPatient: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

  @column()
  declare quantiteNecessaire: number

  @column()
  declare statut: 'en_attente' | 'satisfait' | 'non_satisfait'

  @column.dateTime({ autoCreate: true })
  declare creeLe: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare misAJourLe: DateTime

  @belongsTo(() => User, { foreignKey: 'medecinId' })
  declare medecin: BelongsTo<typeof User>

  @belongsTo(() => Hopital)
  declare hopital: BelongsTo<typeof Hopital>    

  @hasOne(() => RegistrePsl)
  declare registrePsl: HasOne<typeof RegistrePsl>

  @beforeCreate()
  static assignUuid(bon: BonDemande) {
    bon.id = randomUUID()
  }
}
