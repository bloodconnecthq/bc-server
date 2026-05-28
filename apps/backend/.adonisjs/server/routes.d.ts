import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'auth.access_token.verifier': { paramsTuple?: []; params?: {} }
    'compte.profile.show': { paramsTuple?: []; params?: {} }
    'compte.profile.update': { paramsTuple?: []; params?: {} }
    'compte.profile.update_photo': { paramsTuple?: []; params?: {} }
    'compte.profile.update_password': { paramsTuple?: []; params?: {} }
    'donors.mon_profil': { paramsTuple?: []; params?: {} }
    'donors.ma_carte': { paramsTuple?: []; params?: {} }
    'donors.mes_badges': { paramsTuple?: []; params?: {} }
    'donors.mes_dons': { paramsTuple?: []; params?: {} }
    'donors.index': { paramsTuple?: []; params?: {} }
    'donors.store': { paramsTuple?: []; params?: {} }
    'donors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'donors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'donors.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'donors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.index': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.store': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.hopitaux_avec_stock': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mon_hopital': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.update_mon_hopital': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_membres': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_stocks': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_dons': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.registre_psl': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.membres': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.stocks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.dons': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.rendez_vous': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'centres.hopitaux.centres_proches': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.get_centres': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.detail_centre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.historique_mon_donneur': { paramsTuple?: []; params?: {} }
    'dons.dons.statistiques': { paramsTuple?: []; params?: {} }
    'dons.dons.index': { paramsTuple?: []; params?: {} }
    'dons.dons.store': { paramsTuple?: []; params?: {} }
    'dons.dons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.valider': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'poches.dons.poches_expirant_bientot': { paramsTuple?: []; params?: {} }
    'poches.dons.poches': { paramsTuple?: []; params?: {} }
    'poches.dons.show_poche': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bons_demande_index': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bon_demande_store': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bons_demande_recus': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bon_demande_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_satisfaire': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_non_satisfaire': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_transferer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_decliner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.enregistrer_psl': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.stocks.resume_national': { paramsTuple?: []; params?: {} }
    'stocks.stocks.alertes': { paramsTuple?: []; params?: {} }
    'stocks.stocks.index': { paramsTuple?: []; params?: {} }
    'stocks.stocks.show_by_hopital': { paramsTuple: [ParamValue]; params: {'hopitalId': ParamValue} }
    'stocks.stocks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'alertes.alertes.nationales': { paramsTuple?: []; params?: {} }
    'alertes.alertes.index': { paramsTuple?: []; params?: {} }
    'alertes.alertes.store': { paramsTuple?: []; params?: {} }
    'alertes.alertes.resoudre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.demandes_acces_index': { paramsTuple?: []; params?: {} }
    'membresdemandes.hopitaux.demandes_acces_store': { paramsTuple?: []; params?: {} }
    'membresdemandes.hopitaux.demandes_acces_approuver': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.demandes_acces_rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.supprimer_membre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.notifications.marquer_toutes_lues': { paramsTuple?: []; params?: {} }
    'notifications.notifications.preferences': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.marquer_lue': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.rendez_vous_attribues': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.s_attribuer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.index': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.store': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.assigner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.confirmer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.annuler': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.marquer_effectue': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'resultats.resultats.store': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'resultats.resultats.show': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'resultats.resultats.update': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'users.users.stats': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'users.users.store': { paramsTuple?: []; params?: {} }
    'users.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.reset_password': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rapports.stocks.rapport_dons': { paramsTuple?: []; params?: {} }
    'rapports.donors.rapport_donneurs': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_stocks': { paramsTuple?: []; params?: {} }
    'rapports.hopitaux.rapport_hopitaux': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_performance': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.access_token.verifier': { paramsTuple?: []; params?: {} }
    'compte.profile.show': { paramsTuple?: []; params?: {} }
    'donors.mon_profil': { paramsTuple?: []; params?: {} }
    'donors.ma_carte': { paramsTuple?: []; params?: {} }
    'donors.mes_badges': { paramsTuple?: []; params?: {} }
    'donors.mes_dons': { paramsTuple?: []; params?: {} }
    'donors.index': { paramsTuple?: []; params?: {} }
    'donors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.index': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.hopitaux_avec_stock': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mon_hopital': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_membres': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_stocks': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_dons': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.registre_psl': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.membres': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.stocks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.dons': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.rendez_vous': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'centres.hopitaux.centres_proches': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.get_centres': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.detail_centre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.historique_mon_donneur': { paramsTuple?: []; params?: {} }
    'dons.dons.statistiques': { paramsTuple?: []; params?: {} }
    'dons.dons.index': { paramsTuple?: []; params?: {} }
    'dons.dons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'poches.dons.poches_expirant_bientot': { paramsTuple?: []; params?: {} }
    'poches.dons.poches': { paramsTuple?: []; params?: {} }
    'poches.dons.show_poche': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bons_demande_index': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bons_demande_recus': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bon_demande_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.stocks.resume_national': { paramsTuple?: []; params?: {} }
    'stocks.stocks.alertes': { paramsTuple?: []; params?: {} }
    'stocks.stocks.index': { paramsTuple?: []; params?: {} }
    'stocks.stocks.show_by_hopital': { paramsTuple: [ParamValue]; params: {'hopitalId': ParamValue} }
    'alertes.alertes.nationales': { paramsTuple?: []; params?: {} }
    'alertes.alertes.index': { paramsTuple?: []; params?: {} }
    'membresdemandes.hopitaux.demandes_acces_index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.rendez_vous_attribues': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.index': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'resultats.resultats.show': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'users.users.stats': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'users.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rapports.stocks.rapport_dons': { paramsTuple?: []; params?: {} }
    'rapports.donors.rapport_donneurs': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_stocks': { paramsTuple?: []; params?: {} }
    'rapports.hopitaux.rapport_hopitaux': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_performance': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.access_token.verifier': { paramsTuple?: []; params?: {} }
    'compte.profile.show': { paramsTuple?: []; params?: {} }
    'donors.mon_profil': { paramsTuple?: []; params?: {} }
    'donors.ma_carte': { paramsTuple?: []; params?: {} }
    'donors.mes_badges': { paramsTuple?: []; params?: {} }
    'donors.mes_dons': { paramsTuple?: []; params?: {} }
    'donors.index': { paramsTuple?: []; params?: {} }
    'donors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.index': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.hopitaux_avec_stock': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mon_hopital': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_membres': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_stocks': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_dons': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.registre_psl': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.membres': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.stocks': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.dons': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.rendez_vous': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'centres.hopitaux.centres_proches': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.get_centres': { paramsTuple?: []; params?: {} }
    'centres.hopitaux.detail_centre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.historique_mon_donneur': { paramsTuple?: []; params?: {} }
    'dons.dons.statistiques': { paramsTuple?: []; params?: {} }
    'dons.dons.index': { paramsTuple?: []; params?: {} }
    'dons.dons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'poches.dons.poches_expirant_bientot': { paramsTuple?: []; params?: {} }
    'poches.dons.poches': { paramsTuple?: []; params?: {} }
    'poches.dons.show_poche': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bons_demande_index': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bons_demande_recus': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bon_demande_show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.stocks.resume_national': { paramsTuple?: []; params?: {} }
    'stocks.stocks.alertes': { paramsTuple?: []; params?: {} }
    'stocks.stocks.index': { paramsTuple?: []; params?: {} }
    'stocks.stocks.show_by_hopital': { paramsTuple: [ParamValue]; params: {'hopitalId': ParamValue} }
    'alertes.alertes.nationales': { paramsTuple?: []; params?: {} }
    'alertes.alertes.index': { paramsTuple?: []; params?: {} }
    'membresdemandes.hopitaux.demandes_acces_index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.mes_rendez_vous': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.rendez_vous_attribues': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.index': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'resultats.resultats.show': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'users.users.stats': { paramsTuple?: []; params?: {} }
    'users.users.index': { paramsTuple?: []; params?: {} }
    'users.users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rapports.stocks.rapport_dons': { paramsTuple?: []; params?: {} }
    'rapports.donors.rapport_donneurs': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_stocks': { paramsTuple?: []; params?: {} }
    'rapports.hopitaux.rapport_hopitaux': { paramsTuple?: []; params?: {} }
    'rapports.stocks.rapport_performance': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'compte.profile.update_photo': { paramsTuple?: []; params?: {} }
    'donors.store': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.store': { paramsTuple?: []; params?: {} }
    'dons.dons.store': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.bon_demande_store': { paramsTuple?: []; params?: {} }
    'bonsDemande.dons.enregistrer_psl': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'alertes.alertes.store': { paramsTuple?: []; params?: {} }
    'membresdemandes.hopitaux.demandes_acces_store': { paramsTuple?: []; params?: {} }
    'rendezVous.rendez_vous.store': { paramsTuple?: []; params?: {} }
    'resultats.resultats.store': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'users.users.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'compte.profile.update': { paramsTuple?: []; params?: {} }
    'compte.profile.update_password': { paramsTuple?: []; params?: {} }
    'donors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.update_mon_hopital': { paramsTuple?: []; params?: {} }
    'hopitaux.hopitaux.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'stocks.stocks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.notifications.preferences': { paramsTuple?: []; params?: {} }
    'resultats.resultats.update': { paramsTuple: [ParamValue]; params: {'donId': ParamValue} }
    'users.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'donors.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.valider': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dons.dons.rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_satisfaire': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_non_satisfaire': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_transferer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_decliner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'alertes.alertes.resoudre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.demandes_acces_approuver': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.demandes_acces_rejeter': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'notifications.notifications.marquer_toutes_lues': { paramsTuple?: []; params?: {} }
    'notifications.notifications.marquer_lue': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.s_attribuer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.assigner': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.confirmer': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.annuler': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'rendezVous.rendez_vous.marquer_effectue': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.update_statut': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.reset_password': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'donors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'hopitaux.hopitaux.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bonsDemande.dons.bon_demande_destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'membresdemandes.hopitaux.supprimer_membre': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}