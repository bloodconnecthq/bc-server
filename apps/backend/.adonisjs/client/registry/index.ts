/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/inscription',
    tokens: [{"old":"/api/v1/auth/inscription","type":0,"val":"api","end":""},{"old":"/api/v1/auth/inscription","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/inscription","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/inscription","type":0,"val":"inscription","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_token.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/connexion',
    tokens: [{"old":"/api/v1/auth/connexion","type":0,"val":"api","end":""},{"old":"/api/v1/auth/connexion","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/connexion","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/connexion","type":0,"val":"connexion","end":""}],
    types: placeholder as Registry['auth.access_token.store']['types'],
  },
  'auth.access_token.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/deconnexion',
    tokens: [{"old":"/api/v1/auth/deconnexion","type":0,"val":"api","end":""},{"old":"/api/v1/auth/deconnexion","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/deconnexion","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/deconnexion","type":0,"val":"deconnexion","end":""}],
    types: placeholder as Registry['auth.access_token.destroy']['types'],
  },
  'auth.access_token.verifier': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/verifier',
    tokens: [{"old":"/api/v1/auth/verifier","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verifier","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verifier","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verifier","type":0,"val":"verifier","end":""}],
    types: placeholder as Registry['auth.access_token.verifier']['types'],
  },
  'compte.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/compte/profil',
    tokens: [{"old":"/api/v1/compte/profil","type":0,"val":"api","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"v1","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"compte","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"profil","end":""}],
    types: placeholder as Registry['compte.profile.show']['types'],
  },
  'compte.profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/compte/profil',
    tokens: [{"old":"/api/v1/compte/profil","type":0,"val":"api","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"v1","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"compte","end":""},{"old":"/api/v1/compte/profil","type":0,"val":"profil","end":""}],
    types: placeholder as Registry['compte.profile.update']['types'],
  },
  'compte.profile.update_photo': {
    methods: ["POST"],
    pattern: '/api/v1/compte/photo',
    tokens: [{"old":"/api/v1/compte/photo","type":0,"val":"api","end":""},{"old":"/api/v1/compte/photo","type":0,"val":"v1","end":""},{"old":"/api/v1/compte/photo","type":0,"val":"compte","end":""},{"old":"/api/v1/compte/photo","type":0,"val":"photo","end":""}],
    types: placeholder as Registry['compte.profile.update_photo']['types'],
  },
  'compte.profile.update_password': {
    methods: ["PUT"],
    pattern: '/api/v1/compte/mot-de-passe',
    tokens: [{"old":"/api/v1/compte/mot-de-passe","type":0,"val":"api","end":""},{"old":"/api/v1/compte/mot-de-passe","type":0,"val":"v1","end":""},{"old":"/api/v1/compte/mot-de-passe","type":0,"val":"compte","end":""},{"old":"/api/v1/compte/mot-de-passe","type":0,"val":"mot-de-passe","end":""}],
    types: placeholder as Registry['compte.profile.update_password']['types'],
  },
  'donors.mon_profil': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs/moi/profil',
    tokens: [{"old":"/api/v1/donneurs/moi/profil","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/moi/profil","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/moi/profil","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/moi/profil","type":0,"val":"moi","end":""},{"old":"/api/v1/donneurs/moi/profil","type":0,"val":"profil","end":""}],
    types: placeholder as Registry['donors.mon_profil']['types'],
  },
  'donors.ma_carte': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs/moi/carte',
    tokens: [{"old":"/api/v1/donneurs/moi/carte","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/moi/carte","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/moi/carte","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/moi/carte","type":0,"val":"moi","end":""},{"old":"/api/v1/donneurs/moi/carte","type":0,"val":"carte","end":""}],
    types: placeholder as Registry['donors.ma_carte']['types'],
  },
  'donors.mes_badges': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs/moi/badges',
    tokens: [{"old":"/api/v1/donneurs/moi/badges","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/moi/badges","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/moi/badges","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/moi/badges","type":0,"val":"moi","end":""},{"old":"/api/v1/donneurs/moi/badges","type":0,"val":"badges","end":""}],
    types: placeholder as Registry['donors.mes_badges']['types'],
  },
  'donors.mes_dons': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs/moi/dons',
    tokens: [{"old":"/api/v1/donneurs/moi/dons","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/moi/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/moi/dons","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/moi/dons","type":0,"val":"moi","end":""},{"old":"/api/v1/donneurs/moi/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['donors.mes_dons']['types'],
  },
  'donors.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs',
    tokens: [{"old":"/api/v1/donneurs","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs","type":0,"val":"donneurs","end":""}],
    types: placeholder as Registry['donors.index']['types'],
  },
  'donors.store': {
    methods: ["POST"],
    pattern: '/api/v1/donneurs',
    tokens: [{"old":"/api/v1/donneurs","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs","type":0,"val":"donneurs","end":""}],
    types: placeholder as Registry['donors.store']['types'],
  },
  'donors.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/donneurs/:id',
    tokens: [{"old":"/api/v1/donneurs/:id","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['donors.show']['types'],
  },
  'donors.update': {
    methods: ["PUT"],
    pattern: '/api/v1/donneurs/:id',
    tokens: [{"old":"/api/v1/donneurs/:id","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['donors.update']['types'],
  },
  'donors.update_statut': {
    methods: ["PATCH"],
    pattern: '/api/v1/donneurs/:id/statut',
    tokens: [{"old":"/api/v1/donneurs/:id/statut","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/:id/statut","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/:id/statut","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/:id/statut","type":1,"val":"id","end":""},{"old":"/api/v1/donneurs/:id/statut","type":0,"val":"statut","end":""}],
    types: placeholder as Registry['donors.update_statut']['types'],
  },
  'donors.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/donneurs/:id',
    tokens: [{"old":"/api/v1/donneurs/:id","type":0,"val":"api","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/donneurs/:id","type":0,"val":"donneurs","end":""},{"old":"/api/v1/donneurs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['donors.destroy']['types'],
  },
  'hopitaux.hopitaux.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux',
    tokens: [{"old":"/api/v1/hopitaux","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux","type":0,"val":"hopitaux","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.index']['types'],
  },
  'hopitaux.hopitaux.store': {
    methods: ["POST"],
    pattern: '/api/v1/hopitaux',
    tokens: [{"old":"/api/v1/hopitaux","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux","type":0,"val":"hopitaux","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.store']['types'],
  },
  'hopitaux.hopitaux.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/:id',
    tokens: [{"old":"/api/v1/hopitaux/:id","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.show']['types'],
  },
  'hopitaux.hopitaux.update': {
    methods: ["PUT"],
    pattern: '/api/v1/hopitaux/:id',
    tokens: [{"old":"/api/v1/hopitaux/:id","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.update']['types'],
  },
  'hopitaux.hopitaux.update_statut': {
    methods: ["PATCH"],
    pattern: '/api/v1/hopitaux/:id/statut',
    tokens: [{"old":"/api/v1/hopitaux/:id/statut","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id/statut","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id/statut","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id/statut","type":1,"val":"id","end":""},{"old":"/api/v1/hopitaux/:id/statut","type":0,"val":"statut","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.update_statut']['types'],
  },
  'hopitaux.hopitaux.membres': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/:id/membres',
    tokens: [{"old":"/api/v1/hopitaux/:id/membres","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id/membres","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id/membres","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id/membres","type":1,"val":"id","end":""},{"old":"/api/v1/hopitaux/:id/membres","type":0,"val":"membres","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.membres']['types'],
  },
  'hopitaux.hopitaux.mes_stocks': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/moi/stocks',
    tokens: [{"old":"/api/v1/hopitaux/moi/stocks","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/moi/stocks","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/moi/stocks","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/moi/stocks","type":0,"val":"moi","end":""},{"old":"/api/v1/hopitaux/moi/stocks","type":0,"val":"stocks","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.mes_stocks']['types'],
  },
  'hopitaux.hopitaux.mes_dons': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/moi/dons',
    tokens: [{"old":"/api/v1/hopitaux/moi/dons","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/moi/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/moi/dons","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/moi/dons","type":0,"val":"moi","end":""},{"old":"/api/v1/hopitaux/moi/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.mes_dons']['types'],
  },
  'hopitaux.hopitaux.mes_rendez_vous': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/moi/rendez-vous',
    tokens: [{"old":"/api/v1/hopitaux/moi/rendez-vous","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/moi/rendez-vous","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/moi/rendez-vous","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/moi/rendez-vous","type":0,"val":"moi","end":""},{"old":"/api/v1/hopitaux/moi/rendez-vous","type":0,"val":"rendez-vous","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.mes_rendez_vous']['types'],
  },
  'hopitaux.hopitaux.stocks': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/:id/stocks',
    tokens: [{"old":"/api/v1/hopitaux/:id/stocks","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id/stocks","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id/stocks","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id/stocks","type":1,"val":"id","end":""},{"old":"/api/v1/hopitaux/:id/stocks","type":0,"val":"stocks","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.stocks']['types'],
  },
  'hopitaux.hopitaux.dons': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/:id/dons',
    tokens: [{"old":"/api/v1/hopitaux/:id/dons","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id/dons","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id/dons","type":1,"val":"id","end":""},{"old":"/api/v1/hopitaux/:id/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.dons']['types'],
  },
  'hopitaux.hopitaux.rendez_vous': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/hopitaux/:id/rendez-vous',
    tokens: [{"old":"/api/v1/hopitaux/:id/rendez-vous","type":0,"val":"api","end":""},{"old":"/api/v1/hopitaux/:id/rendez-vous","type":0,"val":"v1","end":""},{"old":"/api/v1/hopitaux/:id/rendez-vous","type":0,"val":"hopitaux","end":""},{"old":"/api/v1/hopitaux/:id/rendez-vous","type":1,"val":"id","end":""},{"old":"/api/v1/hopitaux/:id/rendez-vous","type":0,"val":"rendez-vous","end":""}],
    types: placeholder as Registry['hopitaux.hopitaux.rendez_vous']['types'],
  },
  'centres.hopitaux.centres_proches': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/centres/proches',
    tokens: [{"old":"/api/v1/centres/proches","type":0,"val":"api","end":""},{"old":"/api/v1/centres/proches","type":0,"val":"v1","end":""},{"old":"/api/v1/centres/proches","type":0,"val":"centres","end":""},{"old":"/api/v1/centres/proches","type":0,"val":"proches","end":""}],
    types: placeholder as Registry['centres.hopitaux.centres_proches']['types'],
  },
  'centres.hopitaux.get_centres': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/centres',
    tokens: [{"old":"/api/v1/centres","type":0,"val":"api","end":""},{"old":"/api/v1/centres","type":0,"val":"v1","end":""},{"old":"/api/v1/centres","type":0,"val":"centres","end":""}],
    types: placeholder as Registry['centres.hopitaux.get_centres']['types'],
  },
  'centres.hopitaux.detail_centre': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/centres/:id',
    tokens: [{"old":"/api/v1/centres/:id","type":0,"val":"api","end":""},{"old":"/api/v1/centres/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/centres/:id","type":0,"val":"centres","end":""},{"old":"/api/v1/centres/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['centres.hopitaux.detail_centre']['types'],
  },
  'dons.dons.historique_mon_donneur': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dons/moi/historique',
    tokens: [{"old":"/api/v1/dons/moi/historique","type":0,"val":"api","end":""},{"old":"/api/v1/dons/moi/historique","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/moi/historique","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/moi/historique","type":0,"val":"moi","end":""},{"old":"/api/v1/dons/moi/historique","type":0,"val":"historique","end":""}],
    types: placeholder as Registry['dons.dons.historique_mon_donneur']['types'],
  },
  'dons.dons.statistiques': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dons/statistiques',
    tokens: [{"old":"/api/v1/dons/statistiques","type":0,"val":"api","end":""},{"old":"/api/v1/dons/statistiques","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/statistiques","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/statistiques","type":0,"val":"statistiques","end":""}],
    types: placeholder as Registry['dons.dons.statistiques']['types'],
  },
  'dons.dons.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dons',
    tokens: [{"old":"/api/v1/dons","type":0,"val":"api","end":""},{"old":"/api/v1/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['dons.dons.index']['types'],
  },
  'dons.dons.store': {
    methods: ["POST"],
    pattern: '/api/v1/dons',
    tokens: [{"old":"/api/v1/dons","type":0,"val":"api","end":""},{"old":"/api/v1/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['dons.dons.store']['types'],
  },
  'dons.dons.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dons/:id',
    tokens: [{"old":"/api/v1/dons/:id","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:id","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dons.dons.show']['types'],
  },
  'dons.dons.valider': {
    methods: ["PATCH"],
    pattern: '/api/v1/dons/:id/valider',
    tokens: [{"old":"/api/v1/dons/:id/valider","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:id/valider","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:id/valider","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:id/valider","type":1,"val":"id","end":""},{"old":"/api/v1/dons/:id/valider","type":0,"val":"valider","end":""}],
    types: placeholder as Registry['dons.dons.valider']['types'],
  },
  'dons.dons.rejeter': {
    methods: ["PATCH"],
    pattern: '/api/v1/dons/:id/rejeter',
    tokens: [{"old":"/api/v1/dons/:id/rejeter","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:id/rejeter","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:id/rejeter","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:id/rejeter","type":1,"val":"id","end":""},{"old":"/api/v1/dons/:id/rejeter","type":0,"val":"rejeter","end":""}],
    types: placeholder as Registry['dons.dons.rejeter']['types'],
  },
  'poches.dons.poches_expirant_bientot': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/poches/expirant-bientot',
    tokens: [{"old":"/api/v1/poches/expirant-bientot","type":0,"val":"api","end":""},{"old":"/api/v1/poches/expirant-bientot","type":0,"val":"v1","end":""},{"old":"/api/v1/poches/expirant-bientot","type":0,"val":"poches","end":""},{"old":"/api/v1/poches/expirant-bientot","type":0,"val":"expirant-bientot","end":""}],
    types: placeholder as Registry['poches.dons.poches_expirant_bientot']['types'],
  },
  'poches.dons.poches': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/poches',
    tokens: [{"old":"/api/v1/poches","type":0,"val":"api","end":""},{"old":"/api/v1/poches","type":0,"val":"v1","end":""},{"old":"/api/v1/poches","type":0,"val":"poches","end":""}],
    types: placeholder as Registry['poches.dons.poches']['types'],
  },
  'poches.dons.show_poche': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/poches/:id',
    tokens: [{"old":"/api/v1/poches/:id","type":0,"val":"api","end":""},{"old":"/api/v1/poches/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/poches/:id","type":0,"val":"poches","end":""},{"old":"/api/v1/poches/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['poches.dons.show_poche']['types'],
  },
  'bonsDemande.dons.bons_demande_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/bons-demande',
    tokens: [{"old":"/api/v1/bons-demande","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande","type":0,"val":"bons-demande","end":""}],
    types: placeholder as Registry['bonsDemande.dons.bons_demande_index']['types'],
  },
  'bonsDemande.dons.bon_demande_store': {
    methods: ["POST"],
    pattern: '/api/v1/bons-demande',
    tokens: [{"old":"/api/v1/bons-demande","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande","type":0,"val":"bons-demande","end":""}],
    types: placeholder as Registry['bonsDemande.dons.bon_demande_store']['types'],
  },
  'bonsDemande.dons.bon_demande_show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/bons-demande/:id',
    tokens: [{"old":"/api/v1/bons-demande/:id","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande/:id","type":0,"val":"bons-demande","end":""},{"old":"/api/v1/bons-demande/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bonsDemande.dons.bon_demande_show']['types'],
  },
  'bonsDemande.dons.bon_demande_satisfaire': {
    methods: ["PATCH"],
    pattern: '/api/v1/bons-demande/:id/satisfaire',
    tokens: [{"old":"/api/v1/bons-demande/:id/satisfaire","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande/:id/satisfaire","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande/:id/satisfaire","type":0,"val":"bons-demande","end":""},{"old":"/api/v1/bons-demande/:id/satisfaire","type":1,"val":"id","end":""},{"old":"/api/v1/bons-demande/:id/satisfaire","type":0,"val":"satisfaire","end":""}],
    types: placeholder as Registry['bonsDemande.dons.bon_demande_satisfaire']['types'],
  },
  'bonsDemande.dons.bon_demande_non_satisfaire': {
    methods: ["PATCH"],
    pattern: '/api/v1/bons-demande/:id/non-satisfaire',
    tokens: [{"old":"/api/v1/bons-demande/:id/non-satisfaire","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande/:id/non-satisfaire","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande/:id/non-satisfaire","type":0,"val":"bons-demande","end":""},{"old":"/api/v1/bons-demande/:id/non-satisfaire","type":1,"val":"id","end":""},{"old":"/api/v1/bons-demande/:id/non-satisfaire","type":0,"val":"non-satisfaire","end":""}],
    types: placeholder as Registry['bonsDemande.dons.bon_demande_non_satisfaire']['types'],
  },
  'bonsDemande.dons.enregistrer_psl': {
    methods: ["POST"],
    pattern: '/api/v1/bons-demande/:id/psl',
    tokens: [{"old":"/api/v1/bons-demande/:id/psl","type":0,"val":"api","end":""},{"old":"/api/v1/bons-demande/:id/psl","type":0,"val":"v1","end":""},{"old":"/api/v1/bons-demande/:id/psl","type":0,"val":"bons-demande","end":""},{"old":"/api/v1/bons-demande/:id/psl","type":1,"val":"id","end":""},{"old":"/api/v1/bons-demande/:id/psl","type":0,"val":"psl","end":""}],
    types: placeholder as Registry['bonsDemande.dons.enregistrer_psl']['types'],
  },
  'stocks.stocks.resume_national': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stocks/resume-national',
    tokens: [{"old":"/api/v1/stocks/resume-national","type":0,"val":"api","end":""},{"old":"/api/v1/stocks/resume-national","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks/resume-national","type":0,"val":"stocks","end":""},{"old":"/api/v1/stocks/resume-national","type":0,"val":"resume-national","end":""}],
    types: placeholder as Registry['stocks.stocks.resume_national']['types'],
  },
  'stocks.stocks.alertes': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stocks/alertes',
    tokens: [{"old":"/api/v1/stocks/alertes","type":0,"val":"api","end":""},{"old":"/api/v1/stocks/alertes","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks/alertes","type":0,"val":"stocks","end":""},{"old":"/api/v1/stocks/alertes","type":0,"val":"alertes","end":""}],
    types: placeholder as Registry['stocks.stocks.alertes']['types'],
  },
  'stocks.stocks.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stocks',
    tokens: [{"old":"/api/v1/stocks","type":0,"val":"api","end":""},{"old":"/api/v1/stocks","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks","type":0,"val":"stocks","end":""}],
    types: placeholder as Registry['stocks.stocks.index']['types'],
  },
  'stocks.stocks.show_by_hopital': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/stocks/:hopitalId',
    tokens: [{"old":"/api/v1/stocks/:hopitalId","type":0,"val":"api","end":""},{"old":"/api/v1/stocks/:hopitalId","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks/:hopitalId","type":0,"val":"stocks","end":""},{"old":"/api/v1/stocks/:hopitalId","type":1,"val":"hopitalId","end":""}],
    types: placeholder as Registry['stocks.stocks.show_by_hopital']['types'],
  },
  'stocks.stocks.update': {
    methods: ["PUT"],
    pattern: '/api/v1/stocks/:id',
    tokens: [{"old":"/api/v1/stocks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/stocks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/stocks/:id","type":0,"val":"stocks","end":""},{"old":"/api/v1/stocks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['stocks.stocks.update']['types'],
  },
  'alertes.alertes.nationales': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/alertes/nationales',
    tokens: [{"old":"/api/v1/alertes/nationales","type":0,"val":"api","end":""},{"old":"/api/v1/alertes/nationales","type":0,"val":"v1","end":""},{"old":"/api/v1/alertes/nationales","type":0,"val":"alertes","end":""},{"old":"/api/v1/alertes/nationales","type":0,"val":"nationales","end":""}],
    types: placeholder as Registry['alertes.alertes.nationales']['types'],
  },
  'alertes.alertes.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/alertes',
    tokens: [{"old":"/api/v1/alertes","type":0,"val":"api","end":""},{"old":"/api/v1/alertes","type":0,"val":"v1","end":""},{"old":"/api/v1/alertes","type":0,"val":"alertes","end":""}],
    types: placeholder as Registry['alertes.alertes.index']['types'],
  },
  'alertes.alertes.store': {
    methods: ["POST"],
    pattern: '/api/v1/alertes',
    tokens: [{"old":"/api/v1/alertes","type":0,"val":"api","end":""},{"old":"/api/v1/alertes","type":0,"val":"v1","end":""},{"old":"/api/v1/alertes","type":0,"val":"alertes","end":""}],
    types: placeholder as Registry['alertes.alertes.store']['types'],
  },
  'alertes.alertes.resoudre': {
    methods: ["PATCH"],
    pattern: '/api/v1/alertes/:id/resoudre',
    tokens: [{"old":"/api/v1/alertes/:id/resoudre","type":0,"val":"api","end":""},{"old":"/api/v1/alertes/:id/resoudre","type":0,"val":"v1","end":""},{"old":"/api/v1/alertes/:id/resoudre","type":0,"val":"alertes","end":""},{"old":"/api/v1/alertes/:id/resoudre","type":1,"val":"id","end":""},{"old":"/api/v1/alertes/:id/resoudre","type":0,"val":"resoudre","end":""}],
    types: placeholder as Registry['alertes.alertes.resoudre']['types'],
  },
  'membresdemandes.hopitaux.demandes_acces_index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/membres/demandes',
    tokens: [{"old":"/api/v1/membres/demandes","type":0,"val":"api","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"v1","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"membres","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"demandes","end":""}],
    types: placeholder as Registry['membresdemandes.hopitaux.demandes_acces_index']['types'],
  },
  'membresdemandes.hopitaux.demandes_acces_store': {
    methods: ["POST"],
    pattern: '/api/v1/membres/demandes',
    tokens: [{"old":"/api/v1/membres/demandes","type":0,"val":"api","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"v1","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"membres","end":""},{"old":"/api/v1/membres/demandes","type":0,"val":"demandes","end":""}],
    types: placeholder as Registry['membresdemandes.hopitaux.demandes_acces_store']['types'],
  },
  'membresdemandes.hopitaux.demandes_acces_approuver': {
    methods: ["PATCH"],
    pattern: '/api/v1/membres/demandes/:id/approuver',
    tokens: [{"old":"/api/v1/membres/demandes/:id/approuver","type":0,"val":"api","end":""},{"old":"/api/v1/membres/demandes/:id/approuver","type":0,"val":"v1","end":""},{"old":"/api/v1/membres/demandes/:id/approuver","type":0,"val":"membres","end":""},{"old":"/api/v1/membres/demandes/:id/approuver","type":0,"val":"demandes","end":""},{"old":"/api/v1/membres/demandes/:id/approuver","type":1,"val":"id","end":""},{"old":"/api/v1/membres/demandes/:id/approuver","type":0,"val":"approuver","end":""}],
    types: placeholder as Registry['membresdemandes.hopitaux.demandes_acces_approuver']['types'],
  },
  'membresdemandes.hopitaux.demandes_acces_rejeter': {
    methods: ["PATCH"],
    pattern: '/api/v1/membres/demandes/:id/rejeter',
    tokens: [{"old":"/api/v1/membres/demandes/:id/rejeter","type":0,"val":"api","end":""},{"old":"/api/v1/membres/demandes/:id/rejeter","type":0,"val":"v1","end":""},{"old":"/api/v1/membres/demandes/:id/rejeter","type":0,"val":"membres","end":""},{"old":"/api/v1/membres/demandes/:id/rejeter","type":0,"val":"demandes","end":""},{"old":"/api/v1/membres/demandes/:id/rejeter","type":1,"val":"id","end":""},{"old":"/api/v1/membres/demandes/:id/rejeter","type":0,"val":"rejeter","end":""}],
    types: placeholder as Registry['membresdemandes.hopitaux.demandes_acces_rejeter']['types'],
  },
  'membresdemandes.hopitaux.supprimer_membre': {
    methods: ["DELETE"],
    pattern: '/api/v1/membres/demandes/:id',
    tokens: [{"old":"/api/v1/membres/demandes/:id","type":0,"val":"api","end":""},{"old":"/api/v1/membres/demandes/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/membres/demandes/:id","type":0,"val":"membres","end":""},{"old":"/api/v1/membres/demandes/:id","type":0,"val":"demandes","end":""},{"old":"/api/v1/membres/demandes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['membresdemandes.hopitaux.supprimer_membre']['types'],
  },
  'notifications.notifications.marquer_toutes_lues': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/tout-lire',
    tokens: [{"old":"/api/v1/notifications/tout-lire","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/tout-lire","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/tout-lire","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/tout-lire","type":0,"val":"tout-lire","end":""}],
    types: placeholder as Registry['notifications.notifications.marquer_toutes_lues']['types'],
  },
  'notifications.notifications.preferences': {
    methods: ["PUT"],
    pattern: '/api/v1/notifications/preferences',
    tokens: [{"old":"/api/v1/notifications/preferences","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/preferences","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/preferences","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/preferences","type":0,"val":"preferences","end":""}],
    types: placeholder as Registry['notifications.notifications.preferences']['types'],
  },
  'notifications.notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notifications',
    tokens: [{"old":"/api/v1/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['notifications.notifications.index']['types'],
  },
  'notifications.notifications.marquer_lue': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/:id/lire',
    tokens: [{"old":"/api/v1/notifications/:id/lire","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/:id/lire","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/:id/lire","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/:id/lire","type":1,"val":"id","end":""},{"old":"/api/v1/notifications/:id/lire","type":0,"val":"lire","end":""}],
    types: placeholder as Registry['notifications.notifications.marquer_lue']['types'],
  },
  'rendezVous.rendez_vous.mes_rendez_vous': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rendez-vous/moi',
    tokens: [{"old":"/api/v1/rendez-vous/moi","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/moi","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/moi","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/moi","type":0,"val":"moi","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.mes_rendez_vous']['types'],
  },
  'rendezVous.rendez_vous.rendez_vous_attribues': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rendez-vous/attribues',
    tokens: [{"old":"/api/v1/rendez-vous/attribues","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/attribues","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/attribues","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/attribues","type":0,"val":"attribues","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.rendez_vous_attribues']['types'],
  },
  'rendezVous.rendez_vous.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rendez-vous',
    tokens: [{"old":"/api/v1/rendez-vous","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous","type":0,"val":"rendez-vous","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.index']['types'],
  },
  'rendezVous.rendez_vous.store': {
    methods: ["POST"],
    pattern: '/api/v1/rendez-vous',
    tokens: [{"old":"/api/v1/rendez-vous","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous","type":0,"val":"rendez-vous","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.store']['types'],
  },
  'rendezVous.rendez_vous.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rendez-vous/:id',
    tokens: [{"old":"/api/v1/rendez-vous/:id","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/:id","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.show']['types'],
  },
  'rendezVous.rendez_vous.assigner': {
    methods: ["PATCH"],
    pattern: '/api/v1/rendez-vous/:id/assigner',
    tokens: [{"old":"/api/v1/rendez-vous/:id/assigner","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/:id/assigner","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/:id/assigner","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/:id/assigner","type":1,"val":"id","end":""},{"old":"/api/v1/rendez-vous/:id/assigner","type":0,"val":"assigner","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.assigner']['types'],
  },
  'rendezVous.rendez_vous.confirmer': {
    methods: ["PATCH"],
    pattern: '/api/v1/rendez-vous/:id/confirmer',
    tokens: [{"old":"/api/v1/rendez-vous/:id/confirmer","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/:id/confirmer","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/:id/confirmer","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/:id/confirmer","type":1,"val":"id","end":""},{"old":"/api/v1/rendez-vous/:id/confirmer","type":0,"val":"confirmer","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.confirmer']['types'],
  },
  'rendezVous.rendez_vous.annuler': {
    methods: ["PATCH"],
    pattern: '/api/v1/rendez-vous/:id/annuler',
    tokens: [{"old":"/api/v1/rendez-vous/:id/annuler","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/:id/annuler","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/:id/annuler","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/:id/annuler","type":1,"val":"id","end":""},{"old":"/api/v1/rendez-vous/:id/annuler","type":0,"val":"annuler","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.annuler']['types'],
  },
  'rendezVous.rendez_vous.marquer_effectue': {
    methods: ["PATCH"],
    pattern: '/api/v1/rendez-vous/:id/effectue',
    tokens: [{"old":"/api/v1/rendez-vous/:id/effectue","type":0,"val":"api","end":""},{"old":"/api/v1/rendez-vous/:id/effectue","type":0,"val":"v1","end":""},{"old":"/api/v1/rendez-vous/:id/effectue","type":0,"val":"rendez-vous","end":""},{"old":"/api/v1/rendez-vous/:id/effectue","type":1,"val":"id","end":""},{"old":"/api/v1/rendez-vous/:id/effectue","type":0,"val":"effectue","end":""}],
    types: placeholder as Registry['rendezVous.rendez_vous.marquer_effectue']['types'],
  },
  'resultats.resultats.store': {
    methods: ["POST"],
    pattern: '/api/v1/dons/:donId/resultats',
    tokens: [{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:donId/resultats","type":1,"val":"donId","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"resultats","end":""}],
    types: placeholder as Registry['resultats.resultats.store']['types'],
  },
  'resultats.resultats.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/dons/:donId/resultats',
    tokens: [{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:donId/resultats","type":1,"val":"donId","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"resultats","end":""}],
    types: placeholder as Registry['resultats.resultats.show']['types'],
  },
  'resultats.resultats.update': {
    methods: ["PUT"],
    pattern: '/api/v1/dons/:donId/resultats',
    tokens: [{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"api","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"v1","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"dons","end":""},{"old":"/api/v1/dons/:donId/resultats","type":1,"val":"donId","end":""},{"old":"/api/v1/dons/:donId/resultats","type":0,"val":"resultats","end":""}],
    types: placeholder as Registry['resultats.resultats.update']['types'],
  },
  'rapports.stocks.rapport_dons': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rapports/dons',
    tokens: [{"old":"/api/v1/rapports/dons","type":0,"val":"api","end":""},{"old":"/api/v1/rapports/dons","type":0,"val":"v1","end":""},{"old":"/api/v1/rapports/dons","type":0,"val":"rapports","end":""},{"old":"/api/v1/rapports/dons","type":0,"val":"dons","end":""}],
    types: placeholder as Registry['rapports.stocks.rapport_dons']['types'],
  },
  'rapports.donors.rapport_donneurs': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rapports/donneurs',
    tokens: [{"old":"/api/v1/rapports/donneurs","type":0,"val":"api","end":""},{"old":"/api/v1/rapports/donneurs","type":0,"val":"v1","end":""},{"old":"/api/v1/rapports/donneurs","type":0,"val":"rapports","end":""},{"old":"/api/v1/rapports/donneurs","type":0,"val":"donneurs","end":""}],
    types: placeholder as Registry['rapports.donors.rapport_donneurs']['types'],
  },
  'rapports.stocks.rapport_stocks': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rapports/stocks',
    tokens: [{"old":"/api/v1/rapports/stocks","type":0,"val":"api","end":""},{"old":"/api/v1/rapports/stocks","type":0,"val":"v1","end":""},{"old":"/api/v1/rapports/stocks","type":0,"val":"rapports","end":""},{"old":"/api/v1/rapports/stocks","type":0,"val":"stocks","end":""}],
    types: placeholder as Registry['rapports.stocks.rapport_stocks']['types'],
  },
  'rapports.hopitaux.rapport_hopitaux': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rapports/hopitaux',
    tokens: [{"old":"/api/v1/rapports/hopitaux","type":0,"val":"api","end":""},{"old":"/api/v1/rapports/hopitaux","type":0,"val":"v1","end":""},{"old":"/api/v1/rapports/hopitaux","type":0,"val":"rapports","end":""},{"old":"/api/v1/rapports/hopitaux","type":0,"val":"hopitaux","end":""}],
    types: placeholder as Registry['rapports.hopitaux.rapport_hopitaux']['types'],
  },
  'rapports.stocks.rapport_performance': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/rapports/performance',
    tokens: [{"old":"/api/v1/rapports/performance","type":0,"val":"api","end":""},{"old":"/api/v1/rapports/performance","type":0,"val":"v1","end":""},{"old":"/api/v1/rapports/performance","type":0,"val":"rapports","end":""},{"old":"/api/v1/rapports/performance","type":0,"val":"performance","end":""}],
    types: placeholder as Registry['rapports.stocks.rapport_performance']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
