import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'

export default class Log extends BaseModel {

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare action: string

  @column()
  declare entity: string

  @column()
  declare userId: string | null

  @column()
  declare description: string | null

  @beforeCreate()
  static assignUuid(log: Log) {
    log.id = randomUUID()
  }

}