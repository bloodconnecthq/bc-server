import type { HttpContext } from '@adonisjs/core/http'
import Don from '#models/don'
import DonTransformer from '#transformers/don_transformer'
import Donor from '#models/donneur'
import DonorService from '#services/donor_service'
import NotificationService from '#services/notification_service'
import PocheSang from '#models/poche_sang'
import BonDemande from '#models/bon_demande'
import RegistrePsl from '#models/registre_psl'
import MembresHopital from '#models/membres_hopital'
import StockSanguin from '#models/stock_sanguin'
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

    if (!['infirmier', 'medecin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const data = request.only(['donneurId', 'hopitalId', 'dateDon', 'typePoche', 'volume', 'questionnaireReponses'])
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

  // ── Helper : serialize a bon with stock info ─────────────────────────────────

  private async serializeBonAvecStock(bon: BonDemande, hopitalId: string) {
    const stock = await StockSanguin.query()
      .where('hopital_id', hopitalId)
      .where('groupe_sanguin', bon.groupeSanguinPatient)
      .first()

    const stockDisponible = stock?.quantite ?? 0
    return {
      id: bon.id,
      medecinId: bon.medecinId,
      hopitalId: bon.hopitalId,
      nomPatient: bon.nomPatient,
      groupeSanguinPatient: bon.groupeSanguinPatient,
      quantiteNecessaire: bon.quantiteNecessaire,
      statut: bon.statut,
      transfereVersHopitalId: bon.transfereVersHopitalId,
      transfereVers: bon.transfereVers
        ? { id: bon.transfereVers.id, nom: bon.transfereVers.nom }
        : null,
      stockDisponible,
      peutEtreSatisfait: stockDisponible >= bon.quantiteNecessaire,
      medecin: bon.medecin ? { id: bon.medecin.id, nomComplet: bon.medecin.nomComplet } : null,
      hopital: bon.hopital ? { id: bon.hopital.id, nom: bon.hopital.nom } : null,
      creeLe: bon.creeLe?.toISO() ?? null,
    }
  }

  // ── Bons de demande ───────────────────────────────────────────────────────────

  async bonsDemandeIndex({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin', 'infirmier'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    let hopitalId: string | null = null

    if (user.role !== 'super_admin') {
      const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
      if (!membre?.hopitalId) {
        return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
      }
      hopitalId = membre.hopitalId
    }

    const query = BonDemande.query()
      .preload('medecin')
      .preload('hopital')
      .preload('transfereVers')
      .orderBy('created_at', 'desc')

    if (hopitalId) query.where('hopital_id', hopitalId)

    const bons = await query
    return Promise.all(bons.map((bon) => this.serializeBonAvecStock(bon, hopitalId ?? bon.hopitalId)))
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

    const bon = await BonDemande.create({
      ...data,
      medecinId: user.id,
      statut: 'en_attente',
    })

    await bon.load('medecin')
    await bon.load('hopital')
    return this.serializeBonAvecStock(bon, data.hopitalId)
  }

  async bonDemandeTransferer({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const { hopitalId: hopitalCibleId } = request.only(['hopitalId'])
    if (!hopitalCibleId) {
      return response.badRequest({ erreur: 'hopitalId cible requis' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    bon.statut = 'transfere'
    bon.transfereVersHopitalId = hopitalCibleId
    await bon.save()

    return { succes: true, message: 'Bon transféré vers un autre hôpital' }
  }

  async bonsDemandeRecus({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'infirmier', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const membre = await MembresHopital.query().where('utilisateur_id', user.id).first()
    if (!membre?.hopitalId) {
      return response.forbidden({ erreur: "Vous n'êtes membre d'aucun hôpital" })
    }

    const bons = await BonDemande.query()
      .where('transfere_vers_hopital_id', membre.hopitalId)
      .preload('medecin')
      .preload('hopital')
      .preload('transfereVers')
      .orderBy('created_at', 'desc')

    return Promise.all(bons.map((bon) => this.serializeBonAvecStock(bon, membre.hopitalId)))
  }

  async bonDemandeUpdate({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (user.role !== 'medecin') {
      return response.forbidden({ erreur: 'Seul un médecin peut modifier un bon de demande' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    if (bon.statut !== 'en_attente') {
      return response.badRequest({ erreur: 'Seul un bon en attente peut être modifié' })
    }

    const data = request.only(['nomPatient', 'groupeSanguinPatient', 'quantiteNecessaire'])
    bon.merge(data)
    await bon.save()
    await bon.load('medecin')
    await bon.load('hopital')
    return this.serializeBonAvecStock(bon, bon.hopitalId)
  }

  async bonDemandeDestroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'super_admin'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    if (bon.statut !== 'en_attente') {
      return response.badRequest({ erreur: 'Seul un bon en attente peut être supprimé' })
    }

    await bon.delete()
    return { succes: true }
  }

  async bonDemandeDecliner({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!['medecin', 'admin_hopital', 'infirmier'].includes(user.role)) {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const bon = await BonDemande.findOrFail(params.id)
    bon.statut = 'en_attente'
    bon.transfereVersHopitalId = null
    await bon.save()

    return { succes: true, message: 'Transfert décliné — bon remis en attente' }
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
