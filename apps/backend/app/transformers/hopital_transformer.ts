import type Hopital from '#models/hopital'

export default class HopitalTransformer {
  static transform(hopital: Hopital) {
    return {
      id: hopital.id,
      nom: hopital.nom,
      type: hopital.type,
      adresse: hopital.adresse ?? null,
      commune: hopital.commune ?? null,
      departement: hopital.departement ?? null,
      telephone: hopital.telephone ?? null,
      email: hopital.email ?? null,
      latitude: hopital.latitude ?? null,
      longitude: hopital.longitude ?? null,
      estActif: hopital.estActif,
      createdAt: hopital.created_at?.toISO() ?? null,
      updatedAt: hopital.updated_at?.toISO() ?? null,
    }
  }
}
