import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hopitaux'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('nom', 150).notNullable()
      table.enum('type', ['cnts', 'chu', 'antenne', 'hopital', 'centre', 'mobile']).notNullable()
      table.string('adresse', 255).nullable()
      table.string('commune', 100).nullable()
      table.string('departement', 80).nullable()
      table.string('telephone', 20).nullable()
      table.string('email', 150).nullable()
      table.float('latitude').nullable()
      table.float('longitude').nullable()
      table.boolean('est_actif').defaultTo(false)
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
