
import vine from '@vinejs/vine'

const performanceName = vine
  .string()
  .trim()
  .maxLength(180)
  .nullable()
  .optional()

const performanceStartsAt = vine
  .string()
  .trim()
  .maxLength(50)
  .nullable()
  .optional()

const performanceEndsAt = vine
  .string()
  .trim()
  .maxLength(50)
  .nullable()
  .optional()

export const attachArtistValidator = vine.create({
  artistId: vine.number().positive().withoutDecimals(),
  performanceName,
  performanceStartsAt,
  performanceEndsAt,
})

export const updateArtistPerformanceValidator = vine.create({
  performanceName,
  performanceStartsAt,
  performanceEndsAt,
})
