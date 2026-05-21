import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'demandes_acces'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.string('nom_demandeur', 150).notNullable()
      table.string('email_demandeur', 150).notNullable()
      table.enum('role_demande', ['medecin', 'infirmier']).notNullable()
      table.text('message').nullable()
      table.enum('statut', ['en_attente', 'approuvee', 'rejetee']).defaultTo('en_attente')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
