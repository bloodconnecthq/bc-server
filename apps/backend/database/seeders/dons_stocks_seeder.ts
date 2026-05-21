import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Don from '#models/don'
import Donneur from '#models/donneur'
import User from '#models/user'
import Hopital from '#models/hopital'
import MembresHopital from '#models/membres_hopital'
import PocheSang from '#models/poche_sang'
import StockSanguin from '#models/stock_sanguin'

type DonStatut = 'en_attente' | 'valide' | 'rejete'
type PocheStatut = 'disponible' | 'utilisee' | 'expiree' | 'detruite'
type TypePoche = 'DCL' | 'PCL'

const AGENT_EMAILS = [
  'infirmier1@ebloodsys.bj',
  'infirmier2@ebloodsys.bj',
  'infirmier3@ebloodsys.bj',
  'medecin1@ebloodsys.bj',
  'medecin2@ebloodsys.bj',
  'medecin3@ebloodsys.bj',
]

const TYPES: TypePoche[] = ['DCL', 'PCL']
const GROUPES: Array<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'> = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
]

export default class DonsStocksSeeder extends BaseSeeder {
  public async run() {
    const donneurs = await Donneur.query().preload('utilisateur')
    const agents = await User.query().whereIn('email', AGENT_EMAILS)
    const membershipRows = await MembresHopital.query().select('hopital_id')
    const hopitalIds = Array.from(new Set(membershipRows.map((row) => row.hopitalId)))
    const hopitaux = await Hopital.query().whereIn('id', hopitalIds)

    if (!donneurs.length || !agents.length || !hopitaux.length) {
      console.warn('DonsStocksSeeder: donneurs, agents ou hopitaux manquants. Seed interrompu.')
      return
    }

    const stockCounts = new Map<string, number>()

    for (let index = 1; index <= 36; index++) {
      const donneur = donneurs[index % donneurs.length]
      const hopital = hopitaux[index % hopitaux.length]
      const agent = agents[index % agents.length]

      const typePoche = TYPES[Math.floor(Math.random() * TYPES.length)]
      const statut = index % 10 === 0 ? 'rejete' : index % 4 === 0 ? 'en_attente' : 'valide'

      const dateDon = DateTime.now().minus({ days: Math.floor(Math.random() * 90) })
      const volume = typePoche === 'PCL' ? 350 : 450
      const groupeSanguin =
        donneur.groupeSanguin || GROUPES[Math.floor(Math.random() * GROUPES.length)]

      const don = await Don.create({
        donneurId: donneur.id,
        hopitalId: hopital.id,
        agentId: agent.id,
        dateDon,
        typePoche,
        volume,
        statut,
      })

      const dateExpiration = dateDon.plus({ days: 42 }).toJSDate()
      const pocheStatut: PocheStatut = statut === 'rejete' ? 'detruite' : 'disponible'

      await PocheSang.create({
        donId: don.id,
        groupeSanguin,
        volume,
        typePoche,
        dateExpiration,
        statut: pocheStatut,
      })

      if (pocheStatut === 'disponible') {
        const key = `${hopital.id}_${groupeSanguin}`
        stockCounts.set(key, (stockCounts.get(key) ?? 0) + 1)
      }
    }

    for (const hopital of hopitaux) {
      for (const groupe of GROUPES) {
        const key = `${hopital.id}_${groupe}`
        const quantite = stockCounts.get(key) ?? 0

        await StockSanguin.updateOrCreate(
          {
            hopitalId: hopital.id,
            groupeSanguin: groupe,
          },
          {
            hopitalId: hopital.id,
            groupeSanguin: groupe,
            quantite,
            seuilFaible: 10,
            seuilCritique: 5,
            misAJourLe: DateTime.now().toJSDate(),
          }
        )
      }
    }

    console.log('🔥 Seeder dons + poches + stocks exécuté')
  }
}
