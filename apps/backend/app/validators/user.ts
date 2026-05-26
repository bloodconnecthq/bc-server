import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

// Validator inscription — donneur uniquement
export const signupValidator = vine.create({
  nomComplet: vine.string().maxLength(255).optional(),
  prenom: vine.string().maxLength(80).optional(),
  nom: vine.string().maxLength(80).optional(),
  email: email(),
  motDePasse: password(),
  motDePasseConfirmation: password().sameAs('motDePasse'),
  telephone: vine.string().maxLength(20).optional(),
  groupeSanguin: vine
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  commune: vine.string().maxLength(100).optional(),
  departement: vine.string().maxLength(100).optional(),
  dateNaissance: vine.date().optional(),
})

// Validator connexion
export const loginValidator = vine.create({
  email: email(),
  motDePasse: vine.string(),
})