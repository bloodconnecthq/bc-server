import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import hash from '@adonisjs/core/services/hash'
import Badge from '#models/badge'
import Donneur from '#models/donneur'

export default class AccessTokenController {
  /**
   * Connexion - Crée un token d'accès JWT
   */
  async store({ request, serialize, response }: HttpContext) {
    try {
      const { email, motDePasse } = await request.validateUsing(loginValidator)

      const user = await User.findBy('email', email)
      const badges = await Badge.query().where('donneur_id', user?.id || '')
      const donneur = await Donneur.findBy('utilisateur_id', user?.id || '')

      if (!user) {
        return response.status(401).json({
          message: 'Identifiants invalides',
        })
      }

      // Vérifier le mot de passe avec hash.verify()
      const passwordMatch = await hash.verify(user.motDePasse, motDePasse)
      if (!passwordMatch) {
        return response.status(401).json({
          message: 'Identifiants invalides',
        })
      }

      if (!user.estActif) {
        return response.status(403).json({
          message: "Compte désactivé. Contactez l'administrateur.",
        })
      }

      const token = await User.accessTokens.create(user)
      const userdata = {
        ...user.toJSON(),
        badges: badges,
        donneur: donneur,
      }

      return serialize({
        message: 'Connexion réussie',
        user: userdata,
        token: token.value!.release(),
        authenticated: true,
      })
    } catch (error: any) {
      return response.status(401).json({
        message: 'Identifiants invalides',
        error: error.message,
      })
    }
  }

  /**
   * Déconnexion - Supprime le token d'accès
   */
  /**
   * Déconnexion
   */
  async destroy({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      if (user.currentAccessToken) {
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      }

      return response.ok({
        message: 'Déconnexion réussie',
      })
    } catch (error: any) {
      return response.status(401).json({
        message: 'Erreur lors de la déconnexion',
        error: error.message,
      })
    }
  }

  /**
   * Vérifier l'authentification actuelle
   */
  async verifier({ auth, serialize, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      return serialize({
        message: 'Authentification valide',
        user: UserTransformer.transform(user),
        role: user.role,
      })
    } catch (error) {
      return response.status(401).json({
        message: 'Non authentifié',
        authenticated: false,
      })
    }
  }
}
