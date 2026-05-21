import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'membres_hopital'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('prenom')
      table.dropColumn('nom')
      table.dropColumn('est_actif')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.string('prenom', 80).nullable()
      table.string('nom', 80).nullable()
      table.boolean('est_actif').defaultTo(true)
    })
  }
}
