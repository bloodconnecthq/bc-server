import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stocks_sanguins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.enum('groupe_sanguin', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).notNullable()
      table.integer('quantite').defaultTo(0)
      table.integer('seuil_faible').defaultTo(10)
      table.integer('seuil_critique').defaultTo(5)
      table.timestamp('mis_a_jour_le').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
