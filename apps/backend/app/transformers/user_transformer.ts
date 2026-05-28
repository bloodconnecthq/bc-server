import type User from '#models/user'

export default class UserTransformer {
  static transform(user: User) {
    return {
      id: user.id,
      nomComplet: user.nomComplet,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      commune: user.commune,
      departement: user.departement,
      dateNaissance: user.dateNaissance?.toISO() || null,
      estActif: user.estActif,
      photoProfil: user.photoProfil ?? null,
      creeLe: user.createdAt.toISO(),
      misAJourLe: user.updatedAt?.toISO() || null,
      initials: user.initials,
    }
  }
}
