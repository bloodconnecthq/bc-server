import type Donneur from '#models/donneur'

export default class DonorTransformer {
  static transform(donneur: Donneur) {
    const user = donneur.utilisateur

    return {
      id: donneur.id,
      codeDonneur: donneur.codeDonneur,
      groupeSanguin: donneur.groupeSanguin,
      totalDons: donneur.totalDons,
      dateDernierDon: donneur.dateDernierDon?.toISO() ?? null,
      dateEligibiliteSuivante: donneur.dateEligibiliteSuivante?.toISO() ?? null,
      estEligible: donneur.estEligible(),
      niveauBadge: donneur.niveauBadge,
      donneesQrCode: donneur.donneesQrCode,
      statut: !user
        ? 'inactif'
        : !user.estActif
          ? 'suspendu'
          : donneur.totalDons === 0
            ? 'inactif'
            : 'actif',
      utilisateur: user
        ? {
            id: user.id,
            nomComplet: user.nomComplet,
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            telephone: user.telephone,
            commune: user.commune,
            departement: user.departement,
            dateNaissance: user.dateNaissance?.toISO() ?? null,
            estActif: user.estActif,
          }
        : null,
      creeLe: donneur.createdAt.toISO(),
      misAJourLe: donneur.updatedAt.toISO(),
    }
  }
}