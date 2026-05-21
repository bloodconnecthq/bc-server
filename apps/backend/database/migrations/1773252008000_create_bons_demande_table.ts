import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bons_demande'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('medecin_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.string('nom_patient', 150).notNullable()
      table
        .enum('groupe_sanguin_patient', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .notNullable()
      table.integer('quantite_necessaire').defaultTo(1).unsigned()
      table.enum('statut', ['en_attente', 'satisfait', 'non_satisfait']).defaultTo('en_attente')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
