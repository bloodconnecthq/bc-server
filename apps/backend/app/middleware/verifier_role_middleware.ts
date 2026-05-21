import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware pour vérifier si l'utilisateur a un des rôles autorisés
 * Utilisation : .use(middleware.verifierRole('admin_hopital', 'super_admin'))
 */
export default class VerifierRoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    roles: ('donneur' | 'infirmier' | 'medecin' | 'admin_hopital' | 'super_admin')[]
  ) {
    const user = await ctx.auth.authenticate()

    if (!user || !roles.includes(user.role)) {
      return ctx.response.status(403).json({
        message: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
        role_requis: roles,
        role_utilisateur: user?.role,
      })
    }

    return next()
  }
}
