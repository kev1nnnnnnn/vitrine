
import vine from '@vinejs/vine'

const name = vine.string().trim().minLength(2).maxLength(180)

const description = vine
  .string()
  .trim()
  .maxLength(255)
  .nullable()
  .optional()

const address = vine
  .string()
  .trim()
  .maxLength(255)
  .nullable()
  .optional()

const number = vine
  .string()
  .trim()
  .maxLength(30)
  .nullable()
  .optional()

const complement = vine
  .string()
  .trim()
  .maxLength(150)
  .nullable()
  .optional()

const neighborhood = vine
  .string()
  .trim()
  .maxLength(120)
  .nullable()
  .optional()

const city = vine.string().trim().minLength(2).maxLength(100)

const state = vine.string().trim().fixedLength(2)

const postalCode = vine
  .string()
  .trim()
  .maxLength(15)
  .nullable()
  .optional()

const country = vine
  .string()
  .trim()
  .maxLength(100)
  .optional()

const latitude = vine
  .number()
  .min(-90)
  .max(90)
  .nullable()
  .optional()

const longitude = vine
  .number()
  .min(-180)
  .max(180)
  .nullable()
  .optional()

const phone = vine
  .string()
  .trim()
  .maxLength(30)
  .nullable()
  .optional()

const website = vine
  .string()
  .trim()
  .url()
  .maxLength(2048)
  .nullable()
  .optional()

export const createVenueValidator = vine.create({
  name,
  description,
  address,
  number,
  complement,
  neighborhood,
  city,
  state,
  postalCode,
  country,
  latitude,
  longitude,
  phone,
  website,
})

export const updateVenueValidator = vine.create({
  name: name.optional(),
  description,
  address,
  number,
  complement,
  neighborhood,
  city: city.optional(),
  state: state.optional(),
  postalCode,
  country,
  latitude,
  longitude,
  phone,
  website,
})

export const listVenuesValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),
  limit: vine.number().positive().withoutDecimals().max(100).optional(),
  search: vine.string().trim().maxLength(180).optional(),
  city: vine.string().trim().maxLength(100).optional(),
  state: vine.string().trim().fixedLength(2).optional(),
})

export const showVenueValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
