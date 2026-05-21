import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const users = [
      // =========================
      // SUPER ADMIN
      // =========================
      {
        nomComplet: 'Dr. Amadou SANDA',
        email: 'admin@ebloodsys.bj',
        motDePasse: await hash.make('Admin@2026!'),
        role: 'super_admin',
        telephone: '+22997000000',
        estActif: true,
      },

      // =========================
      // ADMINS HÔPITAUX
      // =========================
      {
        nomComplet: 'Dr. Fabrice AZEMAHOUSONOU',
        email: 'admin.cnhu@ebloodsys.bj',
        motDePasse: await hash.make('AdminHopital@2026!'),
        role: 'admin_hopital',
        telephone: '+22997000001',
        estActif: true,
      },
      {
        nomComplet: 'Dr. Rosine DOSSOU',
        email: 'admin.chud@ebloodsys.bj',
        motDePasse: await hash.make('AdminHopital@2026!'),
        role: 'admin_hopital',
        telephone: '+22997000002',
        estActif: true,
      },
      {
        nomComplet: 'Dr. Serge HOUNGBEDJI',
        email: 'admin.chu-mel@ebloodsys.bj',
        motDePasse: await hash.make('AdminHopital@2026!'),
        role: 'admin_hopital',
        telephone: '+22997000003',
        estActif: true,
      },

      // =========================
      // MÉDECINS
      // =========================
      {
        nomComplet: 'Dr. Jean-Pierre AFFOGNI',
        email: 'medecin1@ebloodsys.bj',
        motDePasse: await hash.make('Medecin@2026!'),
        role: 'medecin',
        telephone: '+22997100001',
        estActif: true,
      },
      {
        nomComplet: 'Dr. Marie KOUAME',
        email: 'medecin2@ebloodsys.bj',
        motDePasse: await hash.make('Medecin@2026!'),
        role: 'medecin',
        telephone: '+22997100002',
        estActif: true,
      },
      {
        nomComplet: 'Dr. Paul GNONLONFOUN',
        email: 'medecin3@ebloodsys.bj',
        motDePasse: await hash.make('Medecin@2026!'),
        role: 'medecin',
        telephone: '+22997100003',
        estActif: true,
      },

      // =========================
      // INFIRMIERS
      // =========================
      {
        nomComplet: 'Aïssatou SALL',
        email: 'infirmier1@ebloodsys.bj',
        motDePasse: await hash.make('Infirmier@2026!'),
        role: 'infirmier',
        telephone: '+22997200001',
        estActif: true,
      },
      {
        nomComplet: 'Pierre AGOSSOU',
        email: 'infirmier2@ebloodsys.bj',
        motDePasse: await hash.make('Infirmier@2026!'),
        role: 'infirmier',
        telephone: '+22997200002',
        estActif: true,
      },
      {
        nomComplet: 'Kofi MENSAH',
        email: 'infirmier3@ebloodsys.bj',
        motDePasse: await hash.make('Infirmier@2026!'),
        role: 'infirmier',
        telephone: '+22997200003',
        estActif: true,
      },
      {
        nomComplet: 'Grace ADJOVI',
        email: 'infirmier4@ebloodsys.bj',
        motDePasse: await hash.make('Infirmier@2026!'),
        role: 'infirmier',
        telephone: '+22997200004',
        estActif: true,
      },
      {
        nomComplet: 'Yacoub TOURE',
        email: 'infirmier5@ebloodsys.bj',
        motDePasse: await hash.make('Infirmier@2026!'),
        role: 'infirmier',
        telephone: '+22997200005',
        estActif: true,
      },

      // =========================
      // DONNEURS (POOL LARGE)
      // =========================
      {
        nomComplet: 'Prince EKPINSE',
        email: 'prince@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300001',
        estActif: true,
      },
      {
        nomComplet: 'Bilal ADAM SOULE',
        email: 'bilal@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300002',
        estActif: true,
      },
      {
        nomComplet: 'Fatou DIALLO',
        email: 'fatou@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300003',
        estActif: true,
      },
      {
        nomComplet: 'Mohamed SOW',
        email: 'mohamed@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300004',
        estActif: true,
      },
      {
        nomComplet: 'Awa HOUNKPATI',
        email: 'awa@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300005',
        estActif: true,
      },
      {
        nomComplet: 'Jean KIKI',
        email: 'jean@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300006',
        estActif: true,
      },
      {
        nomComplet: 'Mariam DOSSOU',
        email: 'mariam@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300007',
        estActif: true,
      },
      {
        nomComplet: 'Espoir ZINSOU',
        email: 'espoir@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300008',
        estActif: true,
      },
      {
        nomComplet: 'Clarisse AHOUANGAN',
        email: 'clarisse@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300009',
        estActif: true,
      },
      {
        nomComplet: 'Rodrigue TOSSOU',
        email: 'rodrigue@ebloodsys.bj',
        motDePasse: await hash.make('Donneur@2026!'),
        role: 'donneur',
        telephone: '+22997300010',
        estActif: true,
      },
    ]

    for (const user of users) {
      await User.firstOrCreate({ email: user.email }, user as any)
    }
  }
}