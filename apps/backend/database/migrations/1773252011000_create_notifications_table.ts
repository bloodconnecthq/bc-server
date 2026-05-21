import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('utilisateur_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.enum('type', ['rappel', 'alerte', 'confirmation', 'urgence']).notNullable()
      table.string('titre', 150).notNullable()
      table.text('message').notNullable()
      table.boolean('est_lue').defaultTo(false)
      table.dateTime('envoyee_le').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
