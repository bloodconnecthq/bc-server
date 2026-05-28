import type Don from '#models/don'

export default class DonTransformer {
  static transform(don: Don) {
    const hopital = don.hopital
    const agent = don.agent
    const donneur = don.donneur

    return {
      id: don.id,
      donneurId: don.donneurId,
      hopitalId: don.hopitalId,
      agentId: don.agentId,
      dateDon: don.createdAt?.toISO() || null,
      typePoche: don.typePoche,
      volume: don.volume,
      statut: don.statut,
      hopital: hopital
        ? { id: hopital.id, nom: hopital.nom, commune: hopital.commune }
        : null,
      agent: agent
        ? { id: agent.id, nomComplet: agent.nomComplet }
        : null,
      donneur: donneur
        ? { id: donneur.id, codeDonneur: donneur.codeDonneur, groupeSanguin: donneur.groupeSanguin }
        : null,
      creeLe: don.createdAt?.toISO() || null,
      misAJourLe: don.updatedAt?.toISO() || null,
    }
  }
}
