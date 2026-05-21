import type Don from '#models/don'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class DonTransformer extends BaseTransformer<Don> {
  toObject() {
    const hopital = this.resource.hopital
    const agent = this.resource.agent
    const donneur = this.resource.donneur

    return {
      id: this.resource.id,
      donneurId: this.resource.donneurId,
      hopitalId: this.resource.hopitalId,
      agentId: this.resource.agentId,
      dateDon: this.resource.createdAt?.toISO() || null,
      typePoche: this.resource.typePoche,
      volume: this.resource.volume,
      statut: this.resource.statut,
      hopital: hopital
        ? {
            id: hopital.id,
            nom: hopital.nom,
            commune: hopital.commune,
          }
        : null,
      agent: agent
        ? {
            id: agent.id,
            nomComplet: agent.nomComplet,
          }
        : null,
      donneur: donneur
        ? {
            id: donneur.id,
            codeDonneur: donneur.codeDonneur,
            groupeSanguin: donneur.groupeSanguin,
          }
        : null,
      creeLe: this.resource.createdAt?.toISO() || null,
      misAJourLe: this.resource.updatedAt?.toISO() || null,
    }
  }
}
