import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('full_name', 'nom_complet')
      table.renameColumn('password', 'mot_de_passe')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('nom_complet', 'full_name')
      table.renameColumn('mot_de_passe', 'password')
    })
  }
}