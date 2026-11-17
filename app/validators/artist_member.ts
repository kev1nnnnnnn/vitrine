
import vine from '@vinejs/vine'

export const createArtistMemberValidator = vine.create({
  userId: vine.number().positive().withoutDecimals().nullable().optional(),

  name: vine.string().trim().minLength(2).maxLength(150),

  position: vine.string().trim().maxLength(100).nullable().optional(),

  bio: vine.string().trim().maxLength(5000).nullable().optional(),

  photoUrl: vine.string().trim().url().maxLength(2048).nullable().optional(),

  sortOrder: vine.number().min(0).withoutDecimals().optional(),

  isActive: vine.boolean().optional(),
})

export const updateArtistMemberValidator = vine.create({
  userId: vine.number().positive().withoutDecimals().nullable().optional(),

  name: vine.string().trim().minLength(2).maxLength(150).optional(),

  position: vine.string().trim().maxLength(100).nullable().optional(),

  bio: vine.string().trim().maxLength(5000).nullable().optional(),

  photoUrl: vine.string().trim().url().maxLength(2048).nullable().optional(),

  sortOrder: vine.number().min(0).withoutDecimals().optional(),

  isActive: vine.boolean().optional(),
})
