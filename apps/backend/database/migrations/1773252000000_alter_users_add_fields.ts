import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('role', ['donneur', 'infirmier', 'medecin', 'admin_hopital', 'super_admin'])
        .defaultTo('donneur')
      table.string('telephone', 20).nullable()
      table.boolean('est_actif').defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('telephone')
      table.dropColumn('est_actif')
    })
  }
}
