import Donor from '#models/donneur'

export default class DonorService {
  async getAll() {
    return await Donor.query().preload('utilisateur').orderBy('created_at', 'desc')
  }

  async create(data: any) {
    return await Donor.create(data)
  }

  async findById(id: string) {
    return await Donor.findOrFail(id)
  }

  async findByUserId(utilisateurId: string) {
    return await Donor.query()
      .where('utilisateur_id', utilisateurId)
      .preload('utilisateur')
      .firstOrFail()
  }
}
