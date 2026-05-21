import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hopital from '#models/hopital'
import User from '#models/user'
import MembresHopital from '#models/membres_hopital'

export default class MembresHopitalSeeder extends BaseSeeder {
  public async run() {
    // Les IDs d'hôpital ci-dessous sont copiés depuis la base de données existante
    // et doivent rester inchangés pour refléter les relations déjà présentes.
    const assignments = [
      {
        email: 'admin.cnhu@ebloodsys.bj',
        hopitalId: '2339aaff-f993-45e9-a5d5-7e838943517d',
        userRole: 'admin_hopital',
      },
      {
        email: 'admin.chud@ebloodsys.bj',
        hopitalId: '365a59cd-da6c-42c9-b2f1-6d2f52197baa',
        userRole: 'admin_hopital',
      },
      {
        email: 'admin.chu-mel@ebloodsys.bj',
        hopitalId: '2339aaff-f993-45e9-a5d5-7e838943517d',
        userRole: 'admin_hopital',
      },
      {
        email: 'medecin1@ebloodsys.bj',
        hopitalId: '2339aaff-f993-45e9-a5d5-7e838943517d',
        userRole: 'medecin',
      },
      {
        email: 'medecin2@ebloodsys.bj',
        hopitalId: '21d3717f-197d-4ab6-822d-be425bb78902',
        userRole: 'medecin',
      },
      {
        email: 'medecin3@ebloodsys.bj',
        hopitalId: '365a59cd-da6c-42c9-b2f1-6d2f52197baa',
        userRole: 'medecin',
      },
      {
        email: 'infirmier1@ebloodsys.bj',
        hopitalId: '21d3717f-197d-4ab6-822d-be425bb78902',
        userRole: 'infirmier',
      },
      {
        email: 'infirmier2@ebloodsys.bj',
        hopitalId: '365a59cd-da6c-42c9-b2f1-6d2f52197baa',
        userRole: 'infirmier',
      },
      {
        email: 'infirmier3@ebloodsys.bj',
        hopitalId: '2339aaff-f993-45e9-a5d5-7e838943517d',
        userRole: 'infirmier',
      },
    ]

    for (const assignment of assignments) {
      const user = await User.findBy('email', assignment.email)
      const hopital = await Hopital.find(assignment.hopitalId)

      if (!user || !hopital) {
        continue
      }

      if (user.role !== assignment.userRole) {
        user.role = assignment.userRole as
          | 'donneur'
          | 'infirmier'
          | 'medecin'
          | 'admin_hopital'
          | 'super_admin'
        await user.save()
      }

      await MembresHopital.firstOrCreate(
        {
          utilisateurId: user.id,
          hopitalId: hopital.id,
        },
        {
          utilisateurId: user.id,
          hopitalId: hopital.id,
        }
      )
    }
  }
}
