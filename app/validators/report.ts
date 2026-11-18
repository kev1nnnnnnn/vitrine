
import vine from '@vinejs/vine'

const targetType = vine.enum([
  'artist',
  'event',
  'post',
] as const)

const reason = vine
  .string()
  .trim()
  .minLength(3)
  .maxLength(100)

const description = vine
  .string()
  .trim()
  .maxLength(2000)
  .nullable()
  .optional()

export const createReportValidator = vine.create({
  targetType,
  targetId: vine.number().positive().withoutDecimals(),
  reason,
  description,
})

export const updateReportStatusValidator = vine.create({
  status: vine.enum([
    'reviewed',
    'resolved',
    'rejected',
  ] as const),
})
