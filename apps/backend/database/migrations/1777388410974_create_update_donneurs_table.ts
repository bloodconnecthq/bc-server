import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.renameTable('donors', 'donneurs')

    this.schema.alterTable('donneurs', (table) => {
      table.dropColumn('blood_group')
      table.dropColumn('phone')
    })
  }

  async down() {
    this.schema.alterTable('donneurs', (table) => {
      table.string('blood_group').nullable()
      table.string('phone').nullable()
    })

    this.schema.renameTable('donneurs', 'donors')
  }
}