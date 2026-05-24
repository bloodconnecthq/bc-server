import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    // Vider les anciennes notifs avant de changer l'ENUM (données de dev)
    await this.schema.raw(`DELETE FROM ${this.tableName} WHERE type NOT IN ('confirm', 'urgent', 'eligible', 'badge', 'campaign')`)
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} MODIFY COLUMN type ENUM('confirm', 'urgent', 'eligible', 'badge', 'campaign') NOT NULL`
    )
  }

  async down() {
    await this.schema.raw(`DELETE FROM ${this.tableName}`)
    await this.schema.raw(
      `ALTER TABLE ${this.tableName} MODIFY COLUMN type ENUM('rappel', 'alerte', 'confirmation', 'urgence') NOT NULL`
    )
  }
}
