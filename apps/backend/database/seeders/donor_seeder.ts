import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import User from '#models/user'
import Donneur from '#models/donneur'
import hash from '@adonisjs/core/services/hash'

type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export default class DonneurSeeder extends BaseSeeder {
  public async run() {
    const prenoms = [
      'Prince',
      'Bilal',
      'Awa',
      'Jean',
      'Mariam',
      'Clarisse',
      'Fatou',
      'Koffi',
      'Aminata',
      'Yao',
      'Noella',
      'Espoir',
      'Serge',
      'Rodrigue',
      'Aïcha',
      'Kodjo',
    ]

    const noms = [
      'EKPINSE',
      'SOULE',
      'KIKI',
      'DOSSOU',
      'ZINSOU',
      'ADJOVI',
      'MENSAH',
      'DIALLO',
      'SARR',
      'HOUNTON',
      'GBEDO',
      'TOSSOU',
      'AHOUANGAN',
      'AGOSSOU',
      'SOSSOU',
    ]

    const groupes: GroupeSanguin[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

    const communes = ['Cotonou', 'Calavi', 'Porto-Novo', 'Parakou', 'Abomey', 'Lokossa']
    const departements = ['Littoral', 'Atlantique', 'Ouémé', 'Borgou', 'Zou', 'Mono']

    for (let i = 1; i <= 120; i++) {
      const prenom = prenoms[Math.floor(Math.random() * prenoms.length)]
      const nom = noms[Math.floor(Math.random() * noms.length)]
      const groupe = groupes[Math.floor(Math.random() * groupes.length)]

      const email = `${prenom.toLowerCase()}.${nom.toLowerCase()}.${i}@mail.bj`

      const user = await User.updateOrCreate(
        { email },

        {
          prenom,
          nom,
          nomComplet: `${prenom} ${nom}`,
          email,

          motDePasse: await hash.make('Password@123'),

          telephone: `+22997${String(i).padStart(6, '0')}`,
          commune: communes[i % communes.length],
          departement: departements[i % departements.length],
          dateNaissance: DateTime.now().minus({
            years: 18 + (i % 30),
          }),
          role: 'donneur',
          estActif: true,
        }
      )

      const totalDons = Math.floor(Math.random() * 30)

      const dateDernierDon =
        totalDons > 0 ? DateTime.now().minus({ days: Math.floor(Math.random() * 200) }) : null

      const dateEligibiliteSuivante = dateDernierDon?.plus({ days: 90 }) ?? null

      await Donneur.updateOrCreate(
        { utilisateurId: user.id },

        {
          utilisateurId: user.id,
          codeDonneur: `BC-2026-${String(i).padStart(5, '0')}`,
          groupeSanguin: groupe,
          totalDons,
          dateDernierDon,
          dateEligibiliteSuivante,

          niveauBadge:
            totalDons >= 25
              ? 'platine'
              : totalDons >= 10
                ? 'or'
                : totalDons >= 4
                  ? 'argent'
                  : totalDons >= 1
                    ? 'bronze'
                    : 'aucun',

          donneesQrCode: `QR-BC-${i}-${email}`,
        }
      )
    }

    console.log('🔥 Seeder donneurs exécuté sans duplication + safe update')
  }
}
