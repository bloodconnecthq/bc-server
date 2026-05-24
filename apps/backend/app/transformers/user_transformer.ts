import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return {
      id: this.resource.id,
      nomComplet: this.resource.nomComplet,
      prenom: this.resource.prenom,
      nom: this.resource.nom,
      email: this.resource.email,
      role: this.resource.role,
      telephone: this.resource.telephone,
      commune: this.resource.commune,
      departement: this.resource.departement,
      dateNaissance: this.resource.dateNaissance?.toISO() || null,
      estActif: this.resource.estActif,
      photoProfil: this.resource.photoProfil ?? null,
      creeLe: this.resource.createdAt.toISO(),
      misAJourLe: this.resource.updatedAt?.toISO() || null,
      initials: this.resource.initials,
    }
  }
}
