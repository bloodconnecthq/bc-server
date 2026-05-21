import type { HttpContext } from '@adonisjs/core/http'
import DonorService from '#services/donor_service'
import { createDonorValidator } from '#validators/create_donor'
import LogService from '#services/logs/log.service'
import DonorTransformer from '#transformers/donor_transformer'

export default class DonorsController {
  donorService = new DonorService()
  logService = new LogService()

  async index({ response }: HttpContext) {
    const donneurs = await this.donorService.getAll()
    return response.ok({ succes: true, donnees: donneurs })
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createDonorValidator)
    const donneur = await this.donorService.create(data)
    await this.logService.create('CREATE', 'DONNEUR', auth.user?.id, `Donneur créé: ${donneur.id}`)
    return response.created({ succes: true, donnees: donneur })
  }

  async show({ params, response }: HttpContext) {
    try {
      const donneur = await this.donorService.findById(params.id)
      return response.ok({ succes: true, donnees: DonorTransformer.transform(donneur) })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Donneur non trouvé' })
    }
  }

  async monProfil({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const donneur = await this.donorService.findByUserId(user.id)
      return response.ok({
        succes: true,
        donnees: DonorTransformer.transform(donneur),
      })
    } catch (_) {
      return response.notFound({
        succes: false,
        erreur: 'Profil donneur non trouvé. Créez votre profil donneur.',
      })
    }
  }
}