import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'

export default class Donor extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare bloodGroup: string

  @column()
  declare phone: string

  @beforeCreate()
  static assignUuid(donor: Donor) {
    donor.id = randomUUID()
  }
}
