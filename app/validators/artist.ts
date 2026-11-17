
import vine from '@vinejs/vine'

export const createArtistValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(150),

  type: vine.enum(['band', 'solo', 'duo', 'group']),

  bio: vine.string().trim().maxLength(5000).nullable().optional(),

  city: vine.string().trim().maxLength(100).nullable().optional(),

  state: vine.string().trim().fixedLength(2).nullable().optional(),

  country: vine.string().trim().maxLength(100).nullable().optional(),

  avatarUrl: vine.string().trim().url().maxLength(2048).nullable().optional(),

  coverUrl: vine.string().trim().url().maxLength(2048).nullable().optional(),
})

export const listArtistsValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),

  limit: vine.number().positive().withoutDecimals().max(100).optional(),

  search: vine.string().trim().maxLength(150).optional(),

  type: vine.enum(['band', 'solo', 'duo', 'group']).optional(),
})

export const showArtistValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})


export const syncArtistGenresValidator = vine.create({
  genreIds: vine.array(
    vine.number().positive().withoutDecimals()
  ),
})
