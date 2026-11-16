
import vine from '@vinejs/vine'

const email = () =>
  vine.string().trim().email().maxLength(254)

const password = () =>
  vine.string().minLength(8).maxLength(128)

export const signupValidator = vine.create({
  fullName: vine.string().trim().maxLength(120).nullable().optional(),
  email: email(),
  password: password(),
  passwordConfirmation: vine.string().sameAs('password'),
})

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
