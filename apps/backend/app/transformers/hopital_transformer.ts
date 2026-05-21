import type Hopital from '#models/hopital'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class HopitalTransformer extends BaseTransformer<Hopital> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'nom',
      'type',
      'adresse',
      'commune',
      'departement',
      'telephone',
      'email',
      'latitude',
      'longitude',
      'estActif',
      'created_at',
      'updated_at',
    ])
  }
}
