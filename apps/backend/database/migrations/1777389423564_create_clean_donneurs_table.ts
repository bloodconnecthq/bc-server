import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donneurs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('commune')
      table.dropColumn('departement')
      table.dropColumn('date_naissance')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('prenom', 80).nullable()
      table.string('nom', 80).nullable()
      table.string('telephone', 20).nullable()
      table.string('commune', 100).nullable()
      table.string('departement', 80).nullable()
      table.date('date_naissance').nullable()
    })
  }
}