import type { HttpContext } from '@adonisjs/core/http'
import DonorService from '#services/donor_service'
import { createDonorValidator } from '#validators/create_donor'
import LogService from '#services/logs/log.service'

export default class DonorsController {
  donorService = new DonorService()
  logService = new LogService()
  async index() {
    return await this.donorService.getAll()
  }
  async store({ request, auth }: HttpContext) {
    const data = await request.validateUsing(createDonorValidator)

    const donor = await this.donorService.create(data)

    await this.logService.create('CREATE', 'DONOR', auth.user?.id, `Donor created: ${donor.name}`)

    return donor
  }

  async show({ params }: HttpContext) {
    return await this.donorService.findById(params.id)
  }
}
