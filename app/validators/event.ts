
import vine from '@vinejs/vine'

const eventType = vine.enum(['show', 'festival', 'concert', 'other'] as const)

const eventStatus = vine.enum(['scheduled', 'cancelled', 'finished'] as const)

const title = vine.string().trim().minLength(2).maxLength(180)

const description = vine.string().trim().maxLength(10000).nullable().optional()

// const slug = vine.string().trim().maxLength(200).optional()

const startsAt = vine.string().trim()

const endsAt = vine.string().trim().nullable().optional()

const coverUrl = vine
  .string()
  .trim()
  .url()
  .maxLength(2048)
  .nullable()
  .optional()

const address = vine.string().trim().maxLength(255).nullable().optional()

const number = vine.string().trim().maxLength(30).nullable().optional()

const complement = vine.string().trim().maxLength(150).nullable().optional()

const neighborhood = vine.string().trim().maxLength(120).nullable().optional()

const city = vine.string().trim().minLength(2).maxLength(100)

const state = vine.string().trim().fixedLength(2)

const postalCode = vine.string().trim().maxLength(15).nullable().optional()

const country = vine.string().trim().maxLength(100).optional()

const latitude = vine.number().min(-90).max(90).nullable().optional()

const longitude = vine.number().min(-180).max(180).nullable().optional()

const venueId = vine.number().positive().withoutDecimals().nullable().optional()

const isPublic = vine.boolean().optional()

export const createEventValidator = vine.create({
  title,
  description,
  type: eventType.optional(),
  startsAt,
  endsAt,
  coverUrl,
  venueId,
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
  isPublic,
})

export const updateEventValidator = vine.create({
  title: title.optional(),
  description,
  type: eventType.optional(),
  startsAt: startsAt.optional(),
  endsAt,
  coverUrl,
  venueId,
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
  isPublic,
  status: eventStatus.optional(),
})

export const listEventsValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),
  limit: vine.number().positive().withoutDecimals().max(100).optional(),
  search: vine.string().trim().maxLength(180).optional(),
  type: eventType.optional(),
  status: eventStatus.optional(),
  city: vine.string().trim().maxLength(100).optional(),
  state: vine.string().trim().fixedLength(2).optional(),
  artistId: vine.number().positive().withoutDecimals().optional(),
  venueId: vine.number().positive().withoutDecimals().optional(),
})

export const showEventValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
