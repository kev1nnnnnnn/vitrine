
import vine from '@vinejs/vine'

export const listNotificationsValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),
  limit: vine.number().positive().withoutDecimals().max(100).optional(),
  unreadOnly: vine.boolean().optional(),
})

export const showNotificationValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
