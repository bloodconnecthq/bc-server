import User from '#models/user'
import Donneur from '#models/donneur'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'

export default class NewAccountController {
  async store({ request, response }: HttpContext) {
    try {
      const {
        nomComplet,
        email,
        motDePasse,
        telephone,
        prenom,
        nom,
        groupeSanguin,
        commune,
        departement,
        dateNaissance,
      } = await request.validateUsing(signupValidator)

      // Vérifier email unique
      const existingUser = await User.findBy('email', email)
      if (existingUser) {
        return response.status(409).json({
          succes: false,
          erreur: 'Cet email est déjà utilisé',
        })
      }

      // Vérifier l'âge minimum (18 ans)
      if (dateNaissance) {
        const seuil = new Date()
        seuil.setFullYear(seuil.getFullYear() - 18)
        if (new Date(dateNaissance as any) > seuil) {
          return response.status(422).json({
            succes: false,
            erreur: 'Vous devez avoir au moins 18 ans pour créer un compte.',
          })
        }
      }

      // Créer l'utilisateur avec rôle donneur par défaut
      const user = await User.create({
        nomComplet: nomComplet ?? `${prenom ?? ''} ${nom ?? ''}`.trim(),
        prenom: prenom ?? null,
        nom: nom ?? null,
        email,
        motDePasse,
        role: 'donneur',
        telephone: telephone ?? null,
        commune: commune ?? null,
        departement: departement ?? null,
        dateNaissance: dateNaissance ? DateTime.fromJSDate(new Date(dateNaissance)) : null,
        estActif: true,
      })

      // Créer automatiquement le profil donneur lié
      const annee = new Date().getFullYear()
      const random = Math.floor(10000 + Math.random() * 90000)
      const codeDonneur = `BC-${annee}-${random}`
      const donneurId = randomUUID()

      await Donneur.create({
        id: donneurId,
        utilisateurId: user.id,
        codeDonneur,
        groupeSanguin: groupeSanguin ?? null,
        totalDons: 0,
        niveauBadge: 'aucun',
        dateDernierDon: null,
        dateEligibiliteSuivante: null,
        donneesQrCode: JSON.stringify({
          id: donneurId,
          code: codeDonneur,
          email: user.email,
        }),
      })

      const token = await User.accessTokens.create(user)

      return response.created({
        succes: true,
        message: 'Inscription réussie',
        donnees: {
          utilisateur: UserTransformer.transform(user),
          token: token.value!.release(),
        },
      })
    } catch (error: any) {
      // VineJS validation error: messages is an array of { field, rule, message }
      if (Array.isArray(error.messages)) {
        return response.status(422).json({
          succes: false,
          erreur: error.messages.map((m: any) => m.message).join(' '),
        })
      }

      return response.status(400).json({
        succes: false,
        erreur: error.message || "Erreur lors de l'inscription",
      })
    }
  }
}