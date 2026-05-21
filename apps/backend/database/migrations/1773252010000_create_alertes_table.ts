import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'alertes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.enum('groupe_sanguin', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable()
      table.enum('type', ['critique', 'faible', 'expiration']).notNullable()
      table.text('message').notNullable()
      table.boolean('est_resolue').defaultTo(false)
      table.dateTime('declenchee_le').nullable()
      table.dateTime('resolue_le').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
