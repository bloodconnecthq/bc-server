import RendezVous from '#models/rendez_vous'

export default class RendezVousTransformer {
  static transform(rdv: RendezVous) {
    return {
      id: rdv.id,
      dateRdv: rdv.dateRdv,
      heureRdv: rdv.heureRdv,
      statut: rdv.statut,
      notes: rdv.notes,
      donneur: rdv.donneur
        ? {
            id: rdv.donneur.id,
            nomComplet: rdv.donneur.nomComplet,
            numeroDonneur: rdv.donneur.numeroDonneur,
            groupeSanguin: rdv.donneur.groupeSanguin,
            telephone: rdv.donneur.telephone,
          }
        : null,
      agent: rdv.agent
        ? {
            id: rdv.agent.id,
            nomComplet: rdv.agent.nomComplet,
            role: rdv.agent.role,
          }
        : null,
      hopital: rdv.hopital
        ? {
            id: rdv.hopital.id,
            nom: rdv.hopital.nom,
          }
        : null,
      createdAt: rdv.createdAt,
      updatedAt: rdv.updatedAt,
    }
  }
}
