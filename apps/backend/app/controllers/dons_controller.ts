import type { HttpContext } from '@adonisjs/core/http'
import Don from '#models/don'
import DonTransformer from '#transformers/don_transformer'
import Donor from '#models/donneur'
import DonorService from '#services/donor_service'
import NotificationService from '#services/notification_service'
import PocheSang from '#models/poche_sang'
import BonDemande from '#models/bon_demande'
import RegistrePsl from '#models/registre_psl'
import { DateTime } from 'luxon'

const BADGE_LABELS: Record<string, string> = {
  bronze: 'Bronze 🥉',
  argent: 'Argent 🥈',
  or: 'Or 🥇',
  platine: 'Platine 💎',
}

export default class DonsController {
  donorService = new DonorService()

  async historiqueMonDonneur({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const donor = await this.donorService.findByUserId(user.id)

      const dons = await Don.query()
        .where('donneur_id', donor.id)
        .preload('hopital')
        .preload('agent')
        .orderBy('date_don', 'desc')

      return dons.map((don) => new DonTransformer(don).toObject())
    } catch (error) {
      return response.status(404).json({
        message: 'Historique des dons non trouvé',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      })
    }
  }

  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const dons = await Don.query()
      .preload('hopital')
      .preload('agent')
      .preload('donneur')
      .orderBy('date_don', 'desc')

