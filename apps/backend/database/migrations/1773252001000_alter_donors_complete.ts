import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donors'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('utilisateur_id').nullable().references('id').inTable('users')
      table.dropColumn('name')
      table.string('code_donneur', 20).unique()
      table.string('prenom', 80)
      table.string('nom', 80)
      table.date('date_naissance').nullable()
      table.enum('groupe_sanguin', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable()
      table.string('commune', 100).nullable()
      table.string('departement', 80).nullable()
      table.integer('total_dons').defaultTo(0)
      table.date('date_dernier_don').nullable()
      table.date('date_eligibilite_suivante').nullable()
      table.enum('niveau_badge', ['aucun', 'bronze', 'argent', 'or', 'platine']).defaultTo('aucun')
      table.text('donnees_qr_code').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('utilisateur_id')
      table.dropColumn('utilisateur_id')
      table.dropColumn('code_donneur')
      table.dropColumn('prenom')
      table.dropColumn('nom')
      table.dropColumn('date_naissance')
      table.dropColumn('groupe_sanguin')
      table.dropColumn('commune')
      table.dropColumn('departement')
      table.dropColumn('total_dons')
      table.dropColumn('date_dernier_don')
      table.dropColumn('date_eligibilite_suivante')
      table.dropColumn('niveau_badge')
      table.dropColumn('donnees_qr_code')
      table.string('name')
    })
  }
}
