import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('donneur_id').notNullable().references('id').inTable('donors').onDelete('CASCADE')
      table
        .uuid('hopital_id')
        .notNullable()
        .references('id')
        .inTable('hopitaux')
        .onDelete('CASCADE')
      table.uuid('agent_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.dateTime('date_don').notNullable()
      table.enum('type_poche', ['DCL', 'PCL']).notNullable()
      table.integer('volume').unsigned()
      table.enum('statut', ['en_attente', 'valide', 'rejete']).notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
