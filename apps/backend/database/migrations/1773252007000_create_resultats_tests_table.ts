import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resultats_tests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('don_id').notNullable().references('id').inTable('dons').onDelete('CASCADE')
      table.boolean('vih').defaultTo(false)
      table.boolean('hepatite_b').defaultTo(false)
      table.boolean('hepatite_c').defaultTo(false)
      table.boolean('tpha').defaultTo(false)
      table.boolean('vdl').defaultTo(false)
      table.string('groupe_sanguin_confirme', 5).nullable()
      table.dateTime('teste_le').nullable()
      table.uuid('teste_par').nullable().references('id').inTable('users')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
