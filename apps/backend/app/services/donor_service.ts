import Donor from '#models/donor'

export default class DonorService {

  async getAll() {
    return await Donor.all()
  }

  async create(data: any) {
    return await Donor.create(data)
  }

  async findById(id: string) {
    return await Donor.findOrFail(id)
  }

}