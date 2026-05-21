import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'badges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('donneur_id').notNullable().references('id').inTable('donors').onDelete('CASCADE')
      table.enum('niveau', ['bronze', 'argent', 'or', 'platine']).notNullable()
      table.dateTime('debloque_le').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
