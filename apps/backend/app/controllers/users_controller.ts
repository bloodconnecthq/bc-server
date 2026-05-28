import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import Donneur from '#models/donneur'
import MembresHopital from '#models/membres_hopital'
import UserTransformer from '#transformers/user_transformer'

export default class UsersController {
  async store({ request, auth, response }: HttpContext) {
    const caller = auth.getUserOrFail()
    if (caller.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const {
      prenom, nom, email, motDePasse, telephone,
      commune, departement, role, hopitalId, groupeSanguin, dateNaissance,
    } = request.only([
      'prenom', 'nom', 'email', 'motDePasse', 'telephone',
      'commune', 'departement', 'role', 'hopitalId', 'groupeSanguin', 'dateNaissance',
    ])

    const ROLES = ['donneur', 'infirmier', 'medecin', 'admin_hopital', 'super_admin']
    if (!email || !motDePasse || !role || !ROLES.includes(role)) {
      return response.badRequest({ erreur: 'Email, mot de passe et rôle valide sont requis' })
    }
    if ((motDePasse as string).length < 8) {
      return response.badRequest({ erreur: 'Le mot de passe doit contenir au moins 8 caractères' })
    }

    const existing = await User.findBy('email', email)
    if (existing) return response.conflict({ erreur: 'Cet email est déjà utilisé' })

    const newUser = await User.create({
      prenom:     prenom     ?? null,
      nom:        nom        ?? null,
      nomComplet: `${prenom ?? ''} ${nom ?? ''}`.trim() || null,
      email,
      motDePasse,
      role,
      telephone:  telephone  ?? null,
      commune:    commune    ?? null,
      departement:departement?? null,
      dateNaissance: dateNaissance ? DateTime.fromISO(dateNaissance as string) : null,
      estActif: true,
    })

    if (role === 'donneur') {
      const annee  = new Date().getFullYear()
      const random = Math.floor(10000 + Math.random() * 90000)
      const code   = `BC-${annee}-${random}`
      await Donneur.create({
        utilisateurId: newUser.id,
        codeDonneur:   code,
        groupeSanguin: groupeSanguin ?? null,
        totalDons:     0,
        niveauBadge:   'aucun',
        donneesQrCode: JSON.stringify({ id: newUser.id, code, email }),
      })
    }

    if (['medecin', 'infirmier', 'admin_hopital'].includes(role) && hopitalId) {
      await MembresHopital.create({ utilisateurId: newUser.id, hopitalId })
    }

    return response.created({
      data: UserTransformer.transform(newUser),
      succes: true,
      message: 'Utilisateur créé avec succès',
    })
  }

  async index({ request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const search = request.input('search', '') as string
    const role   = request.input('role', '')   as string
    const statut = request.input('statut', '') as string

    let query = User.query().orderBy('created_at', 'desc')

    if (search) {
      query = query.where((q) => {
        q.whereILike('nom_complet', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('prenom', `%${search}%`)
          .orWhereILike('nom', `%${search}%`)
      })
    }

    if (role) query = query.where('role', role)
    if (statut === 'actif')   query = query.where('est_actif', true)
    if (statut === 'inactif') query = query.where('est_actif', false)

    const users = await query

    // Attach hospital info for hospital members
    const membres = await MembresHopital.query()
      .whereIn('utilisateur_id', users.map((u) => u.id))
      .preload('hopital')

    const membreMap = Object.fromEntries(membres.map((m) => [m.utilisateurId, m]))

    return response.ok({
      data: users.map((u) => ({
        ...UserTransformer.transform(u),
        hopital: membreMap[u.id]?.hopital
          ? { id: membreMap[u.id].hopital.id, nom: membreMap[u.id].hopital.nom }
          : null,
        membreId: membreMap[u.id]?.id ?? null,
      })),
    })
  }

  async show({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const target = await User.findOrFail(params.id)
    const membre = await MembresHopital.query()
      .where('utilisateur_id', target.id)
      .preload('hopital')
      .first()

    return response.ok({
      data: {
        ...UserTransformer.transform(target),
        hopital: membre?.hopital ? { id: membre.hopital.id, nom: membre.hopital.nom } : null,
        membreId: membre?.id ?? null,
      },
    })
  }

  async update({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const target = await User.findOrFail(params.id)
    const data   = request.only(['nomComplet', 'prenom', 'nom', 'email', 'telephone', 'commune', 'departement', 'role', 'estActif'])

    // Check email uniqueness if changing
    if (data.email && data.email !== target.email) {
      const existing = await User.findBy('email', data.email)
      if (existing) return response.conflict({ erreur: 'Cet email est déjà utilisé' })
    }

    target.merge(data)
    await target.save()

    return response.ok({ data: UserTransformer.transform(target), succes: true })
  }

  async updateStatut({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }
    if (params.id === user.id) {
      return response.badRequest({ erreur: 'Vous ne pouvez pas modifier votre propre statut' })
    }

    const target   = await User.findOrFail(params.id)
    target.estActif = request.input('estActif', !target.estActif)
    await target.save()

    return response.ok({ data: UserTransformer.transform(target), succes: true })
  }

  async resetPassword({ params, request, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const nouveauMotDePasse = request.input('nouveauMotDePasse') as string
    if (!nouveauMotDePasse || nouveauMotDePasse.length < 8) {
      return response.badRequest({ erreur: 'Le mot de passe doit contenir au moins 8 caractères' })
    }

    const target      = await User.findOrFail(params.id)
    target.motDePasse = nouveauMotDePasse
    await target.save()

    return response.ok({ succes: true, message: 'Mot de passe réinitialisé avec succès' })
  }

  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }
    if (params.id === user.id) {
      return response.badRequest({ erreur: 'Vous ne pouvez pas supprimer votre propre compte' })
    }

    const target = await User.findOrFail(params.id)

    // Cascade: clean up role-specific records before deleting the user
    if (target.role === 'donneur') {
      const donneur = await Donneur.findBy('utilisateur_id', target.id)
      if (donneur) {
        const { default: Don }   = await import('#models/don')
        const { default: Badge } = await import('#models/badge')
        await Don.query().where('donneur_id', donneur.id).delete()
        await Badge.query().where('donneur_id', donneur.id).delete()
        await donneur.delete()
      }
    } else {
      await MembresHopital.query().where('utilisateur_id', target.id).delete()
    }

    await target.delete()

    return response.ok({ succes: true, message: 'Utilisateur supprimé' })
  }

  async stats({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.role !== 'super_admin') {
      return response.forbidden({ erreur: 'Accès non autorisé' })
    }

    const users = await User.query().select('role', 'est_actif')

    const parRole: Record<string, number> = {}
    let actifs = 0
    let inactifs = 0

    for (const u of users) {
      parRole[u.role] = (parRole[u.role] || 0) + 1
      if (u.estActif) actifs++; else inactifs++
    }

    return response.ok({
      data: {
        total: users.length,
        actifs,
        inactifs,
        parRole,
      },
    })
  }
}
