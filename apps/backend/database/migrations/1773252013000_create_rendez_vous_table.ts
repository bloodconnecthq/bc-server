import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rendez_vous'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('donneur_id').notNullable().references('id').inTable('donors').onDelete('CASCADE')
      table.uuid('membre_id').nullable().references('id').inTable('users')
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.dateTime('date_rdv').notNullable()
      table.enum('statut', ['planifie', 'confirme', 'annule', 'effectue']).notNullable()
      table.text('note').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
