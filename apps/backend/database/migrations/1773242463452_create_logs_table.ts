import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Logs extends BaseSchema {

  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id')

      table.string('action')
      table.string('entity')

      table.integer('user_id').nullable()

      table.text('description').nullable()

      table.timestamp('created_at')

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}