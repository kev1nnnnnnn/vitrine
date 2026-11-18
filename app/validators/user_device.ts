
import vine from '@vinejs/vine'

const deviceToken = vine
  .string()
  .trim()
  .minLength(1)
  .maxLength(512)

const platform = vine.enum(['android', 'ios', 'web'] as const)

const deviceName = vine
  .string()
  .trim()
  .maxLength(150)
  .nullable()
  .optional()

export const createUserDeviceValidator = vine.create({
  deviceToken,
  platform,
  deviceName,
})

export const updateUserDeviceValidator = vine.create({
  deviceToken: deviceToken.optional(),
  platform: platform.optional(),
  deviceName,
})

export const showUserDeviceValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
