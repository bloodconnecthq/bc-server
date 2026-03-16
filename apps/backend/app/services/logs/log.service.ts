import Log from '#models/log'

export default class LogService {
  async create(action: string, entity: string, userId?: string | number, description?: string) {
    await Log.create({
      action,
      entity,
      userId: userId ? String(userId) : null,
      description: description ?? null,
    })
  }
}
