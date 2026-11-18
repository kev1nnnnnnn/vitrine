
import vine from '@vinejs/vine'

const targetType = vine.enum([
  'artist',
  'event',
  'post',
  'report',
  'user',
] as const)

const action = vine.enum([
  'approve',
  'hide',
  'block',
  'restore',
  'reject',
  'delete',
  'warn',
  'other',
] as const)

const reason = vine
  .string()
  .trim()
  .maxLength(2000)
  .nullable()
  .optional()

const metadata = vine
  .any()
  .nullable()
  .optional()

export const createModerationLogValidator = vine.create({
  targetType,
  targetId: vine.number().positive().withoutDecimals(),
  action,
  reason,
  metadata,
})
