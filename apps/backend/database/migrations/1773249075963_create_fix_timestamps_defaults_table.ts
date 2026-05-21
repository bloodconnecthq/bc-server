import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // ─── DONORS : fix timestamps ───────────────────────────
    await this.db.rawQuery("UPDATE donors SET created_at = NOW() WHERE created_at IS NULL")
    await this.db.rawQuery("UPDATE donors SET updated_at = NOW() WHERE updated_at IS NULL")

    await this.schema.alterTable('donors', (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now()).alter()
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now()).alter()
    })

    // ─── LOGS : fix timestamp ──────────────────────────────
    await this.db.rawQuery("UPDATE logs SET created_at = NOW() WHERE created_at IS NULL")

    await this.schema.alterTable('logs', (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now()).alter()
    })

    // ─── LOGS : migration id int -> uuid ──────────────────
    // uuid_id existe déjà avec des données, on passe directement à la suite

    await this.db.rawQuery("ALTER TABLE logs MODIFY id INT NOT NULL")
    await this.db.rawQuery("ALTER TABLE logs DROP PRIMARY KEY")
    await this.db.rawQuery("ALTER TABLE logs DROP COLUMN id")
    await this.db.rawQuery("ALTER TABLE logs CHANGE uuid_id id VARCHAR(36) NOT NULL")
    await this.db.rawQuery("ALTER TABLE logs ADD PRIMARY KEY (id)")
    await this.db.rawQuery("ALTER TABLE logs MODIFY id VARCHAR(36) NOT NULL DEFAULT (UUID())")
  }

  async down() {
    await this.db.rawQuery("ALTER TABLE logs DROP PRIMARY KEY")
    await this.db.rawQuery("ALTER TABLE logs DROP COLUMN id")
    await this.db.rawQuery("ALTER TABLE logs ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST")

    await this.schema.alterTable('logs', (table) => {
      table.timestamp('created_at').nullable().alter()
    })

    await this.schema.alterTable('donors', (table) => {
      table.timestamp('created_at').nullable().alter()
      table.timestamp('updated_at').nullable().alter()
    })
  }
}