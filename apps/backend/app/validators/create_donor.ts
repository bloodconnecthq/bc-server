import vine from '@vinejs/vine'

export const createDonorValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2),
    bloodGroup: vine.string(),
    phone: vine.string().minLength(8),
  })
)