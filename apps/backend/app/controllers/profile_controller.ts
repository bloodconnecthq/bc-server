import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import MembresHopital from '#models/membres_hopital'
import HopitalTransformer from '#transformers/hopital_transformer'

export default class ProfileController {
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const profile = UserTransformer.transform(user)

    if (['infirmier', 'medecin', 'admin_hopital'].includes(user.role)) {
      const membre = await MembresHopital.query()
        .where('utilisateur_id', user.id)
        .preload('hopital')
        .first()

      if (membre) {
        const hopital = membre.hopital ? HopitalTransformer.transform(membre.hopital) : null
        return response.ok({
          data: {
            ...profile,
            hopitalId: membre.hopitalId,
            roleMembre: user.role,
            hopital,
          },
        })
      }
    }

    return response.ok({ data: profile })
  }
}
