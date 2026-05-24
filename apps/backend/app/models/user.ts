import { BaseModel, column, beforeCreate, beforeSave, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'crypto'
import Donneur from './donneur.js'

const AvecAuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'mot_de_passe',
})

export default class User extends compose(BaseModel, AvecAuthFinder) {
  static table = 'users'
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nomComplet: string | null

  @column()
  declare nom: string | null

  @column()
  declare prenom: string | null

  @column()
  declare email: string

  @column({ serializeAs: null, columnName: 'mot_de_passe' })
  declare motDePasse: string

  @column()
  declare telephone: string | null

  @column()
  declare commune: string | null

  @column()
  declare departement: string | null

  @column.date({ columnName: 'date_naissance' })
  declare dateNaissance: DateTime | null

  @column()
  declare role: 'donneur' | 'infirmier' | 'medecin' | 'admin_hopital' | 'super_admin'

  @column({ columnName: 'est_actif' })
  declare estActif: boolean

  @column({ columnName: 'photo_profil' })
  declare photoProfil: string | null

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasOne(() => Donneur, { foreignKey: 'utilisateurId' })
  declare donneur: HasOne<typeof Donneur>

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.motDePasse) {
      user.motDePasse = await hash.make(user.motDePasse)
    }
  }

  get initials() {
    const texte = this.nomComplet || `${this.prenom || ''} ${this.nom || ''}`.trim() || this.email
    const morceaux = texte.split(' ').filter(Boolean)
    if (morceaux.length >= 2) {
      return `${morceaux[0][0]}${morceaux[1][0]}`.toUpperCase()
    }
    return texte.slice(0, 2).toUpperCase()
  }
}