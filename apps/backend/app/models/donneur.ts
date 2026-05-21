import {
  BaseModel,
  column,
  hasMany,
  belongsTo,
  beforeCreate,
} from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import User from './user.js'
import Don from './don.js'
import Badge from './badge.js'

export default class Donneur extends BaseModel {
  public static table = 'donneurs'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'utilisateur_id' })
  declare utilisateurId: string | null

  @column({ columnName: 'code_donneur' })
  declare codeDonneur: string

  @column({ columnName: 'groupe_sanguin' })
  declare groupeSanguin: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null

  @column({ columnName: 'total_dons' })
  declare totalDons: number

  @column.dateTime({ columnName: 'date_dernier_don' })
  declare dateDernierDon: DateTime | null

  @column.dateTime({ columnName: 'date_eligibilite_suivante' })
  declare dateEligibiliteSuivante: DateTime | null

  @column({ columnName: 'niveau_badge' })
  declare niveauBadge: 'aucun' | 'bronze' | 'argent' | 'or' | 'platine'

  @column({ columnName: 'donnees_qr_code' })
  declare donneesQrCode: string | null

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'utilisateurId' })
  declare utilisateur: BelongsTo<typeof User>

  @hasMany(() => Don, { foreignKey: 'donneurId' })
  declare dons: HasMany<typeof Don>

  @hasMany(() => Badge, { foreignKey: 'donneurId' })
  declare badges: HasMany<typeof Badge>

  @beforeCreate()
  static assignUuid(donneur: Donneur) {
    donneur.id = randomUUID()
  }

  estEligible(): boolean {
    if (!this.dateEligibiliteSuivante) return true
    return this.dateEligibiliteSuivante <= DateTime.now()
  }

  calculerProchaineDonDate(): DateTime {
    return DateTime.now().plus({ days: 90 })
  }

  calculerNiveauBadge(): 'aucun' | 'bronze' | 'argent' | 'or' | 'platine' {
    if (this.totalDons >= 25) return 'platine'
    if (this.totalDons >= 10) return 'or'
    if (this.totalDons >= 4) return 'argent'
    if (this.totalDons >= 1) return 'bronze'
    return 'aucun'
  }
}