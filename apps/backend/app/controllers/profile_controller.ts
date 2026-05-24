import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import MembresHopital from '#models/membres_hopital'
import HopitalTransformer from '#transformers/hopital_transformer'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

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

  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const donnees = request.only([
      'nomComplet',
      'nom',
      'prenom',
      'telephone',
      'commune',
      'departement',
      'dateNaissance',
    ])

    const payload: Record<string, any> = {}
    for (const [cle, val] of Object.entries(donnees)) {
      if (val !== undefined) payload[cle] = val
    }

    if (payload.dateNaissance) {
      payload.dateNaissance = DateTime.fromISO(payload.dateNaissance)
    }

    if (payload.nomComplet === undefined && payload.prenom && payload.nom) {
      payload.nomComplet = `${payload.prenom} ${payload.nom}`.trim()
    }

    user.merge(payload)
    await user.save()

    return response.ok({
      succes: true,
      message: 'Profil mis à jour',
      donnees: UserTransformer.transform(user),
    })
  }

  async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { motDePasseActuel, nouveauMotDePasse } = request.only([
      'motDePasseActuel',
      'nouveauMotDePasse',
    ])

    if (!motDePasseActuel || !nouveauMotDePasse) {
      return response.badRequest({
        succes: false,
        erreur: 'motDePasseActuel et nouveauMotDePasse sont requis',
      })
    }

    const correspondance = await hash.verify(user.motDePasse, motDePasseActuel)
    if (!correspondance) {
      return response.status(401).json({
        succes: false,
        erreur: 'Mot de passe actuel incorrect',
      })
    }

    if (nouveauMotDePasse.length < 8) {
      return response.badRequest({
        succes: false,
        erreur: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
      })
    }

    user.motDePasse = nouveauMotDePasse
    await user.save()

    return response.ok({ succes: true, message: 'Mot de passe modifié avec succès' })
  }
}
