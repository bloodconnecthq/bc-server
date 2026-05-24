/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/inscription'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/connexion'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/auth/deconnexion'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
    }
  }
  'auth.access_token.verifier': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/verifier'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['verifier']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['verifier']>>>
    }
  }
  'compte.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/compte/profil'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'compte.profile.update': {
    methods: ["PUT"]
    pattern: '/api/v1/compte/profil'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
    }
  }
  'compte.profile.update_password': {
    methods: ["PUT"]
    pattern: '/api/v1/compte/mot-de-passe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>>
    }
  }
  'donors.mon_profil': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs/moi/profil'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.ma_carte': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs/moi/carte'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.mes_badges': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs/moi/badges'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.mes_dons': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs/moi/dons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.store': {
    methods: ["POST"]
    pattern: '/api/v1/donneurs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/donneurs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.update': {
    methods: ["PUT"]
    pattern: '/api/v1/donneurs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'donors.update_statut': {
    methods: ["PATCH"]
    pattern: '/api/v1/donneurs/:id/statut'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.store': {
    methods: ["POST"]
    pattern: '/api/v1/hopitaux'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.update': {
    methods: ["PUT"]
    pattern: '/api/v1/hopitaux/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.update_statut': {
    methods: ["PATCH"]
    pattern: '/api/v1/hopitaux/:id/statut'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.membres': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/:id/membres'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.mes_stocks': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/moi/stocks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.mes_dons': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/moi/dons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.mes_rendez_vous': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/moi/rendez-vous'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.stocks': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/:id/stocks'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.dons': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/:id/dons'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'hopitaux.hopitaux.rendez_vous': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/hopitaux/:id/rendez-vous'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'centres.hopitaux.centres_proches': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/centres/proches'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'centres.hopitaux.get_centres': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/centres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'centres.hopitaux.detail_centre': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/centres/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.historique_mon_donneur': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dons/moi/historique'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.statistiques': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dons/statistiques'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.store': {
    methods: ["POST"]
    pattern: '/api/v1/dons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dons/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.valider': {
    methods: ["PATCH"]
    pattern: '/api/v1/dons/:id/valider'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'dons.dons.rejeter': {
    methods: ["PATCH"]
    pattern: '/api/v1/dons/:id/rejeter'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'poches.dons.poches_expirant_bientot': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/poches/expirant-bientot'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'poches.dons.poches': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/poches'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'poches.dons.show_poche': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/poches/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.bons_demande_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/bons-demande'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.bon_demande_store': {
    methods: ["POST"]
    pattern: '/api/v1/bons-demande'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.bon_demande_show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/bons-demande/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.bon_demande_satisfaire': {
    methods: ["PATCH"]
    pattern: '/api/v1/bons-demande/:id/satisfaire'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.bon_demande_non_satisfaire': {
    methods: ["PATCH"]
    pattern: '/api/v1/bons-demande/:id/non-satisfaire'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'bonsDemande.dons.enregistrer_psl': {
    methods: ["POST"]
    pattern: '/api/v1/bons-demande/:id/psl'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'stocks.stocks.resume_national': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/stocks/resume-national'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'stocks.stocks.alertes': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/stocks/alertes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'stocks.stocks.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/stocks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'stocks.stocks.show_by_hopital': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/stocks/:hopitalId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { hopitalId: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'stocks.stocks.update': {
    methods: ["PUT"]
    pattern: '/api/v1/stocks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'alertes.alertes.nationales': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/alertes/nationales'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'alertes.alertes.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/alertes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'alertes.alertes.store': {
    methods: ["POST"]
    pattern: '/api/v1/alertes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'alertes.alertes.resoudre': {
    methods: ["PATCH"]
    pattern: '/api/v1/alertes/:id/resoudre'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'membresdemandes.hopitaux.demandes_acces_index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/membres/demandes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'membresdemandes.hopitaux.demandes_acces_store': {
    methods: ["POST"]
    pattern: '/api/v1/membres/demandes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'membresdemandes.hopitaux.demandes_acces_approuver': {
    methods: ["PATCH"]
    pattern: '/api/v1/membres/demandes/:id/approuver'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'membresdemandes.hopitaux.demandes_acces_rejeter': {
    methods: ["PATCH"]
    pattern: '/api/v1/membres/demandes/:id/rejeter'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'membresdemandes.hopitaux.supprimer_membre': {
    methods: ["DELETE"]
    pattern: '/api/v1/membres/demandes/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'notifications.notifications.marquer_toutes_lues': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/tout-lire'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'notifications.notifications.preferences': {
    methods: ["PUT"]
    pattern: '/api/v1/notifications/preferences'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'notifications.notifications.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'notifications.notifications.marquer_lue': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/:id/lire'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.mes_rendez_vous': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rendez-vous/moi'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.rendez_vous_attribues': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rendez-vous/attribues'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rendez-vous'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.store': {
    methods: ["POST"]
    pattern: '/api/v1/rendez-vous'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rendez-vous/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.assigner': {
    methods: ["PATCH"]
    pattern: '/api/v1/rendez-vous/:id/assigner'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.confirmer': {
    methods: ["PATCH"]
    pattern: '/api/v1/rendez-vous/:id/confirmer'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.annuler': {
    methods: ["PATCH"]
    pattern: '/api/v1/rendez-vous/:id/annuler'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rendezVous.rendez_vous.marquer_effectue': {
    methods: ["PATCH"]
    pattern: '/api/v1/rendez-vous/:id/effectue'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'resultats.resultats.store': {
    methods: ["POST"]
    pattern: '/api/v1/dons/:donId/resultats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { donId: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'resultats.resultats.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/dons/:donId/resultats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { donId: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'resultats.resultats.update': {
    methods: ["PUT"]
    pattern: '/api/v1/dons/:donId/resultats'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { donId: ParamValue }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rapports.stocks.rapport_dons': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rapports/dons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rapports.donors.rapport_donneurs': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rapports/donneurs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rapports.stocks.rapport_stocks': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rapports/stocks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rapports.hopitaux.rapport_hopitaux': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rapports/hopitaux'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'rapports.stocks.rapport_performance': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/rapports/performance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
