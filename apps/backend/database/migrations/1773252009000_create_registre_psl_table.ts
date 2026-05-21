import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registre_psl'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('bon_demande_id')
        .notNullable()
        .references('id')
        .inTable('bons_demande')
        .onDelete('CASCADE')
      table.text('motif').nullable()
      table.string('transfere_vers', 150).nullable()
      table.dateTime('trace_le').nullable()
      table.dateTime('retour_le').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
