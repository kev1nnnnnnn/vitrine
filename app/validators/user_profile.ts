
import vine from '@vinejs/vine'

export const updateUserProfileValidator = vine.create({
  fullName: vine.string().trim().maxLength(120).nullable().optional(),

  phone: vine.string().trim().maxLength(20).nullable().optional(),

  avatarUrl: vine.string().url().nullable().optional(),

  bio: vine.string().trim().maxLength(2000).nullable().optional(),

  city: vine.string().trim().maxLength(100).nullable().optional(),

  state: vine.string().trim().fixedLength(2).nullable().optional(),
})
