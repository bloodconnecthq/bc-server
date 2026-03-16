import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Donors extends BaseSchema {
  protected tableName = 'donors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name')
      table.string('blood_group')
      table.string('phone')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}