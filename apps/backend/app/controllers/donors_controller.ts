import type { HttpContext } from '@adonisjs/core/http'
import DonorService from '#services/donor_service'
import { createDonorValidator } from '#validators/create_donor'
import LogService from '#services/logs/log.service'
import DonorTransformer from '#transformers/donor_transformer'
import Badge from '#models/badge'
import Don from '#models/don'
import DonTransformer from '#transformers/don_transformer'
import User from '#models/user'
import Donneur from '#models/donneur'
import { DateTime } from 'luxon'

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
      await donneur.load('utilisateur')
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

  async maCarte({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const donneur = await this.donorService.findByUserId(user.id)
      return response.ok({
        succes: true,
        donnees: {
          codeDonneur: donneur.codeDonneur,
          donneesQrCode: donneur.donneesQrCode,
          groupeSanguin: donneur.groupeSanguin,
          niveauBadge: donneur.niveauBadge,
          totalDons: donneur.totalDons,
          estEligible: donneur.estEligible(),
          dateEligibiliteSuivante: donneur.dateEligibiliteSuivante?.toISO() ?? null,
          dateDernierDon: donneur.dateDernierDon?.toISO() ?? null,
          utilisateur: donneur.utilisateur
            ? {
                nomComplet: donneur.utilisateur.nomComplet,
                email: donneur.utilisateur.email,
                telephone: donneur.utilisateur.telephone,
              }
            : null,
        },
      })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Profil donneur non trouvé' })
    }
  }

  async mesBadges({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const donneur = await this.donorService.findByUserId(user.id)
      const badges = await Badge.query()
        .where('donneur_id', donneur.id)
        .orderBy('created_at', 'desc')
      return response.ok({ succes: true, donnees: badges })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Profil donneur non trouvé' })
    }
  }

  async mesDons({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const donneur = await this.donorService.findByUserId(user.id)
      const dons = await Don.query()
        .where('donneur_id', donneur.id)
        .preload('hopital')
        .preload('agent')
        .orderBy('date_don', 'desc')
      return response.ok({
        succes: true,
        donnees: dons.map((don) => new DonTransformer(don).toObject()),
      })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Profil donneur non trouvé' })
    }
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    try {
      const donneur = await this.donorService.findById(params.id)

      if (user.role === 'donneur') {
        const monDonneur = await this.donorService.findByUserId(user.id)
        if (monDonneur.id !== donneur.id) {
          return response.forbidden({ succes: false, erreur: 'Accès non autorisé' })
        }
      }

      const donneesDonneur = request.only(['groupeSanguin'])
      if (donneesDonneur.groupeSanguin !== undefined) {
        donneur.merge(donneesDonneur)
        await donneur.save()
      }

      if (donneur.utilisateurId) {
        const userLie = await User.findOrFail(donneur.utilisateurId)
        const donneesUser = request.only([
          'nomComplet',
          'nom',
          'prenom',
          'telephone',
          'commune',
          'departement',
          'dateNaissance',
        ])
        const payload: Record<string, any> = {}
        for (const [cle, val] of Object.entries(donneesUser)) {
          if (val !== undefined) payload[cle] = val
        }
        if (Object.keys(payload).length > 0) {
          if (payload.dateNaissance) {
            payload.dateNaissance = DateTime.fromISO(payload.dateNaissance)
          }
          userLie.merge(payload)
          await userLie.save()
        }
      }

      await donneur.load('utilisateur')
      return response.ok({ succes: true, donnees: DonorTransformer.transform(donneur) })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Donneur non trouvé' })
    }
  }

  async updateStatut({ params, request, response }: HttpContext) {
    try {
      const donneur = await this.donorService.findById(params.id)

      if (donneur.utilisateurId) {
        const userLie = await User.findOrFail(donneur.utilisateurId)
        userLie.estActif = request.input('estActif', true)
        await userLie.save()
      }

      return response.ok({ succes: true, message: 'Statut du donneur mis à jour' })
    } catch (_) {
      return response.notFound({ succes: false, erreur: 'Donneur non trouvé' })
    }
  }

  async rapportDonneurs({ response }: HttpContext) {
    const donneurs = await Donneur.query().preload('utilisateur')

    const total = donneurs.length
    const actifs = donneurs.filter((d) => d.utilisateur?.estActif).length
    const eligibles = donneurs.filter((d) => d.estEligible()).length
    const ayantDonne = donneurs.filter((d) => d.totalDons > 0).length

    const parGroupeSanguin: Record<string, number> = {}
    for (const d of donneurs) {
      if (d.groupeSanguin) {
        parGroupeSanguin[d.groupeSanguin] = (parGroupeSanguin[d.groupeSanguin] || 0) + 1
      }
    }

    const parNiveauBadge: Record<string, number> = {}
    for (const d of donneurs) {
      const niveau = d.niveauBadge || 'aucun'
      parNiveauBadge[niveau] = (parNiveauBadge[niveau] || 0) + 1
    }

    return response.ok({
      succes: true,
      donnees: {
        total,
        actifs,
        inactifs: total - actifs,
        eligibles,
        nonEligibles: total - eligibles,
        ayantDonne,
        sansDonn: total - ayantDonne,
        parGroupeSanguin,
        parNiveauBadge,
      },
    })
  }
}
