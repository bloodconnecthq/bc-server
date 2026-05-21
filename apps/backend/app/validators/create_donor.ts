import vine from '@vinejs/vine'

export const createDonorValidator = vine.create(
  vine.object({
    utilisateurId: vine.string().uuid().optional(),
    prenom: vine.string().maxLength(80),
    nom: vine.string().maxLength(80),
    groupeSanguin: vine.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).nullable(),
    dateNaissance: vine.date().nullable().optional(),
    telephone: vine.string().maxLength(20).nullable().optional(),
    commune: vine.string().maxLength(100).nullable().optional(),
    departement: vine.string().maxLength(80).nullable().optional(),
  })
)
