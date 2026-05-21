import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'poches_sang'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('don_id').notNullable().references('id').inTable('dons').onDelete('CASCADE')
      table.enum('groupe_sanguin', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).notNullable()
      table.integer('volume').unsigned()
      table.enum('type_poche', ['DCL', 'PCL']).notNullable()
      table.date('date_expiration').notNullable()
      table.enum('statut', ['disponible', 'utilisee', 'expiree', 'detruite']).notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
