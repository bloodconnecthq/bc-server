import RendezVous from '#models/rendez_vous'

export default class RendezVousTransformer {
  static transform(rdv: RendezVous) {
    return {
      id: rdv.id,
      dateRdv: rdv.dateRdv,
      statut: rdv.statut,
      note: rdv.note ?? null,
      donneurId: rdv.donneurId,
      membreId: rdv.membreId ?? null,
      hopitalId: rdv.hopitalId,
      donneur: rdv.donneur
        ? {
            id: rdv.donneur.id,
            codeDonneur: rdv.donneur.codeDonneur,
            groupeSanguin: rdv.donneur.groupeSanguin,
          }
        : null,
      membre: rdv.membre
        ? {
            id: (rdv.membre as any).id,
            nomComplet: (rdv.membre as any).nomComplet,
            role: (rdv.membre as any).role,
          }
        : null,
      hopital: rdv.hopital
        ? {
            id: rdv.hopital.id,
            nom: rdv.hopital.nom,
          }
        : null,
      creeLe: rdv.creeLe?.toISO() ?? null,
      misAJourLe: rdv.misAJourLe?.toISO() ?? null,
    }
  }
}
