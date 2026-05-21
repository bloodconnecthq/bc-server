import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import MembresHopital from './membres_hopital.ts'
import StockSanguin from './stock_sanguin.ts'
import Don from './don.ts'
import Alerte from './alerte.ts'
import RendezVous from './rendez_vous.ts'
import BonDemande from './bon_demande.ts'
import DemandesAcces from './demandes_acces.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Hopital extends BaseModel {
  static table = 'hopitaux'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nom: string

  @column()
  declare type: 'cnts' | 'chu' | 'antenne' | 'hopital' | 'centre' | 'mobile'

  @column()
  declare adresse: string | null

  @column()
  declare commune: string | null

  @column()
  declare departement: string | null

  @column()
  declare telephone: string | null

  @column()
  declare email: string | null

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare estActif: boolean

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @hasMany(() => MembresHopital, { foreignKey: 'hopitalId' })
  declare membres: HasMany<typeof MembresHopital>

  @hasMany(() => StockSanguin, { foreignKey: 'hopitalId' })
  declare stocks: HasMany<typeof StockSanguin>

  @hasMany(() => Don, { foreignKey: 'hopitalId' })
  declare dons: HasMany<typeof Don>

  @hasMany(() => Alerte, { foreignKey: 'hopitalId' })
  declare alertes: HasMany<typeof Alerte>

  @hasMany(() => RendezVous, { foreignKey: 'hopitalId' })
  declare rendezVous: HasMany<typeof RendezVous>

  @hasMany(() => BonDemande, { foreignKey: 'hopitalId' })
  declare bonsDemande: HasMany<typeof BonDemande>

  @hasMany(() => DemandesAcces, { foreignKey: 'hopitalId' })
  declare demandesAcces: HasMany<typeof DemandesAcces>

  @beforeCreate()
  static assignUuid(hopital: Hopital) {
    hopital.id = randomUUID()
  }
}
