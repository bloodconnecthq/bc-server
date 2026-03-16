import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Donor from '#models/donor'

export default class extends BaseSeeder {
  async run() {
    await Donor.createMany([
      { name: 'Jean Dupont', bloodGroup: 'A+', phone: '0600000001' },
      { name: 'Marie Martin', bloodGroup: 'O-', phone: '0600000002' },
    ])
  }
}