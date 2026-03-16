import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db.rawQuery('ALTER TABLE donors MODIFY id VARCHAR(36) NOT NULL DEFAULT (UUID())')
  }

  async down() {
    await this.db.rawQuery('ALTER TABLE donors MODIFY id VARCHAR(36) NOT NULL')
  }
}
