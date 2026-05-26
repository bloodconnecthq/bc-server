import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import MembresHopital from '#models/membres_hopital'
import UserTransformer from '#transformers/user_transformer'

export default class UsersController {
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
        ...new UserTransformer(u).toObject(),
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
        ...new UserTransformer(target).toObject(),
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

    return response.ok({ data: new UserTransformer(target).toObject(), succes: true })
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

    return response.ok({ data: new UserTransformer(target).toObject(), succes: true })
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
