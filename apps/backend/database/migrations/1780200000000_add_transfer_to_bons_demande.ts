import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bons_demande'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .uuid('transfere_vers_hopital_id')
        .nullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('SET NULL')
    })

    // Extend statut enum to include 'transfere'
    this.schema.raw(
      `ALTER TABLE bons_demande MODIFY COLUMN statut ENUM('en_attente', 'satisfait', 'non_satisfait', 'transfere') DEFAULT 'en_attente'`
    )
  }

  async down() {
    this.schema.raw(
      `ALTER TABLE bons_demande MODIFY COLUMN statut ENUM('en_attente', 'satisfait', 'non_satisfait') DEFAULT 'en_attente'`
    )
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('transfere_vers_hopital_id')
    })
  }
}
