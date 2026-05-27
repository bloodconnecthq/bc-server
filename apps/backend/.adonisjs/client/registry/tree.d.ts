/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
      verifier: typeof routes['auth.access_token.verifier']
    }
  }
  compte: {
    profile: {
      show: typeof routes['compte.profile.show']
      update: typeof routes['compte.profile.update']
      updatePhoto: typeof routes['compte.profile.update_photo']
      updatePassword: typeof routes['compte.profile.update_password']
    }
  }
  donors: {
    monProfil: typeof routes['donors.mon_profil']
    maCarte: typeof routes['donors.ma_carte']
    mesBadges: typeof routes['donors.mes_badges']
    mesDons: typeof routes['donors.mes_dons']
    index: typeof routes['donors.index']
    store: typeof routes['donors.store']
    show: typeof routes['donors.show']
    update: typeof routes['donors.update']
    updateStatut: typeof routes['donors.update_statut']
    destroy: typeof routes['donors.destroy']
  }
  hopitaux: {
    hopitaux: {
      index: typeof routes['hopitaux.hopitaux.index']
      store: typeof routes['hopitaux.hopitaux.store']
      hopitauxAvecStock: typeof routes['hopitaux.hopitaux.hopitaux_avec_stock']
      monHopital: typeof routes['hopitaux.hopitaux.mon_hopital']
      updateMonHopital: typeof routes['hopitaux.hopitaux.update_mon_hopital']
      mesMembres: typeof routes['hopitaux.hopitaux.mes_membres']
      mesStocks: typeof routes['hopitaux.hopitaux.mes_stocks']
      mesDons: typeof routes['hopitaux.hopitaux.mes_dons']
      mesRendezVous: typeof routes['hopitaux.hopitaux.mes_rendez_vous']
      show: typeof routes['hopitaux.hopitaux.show']
      update: typeof routes['hopitaux.hopitaux.update']
      updateStatut: typeof routes['hopitaux.hopitaux.update_statut']
      membres: typeof routes['hopitaux.hopitaux.membres']
      stocks: typeof routes['hopitaux.hopitaux.stocks']
      dons: typeof routes['hopitaux.hopitaux.dons']
      rendezVous: typeof routes['hopitaux.hopitaux.rendez_vous']
    }
  }
  centres: {
    hopitaux: {
      centresProches: typeof routes['centres.hopitaux.centres_proches']
      getCentres: typeof routes['centres.hopitaux.get_centres']
      detailCentre: typeof routes['centres.hopitaux.detail_centre']
    }
  }
  dons: {
    dons: {
      historiqueMonDonneur: typeof routes['dons.dons.historique_mon_donneur']
      statistiques: typeof routes['dons.dons.statistiques']
      index: typeof routes['dons.dons.index']
      store: typeof routes['dons.dons.store']
      show: typeof routes['dons.dons.show']
      valider: typeof routes['dons.dons.valider']
      rejeter: typeof routes['dons.dons.rejeter']
    }
  }
  poches: {
    dons: {
      pochesExpirantBientot: typeof routes['poches.dons.poches_expirant_bientot']
      poches: typeof routes['poches.dons.poches']
      showPoche: typeof routes['poches.dons.show_poche']
    }
  }
  bonsDemande: {
    dons: {
      bonsDemandeIndex: typeof routes['bonsDemande.dons.bons_demande_index']
      bonDemandeStore: typeof routes['bonsDemande.dons.bon_demande_store']
      bonsDemandeRecus: typeof routes['bonsDemande.dons.bons_demande_recus']
      bonDemandeShow: typeof routes['bonsDemande.dons.bon_demande_show']
      bonDemandeSatisfaire: typeof routes['bonsDemande.dons.bon_demande_satisfaire']
      bonDemandeNonSatisfaire: typeof routes['bonsDemande.dons.bon_demande_non_satisfaire']
      bonDemandeUpdate: typeof routes['bonsDemande.dons.bon_demande_update']
      bonDemandeDestroy: typeof routes['bonsDemande.dons.bon_demande_destroy']
      bonDemandeTransferer: typeof routes['bonsDemande.dons.bon_demande_transferer']
      bonDemandeDecliner: typeof routes['bonsDemande.dons.bon_demande_decliner']
      enregistrerPsl: typeof routes['bonsDemande.dons.enregistrer_psl']
    }
  }
  stocks: {
    stocks: {
      resumeNational: typeof routes['stocks.stocks.resume_national']
      alertes: typeof routes['stocks.stocks.alertes']
      index: typeof routes['stocks.stocks.index']
      showByHopital: typeof routes['stocks.stocks.show_by_hopital']
      update: typeof routes['stocks.stocks.update']
    }
  }
  alertes: {
    alertes: {
      nationales: typeof routes['alertes.alertes.nationales']
      index: typeof routes['alertes.alertes.index']
      store: typeof routes['alertes.alertes.store']
      resoudre: typeof routes['alertes.alertes.resoudre']
    }
  }
  membresdemandes: {
    hopitaux: {
      demandesAccesIndex: typeof routes['membresdemandes.hopitaux.demandes_acces_index']
      demandesAccesStore: typeof routes['membresdemandes.hopitaux.demandes_acces_store']
      demandesAccesApprouver: typeof routes['membresdemandes.hopitaux.demandes_acces_approuver']
      demandesAccesRejeter: typeof routes['membresdemandes.hopitaux.demandes_acces_rejeter']
      supprimerMembre: typeof routes['membresdemandes.hopitaux.supprimer_membre']
    }
  }
  notifications: {
    notifications: {
      marquerToutesLues: typeof routes['notifications.notifications.marquer_toutes_lues']
      preferences: typeof routes['notifications.notifications.preferences']
      index: typeof routes['notifications.notifications.index']
      marquerLue: typeof routes['notifications.notifications.marquer_lue']
    }
  }
  rendezVous: {
    rendezVous: {
      mesRendezVous: typeof routes['rendezVous.rendez_vous.mes_rendez_vous']
      rendezVousAttribues: typeof routes['rendezVous.rendez_vous.rendez_vous_attribues']
      sAttribuer: typeof routes['rendezVous.rendez_vous.s_attribuer']
      index: typeof routes['rendezVous.rendez_vous.index']
      store: typeof routes['rendezVous.rendez_vous.store']
      show: typeof routes['rendezVous.rendez_vous.show']
      assigner: typeof routes['rendezVous.rendez_vous.assigner']
      confirmer: typeof routes['rendezVous.rendez_vous.confirmer']
      annuler: typeof routes['rendezVous.rendez_vous.annuler']
      marquerEffectue: typeof routes['rendezVous.rendez_vous.marquer_effectue']
    }
  }
  resultats: {
    resultats: {
      store: typeof routes['resultats.resultats.store']
      show: typeof routes['resultats.resultats.show']
      update: typeof routes['resultats.resultats.update']
    }
  }
  users: {
    users: {
      stats: typeof routes['users.users.stats']
      index: typeof routes['users.users.index']
      show: typeof routes['users.users.show']
      update: typeof routes['users.users.update']
      updateStatut: typeof routes['users.users.update_statut']
      resetPassword: typeof routes['users.users.reset_password']
      destroy: typeof routes['users.users.destroy']
    }
  }
  rapports: {
    stocks: {
      rapportDons: typeof routes['rapports.stocks.rapport_dons']
      rapportStocks: typeof routes['rapports.stocks.rapport_stocks']
      rapportPerformance: typeof routes['rapports.stocks.rapport_performance']
    }
    donors: {
      rapportDonneurs: typeof routes['rapports.donors.rapport_donneurs']
    }
    hopitaux: {
      rapportHopitaux: typeof routes['rapports.hopitaux.rapport_hopitaux']
    }
  }
}