    return dons.map((don) => new DonTransformer(don).toObject())
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'infirmier') {
      return response.forbidden({ erreur: 'Seul un infirmier peut enregistrer un don' })
    }

    const data = request.only(['donneurId', 'hopitalId', 'dateDon', 'typePoche', 'volume'])
    const donneur = await Donor.findOrFail(data.donneurId)

    if (
      donneur.dateEligibiliteSuivante &&
      donneur.dateEligibiliteSuivante.toMillis() > DateTime.now().toMillis()
    ) {
      return response.badRequest({
        erreur: `Donneur non éligible. Prochain don le ${donneur.dateEligibiliteSuivante
          .setLocale('fr')
          .toLocaleString(DateTime.DATE_FULL)}`,
      })
    }

    const don = await Don.create({
      ...data,
      dateDon: data.dateDon ? DateTime.fromISO(data.dateDon) : DateTime.now(),
      agentId: user.id,
      statut: 'en_attente',
    })

    await don.load('hopital')
    await don.load('agent')
    await don.load('donneur')

    return new DonTransformer(don).toObject()
  }

  async show({ params }: HttpContext) {
    const don = await Don.query()
      .where('id', params.id)
      .preload('hopital')
      .preload('agent')
      .preload('donneur')
      .firstOrFail()

    return new DonTransformer(don).toObject()
  }

  async valider({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const don = await Don.findOrFail(params.id)
    don.statut = 'valide'
    await don.save()

    const donneur = await Donor.findOrFail(don.donneurId)
    const ancienNiveau = donneur.niveauBadge

    donneur.totalDons += 1
    donneur.dateDernierDon = DateTime.now()
    donneur.dateEligibiliteSuivante = DateTime.now().plus({ days: 90 })
    donneur.niveauBadge = donneur.calculerNiveauBadge()
    await donneur.save()

    // Notification : don validé
    await NotificationService.create({
      utilisateurId: donneur.utilisateurId,
      type: 'confirm',
      titre: 'Don validé ✅',
      message: `Votre don du ${DateTime.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL)} a été validé. Merci pour votre générosité !`,
    })

    // Notification : nouveau badge débloqué
    if (donneur.niveauBadge !== 'aucun' && donneur.niveauBadge !== ancienNiveau) {
      const labelBadge = BADGE_LABELS[donneur.niveauBadge] ?? donneur.niveauBadge
      await NotificationService.create({
        utilisateurId: donneur.utilisateurId,
        type: 'badge',
        titre: `Nouveau badge débloqué : ${labelBadge}`,
        message: `Félicitations ! Vous avez atteint le niveau ${labelBadge} avec ${donneur.totalDons} dons.`,
      })
    }

    // Notification : prochaine date d'éligibilité
    const prochaineDonnee = donneur.dateEligibiliteSuivante.setLocale('fr').toLocaleString(DateTime.DATE_FULL)
    await NotificationService.create({
      utilisateurId: donneur.utilisateurId,
      type: 'eligible',
      titre: 'Prochaine éligibilité',
      message: `Vous pourrez redonner à partir du ${prochaineDonnee}. Nous vous rappellerons à ce moment.`,
    })

    return { succes: true, message: 'Don validé' }
  }

  async rejeter({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const don = await Don.findOrFail(params.id)
    don.statut = 'rejete'
    await don.save()

    const donneur = await Donor.findOrFail(don.donneurId)
    await NotificationService.create({
      utilisateurId: donneur.utilisateurId,
      type: 'urgent',
      titre: 'Don non retenu',
      message: `Votre don du ${DateTime.now().setLocale('fr').toLocaleString(DateTime.DATE_FULL)} n'a pas pu être validé. Veuillez contacter le centre pour plus d'informations.`,
    })

    return { succes: true, message: 'Don rejeté' }
  }

  async statistiques({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const dons = await Don.all()
    const total = dons.length
    const valides = dons.filter((don) => don.statut === 'valide').length
    const enAttente = dons.filter((don) => don.statut === 'en_attente').length
    const rejetes = dons.filter((don) => don.statut === 'rejete').length

    return {
      total,
      valides,
      enAttente,
      rejetes,
      tauxValidation: total > 0 ? Math.round((valides / total) * 100) : 0,
    }
  }

  async poches({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const poches = await PocheSang.query().preload('don').orderBy('date_expiration', 'asc')
    return poches.map((poche) => this.serializePoche(poche))
  }

  async showPoche({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const poche = await PocheSang.query().where('id', params.id).preload('don').firstOrFail()
    return this.serializePoche(poche)
  }

  async pochesExpirantBientot({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['infirmier', 'medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const limite = DateTime.now().plus({ days: 7 }).toJSDate()
    const poches = await PocheSang.query()
      .where('statut', 'disponible')
      .where('date_expiration', '<=', limite)
      .preload('don')
      .orderBy('date_expiration', 'asc')

    return poches.map((poche) => this.serializePoche(poche))
  }

  async bonsDemandeIndex({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    return BonDemande.query().preload('medecin').preload('hopital').orderBy('created_at', 'desc')
  }

  async bonDemandeStore({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'medecin') {
      return response.forbidden({ erreur: 'Seul un médecin peut créer un bon de demande' })
    }

    const data = request.only([
      'hopitalId',
      'nomPatient',
      'groupeSanguinPatient',
      'quantiteNecessaire',
    ])

    return BonDemande.create({
      ...data,
      medecinId: user.id,
      statut: 'en_attente',
    })
  }

  async bonDemandeShow({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    return BonDemande.query()
      .where('id', params.id)
      .preload('medecin')
      .preload('hopital')
      .preload('registrePsl')
      .firstOrFail()
  }

  async bonDemandeSatisfaire({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    bon.statut = 'satisfait'
    await bon.save()

    return { succes: true, message: 'Bon de demande satisfait' }
  }

  async bonDemandeNonSatisfaire({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'medecin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    bon.statut = 'non_satisfait'
    await bon.save()

    return { succes: true, message: 'Bon de demande marqué non satisfait' }
  }

  async enregistrerPsl({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'medecin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    const data = request.only(['motif', 'transfereVers', 'traceLe', 'retourLe'])
    const registre = await RegistrePsl.query().where('bon_demande_id', bon.id).first()

    const payload = {
      bonDemandeId: bon.id,
      motif: data.motif ?? null,
      transfereVers: data.transfereVers ?? null,
      traceLe: data.traceLe ? DateTime.fromISO(data.traceLe) : DateTime.now(),
      retourLe: data.retourLe ? DateTime.fromISO(data.retourLe) : null,
    }

    if (registre) {
      registre.merge(payload)
      await registre.save()
      return registre
    }

    return RegistrePsl.create(payload)
  }

  private serializePoche(poche: PocheSang) {
    return {
      id: poche.id,
      donId: poche.donId,
      groupeSanguin: poche.groupeSanguin,
      volume: poche.volume,
      typePoche: poche.typePoche,
      dateExpiration:
        poche.dateExpiration instanceof Date
          ? poche.dateExpiration.toISOString()
          : poche.dateExpiration,
      statut: poche.statut,
      don: poche.don
        ? {
            id: poche.don.id,
            donneurId: poche.don.donneurId,
            hopitalId: poche.don.hopitalId,
            statut: poche.don.statut,
          }
        : null,
      createdAt: poche.createdAt?.toISO() ?? null,
      updatedAt: poche.updatedAt?.toISO() ?? null,
    }
  }
}
