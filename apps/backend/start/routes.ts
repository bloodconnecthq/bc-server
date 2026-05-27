/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import DonorsController from '#controllers/donors_controller'
import HopitauxController from '#controllers/hopitaux_controller'
import DonsController from '#controllers/dons_controller'
import AlertesController from '#controllers/alertes_controller'
import StocksController from '#controllers/stocks_controller'
import NotificationsController from '#controllers/notifications_controller'
import RendezVousController from '#controllers/rendez_vous_controller'
import ResultatsController from '#controllers/resultats_controller'
import UsersController from '#controllers/users_controller'

router.get('/', () => {
  return { message: "Bienvenue sur l'API eBloodSys" }
})

router
  .group(() => {
    // ============== AUTHENTIFICATION ==============
    router
      .group(() => {
        router.post('inscription', [controllers.NewAccount, 'store'])
        router.post('connexion', [controllers.AccessToken, 'store'])
        router.post('deconnexion', [controllers.AccessToken, 'destroy']).use(middleware.auth())
        router.get('verifier', [controllers.AccessToken, 'verifier']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    // ============== COMPTE UTILISATEUR ==============
    router
      .group(() => {
        router.get('profil', [controllers.Profile, 'show'])
        router.put('profil', [controllers.Profile, 'update'])
        router.post('photo', [controllers.Profile, 'updatePhoto'])
        router.put('mot-de-passe', [controllers.Profile, 'updatePassword'])
      })
      .prefix('compte')
      .as('compte')
      .use(middleware.auth())

    // ============== DONNEURS ==============
    // ✅ Routes statiques EN PREMIER
    router
      .get('/donneurs/moi/profil', [DonorsController, 'monProfil'])
      .use(middleware.auth(), middleware.verifierRole(['donneur']))

    router
      .get('/donneurs/moi/carte', [DonorsController, 'maCarte'])
      .use(middleware.auth(), middleware.verifierRole(['donneur']))

    router
      .get('/donneurs/moi/badges', [DonorsController, 'mesBadges'])
      .use(middleware.auth(), middleware.verifierRole(['donneur']))

    router
      .get('/donneurs/moi/dons', [DonorsController, 'mesDons'])
      .use(middleware.auth(), middleware.verifierRole(['donneur']))

    // ✅ Routes générales
    router
      .get('/donneurs', [DonorsController, 'index'])
      .use(
        middleware.auth(),
        middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
      )

    router
      .post('/donneurs', [DonorsController, 'store'])
      .use(
        middleware.auth(),
        middleware.verifierRole(['infirmier', 'admin_hopital', 'super_admin'])
      )

    // ✅ Routes avec paramètre EN DERNIER
    router.get('/donneurs/:id', [DonorsController, 'show']).use(middleware.auth())

    router
      .put('/donneurs/:id', [DonorsController, 'update'])
      .use(middleware.auth(), middleware.verifierRole(['donneur', 'admin_hopital', 'super_admin']))

    router
      .patch('/donneurs/:id/statut', [DonorsController, 'updateStatut'])
      .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

    router
      .delete('/donneurs/:id', [DonorsController, 'destroy'])
      .use(middleware.auth(), middleware.verifierRole(['super_admin']))

    // ============== HÔPITAUX ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router.get('', [HopitauxController, 'index']).use(middleware.auth())

        router
          .post('', [HopitauxController, 'store'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .get('avec-stock', [HopitauxController, 'hopitauxAvecStock'])
          .use(middleware.auth())

        router
          .get('moi', [HopitauxController, 'monHopital'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin']))

        router
          .put('moi', [HopitauxController, 'updateMonHopital'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital']))

        router
          .get('moi/membres', [HopitauxController, 'mesMembres'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin']))

        router
          .get('moi/stocks', [HopitauxController, 'mesStocks'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .get('moi/dons', [HopitauxController, 'mesDons'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .get('moi/rendez-vous', [HopitauxController, 'mesRendezVous'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        // ✅ Routes avec paramètre EN DERNIER
        router.get(':id', [HopitauxController, 'show']).use(middleware.auth())

        router
          .put(':id', [HopitauxController, 'update'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .patch(':id/statut', [HopitauxController, 'updateStatut'])
          .use(middleware.auth(), middleware.verifierRole(['super_admin']))

        router
          .get(':id/membres', [HopitauxController, 'membres'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router.get(':id/stocks', [HopitauxController, 'stocks']).use(middleware.auth())

        router.get(':id/dons', [HopitauxController, 'dons']).use(middleware.auth())

        router
          .get(':id/rendez-vous', [HopitauxController, 'rendezVous'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )
      })
      .prefix('hopitaux')
      .as('hopitaux')

    // ============== CENTRES DE COLLECTE ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router.get('proches', [HopitauxController, 'centresProches'])

        // ✅ Routes avec paramètre EN DERNIER
        router.get('', [HopitauxController, 'getCentres'])
        router.get(':id', [HopitauxController, 'detailCentre'])
      })
      .prefix('centres')
      .as('centres')

    // ============== DONS ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('moi/historique', [DonsController, 'historiqueMonDonneur'])
          .use(middleware.auth(), middleware.verifierRole(['donneur']))

        router
          .get('statistiques', [DonsController, 'statistiques'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        // ✅ Routes générales
        router.get('', [DonsController, 'index']).use(middleware.auth())

        router
          .post('', [DonsController, 'store'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'super_admin']))

        // ✅ Routes avec paramètre EN DERNIER
        router.get(':id', [DonsController, 'show']).use(middleware.auth())

        router
          .patch(':id/valider', [DonsController, 'valider'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'super_admin']))

        router
          .patch(':id/rejeter', [DonsController, 'rejeter'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'admin_hopital', 'super_admin'])
          )
      })
      .prefix('dons')
      .as('dons')

    // ============== POCHES DE SANG ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('expirant-bientot', [DonsController, 'pochesExpirantBientot'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        // ✅ Routes générales
        router.get('', [DonsController, 'poches']).use(middleware.auth())

        // ✅ Routes avec paramètre EN DERNIER
        router.get(':id', [DonsController, 'showPoche']).use(middleware.auth())
      })
      .prefix('poches')
      .as('poches')

    // ============== BONS DE DEMANDE ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('', [DonsController, 'bonsDemandeIndex'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'infirmier', 'admin_hopital', 'super_admin'])
          )

        router
          .post('', [DonsController, 'bonDemandeStore'])
          .use(middleware.auth(), middleware.verifierRole(['medecin']))

        router
          .get('recus', [DonsController, 'bonsDemandeRecus'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'infirmier', 'admin_hopital', 'super_admin'])
          )

        // ✅ Routes avec paramètre EN DERNIER
        router
          .get(':id', [DonsController, 'bonDemandeShow'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .patch(':id/satisfaire', [DonsController, 'bonDemandeSatisfaire'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'infirmier', 'admin_hopital'])
          )

        router
          .patch(':id/non-satisfaire', [DonsController, 'bonDemandeNonSatisfaire'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'infirmier', 'admin_hopital'])
          )

        router
          .put(':id', [DonsController, 'bonDemandeUpdate'])
          .use(middleware.auth(), middleware.verifierRole(['medecin']))

        router
          .delete(':id', [DonsController, 'bonDemandeDestroy'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .patch(':id/transferer', [DonsController, 'bonDemandeTransferer'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .patch(':id/decliner', [DonsController, 'bonDemandeDecliner'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['medecin', 'infirmier', 'admin_hopital'])
          )

        router
          .post(':id/psl', [DonsController, 'enregistrerPsl'])
          .use(middleware.auth(), middleware.verifierRole(['medecin']))
      })
      .prefix('bons-demande')
      .as('bonsDemande')

    // ============== STOCKS ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('resume-national', [StocksController, 'resumeNational'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router.get('alertes', [StocksController, 'alertes']).use(middleware.auth())

        // ✅ Routes générales
        router.get('', [StocksController, 'index']).use(middleware.auth())

        // ✅ Routes avec paramètre EN DERNIER
        router.get(':hopitalId', [StocksController, 'showByHopital']).use(middleware.auth())

        router
          .put(':id', [StocksController, 'update'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))
      })
      .prefix('stocks')
      .as('stocks')

    // ============== ALERTES ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('nationales', [AlertesController, 'nationales'])
          .use(middleware.auth(), middleware.verifierRole(['super_admin']))

        // ✅ Routes générales
        router.get('', [AlertesController, 'index']).use(middleware.auth())

        router
          .post('', [AlertesController, 'store'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        // ✅ Routes avec paramètre EN DERNIER
        router
          .patch(':id/resoudre', [AlertesController, 'resoudre'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))
      })
      .prefix('alertes')
      .as('alertes')

    // ============== DEMANDES D'ACCÈS MEMBRES ==============
    router
      .group(() => {
        // ✅ Routes générales
        router
          .get('', [HopitauxController, 'demandesAccesIndex'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router.post('', [HopitauxController, 'demandesAccesStore']).use(middleware.auth())

        // ✅ Routes avec paramètre EN DERNIER
        router
          .patch(':id/approuver', [HopitauxController, 'demandesAccesApprouver'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .patch(':id/rejeter', [HopitauxController, 'demandesAccesRejeter'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .delete(':id', [HopitauxController, 'supprimerMembre'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))
      })
      .prefix('membres/demandes')
      .as('membresdemandes')

    // ============== NOTIFICATIONS ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .patch('tout-lire', [NotificationsController, 'marquerToutesLues'])
          .use(middleware.auth())

        router.put('preferences', [NotificationsController, 'preferences']).use(middleware.auth())

        // ✅ Routes générales
        router.get('', [NotificationsController, 'index']).use(middleware.auth())

        // ✅ Routes avec paramètre EN DERNIER
        router.patch(':id/lire', [NotificationsController, 'marquerLue']).use(middleware.auth())
      })
      .prefix('notifications')
      .as('notifications')

    // ============== RENDEZ-VOUS ==============
    router
      .group(() => {
        // ✅ Routes statiques EN PREMIER
        router
          .get('moi', [RendezVousController, 'mesRendezVous'])
          .use(middleware.auth(), middleware.verifierRole(['donneur']))

        router
          .get('attribues', [RendezVousController, 'rendezVousAttribues'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital']))

        router
          .patch(':id/s-attribuer', [RendezVousController, 'sAttribuer'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital']))

        // ✅ Routes générales
        router
          .get('', [RendezVousController, 'index'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .post('', [RendezVousController, 'store'])
          .use(middleware.auth(), middleware.verifierRole(['donneur']))

        // ✅ Routes avec paramètre EN DERNIER
        router.get(':id', [RendezVousController, 'show']).use(middleware.auth())

        router
          .patch(':id/assigner', [RendezVousController, 'assigner'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .patch(':id/confirmer', [RendezVousController, 'confirmer'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'admin_hopital', 'super_admin'])
          )

        router
          .patch(':id/annuler', [RendezVousController, 'annuler'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['donneur', 'admin_hopital', 'super_admin'])
          )

        router
          .patch(':id/effectue', [RendezVousController, 'marquerEffectue'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital'])
          )
      })
      .prefix('rendez-vous')
      .as('rendezVous')

    // ============== RÉSULTATS DE TESTS BIOLOGIQUES ==============
    router
      .group(() => {
        router
          .post('', [ResultatsController, 'store'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'super_admin']))

        router
          .get('', [ResultatsController, 'show'])
          .use(
            middleware.auth(),
            middleware.verifierRole(['infirmier', 'medecin', 'admin_hopital', 'super_admin'])
          )

        router
          .put('', [ResultatsController, 'update'])
          .use(middleware.auth(), middleware.verifierRole(['infirmier', 'medecin', 'super_admin']))
      })
      .prefix('dons/:donId/resultats')
      .as('resultats')

    // ============== UTILISATEURS ==============
    router
      .group(() => {
        router.get('stats', [UsersController, 'stats'])
        router.get('', [UsersController, 'index'])
        router.get(':id', [UsersController, 'show'])
        router.put(':id', [UsersController, 'update'])
        router.patch(':id/statut', [UsersController, 'updateStatut'])
        router.patch(':id/reset-password', [UsersController, 'resetPassword'])
        router.delete(':id', [UsersController, 'destroy'])
      })
      .prefix('users')
      .as('users')
      .use(middleware.auth(), middleware.verifierRole(['super_admin']))

    // ============== RAPPORTS ==============
    router
      .group(() => {
        router
          .get('dons', [StocksController, 'rapportDons'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .get('donneurs', [DonorsController, 'rapportDonneurs'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .get('stocks', [StocksController, 'rapportStocks'])
          .use(middleware.auth(), middleware.verifierRole(['admin_hopital', 'super_admin']))

        router
          .get('hopitaux', [HopitauxController, 'rapportHopitaux'])
          .use(middleware.auth(), middleware.verifierRole(['super_admin']))

        router
          .get('performance', [StocksController, 'rapportPerformance'])
          .use(middleware.auth(), middleware.verifierRole(['super_admin']))
      })
      .prefix('rapports')
      .as('rapports')
  })
  .prefix('/api/v1')
