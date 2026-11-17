
import vine from '@vinejs/vine'

export const listGenresValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),
  limit: vine.number().positive().withoutDecimals().max(100).optional(),
  search: vine.string().trim().maxLength(100).optional(),
})

export const showGenreValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
