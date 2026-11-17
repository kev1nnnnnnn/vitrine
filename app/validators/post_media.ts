
import vine from '@vinejs/vine'

const mediaType = vine.enum(['image', 'video'] as const)

const mediaUrl = vine.string().trim().url().maxLength(2048)

const thumbnailUrl = vine
  .string()
  .trim()
  .url()
  .maxLength(2048)
  .nullable()
  .optional()

const altText = vine
  .string()
  .trim()
  .maxLength(255)
  .nullable()
  .optional()

const sortOrder = vine
  .number()
  .min(0)
  .withoutDecimals()
  .optional()

export const createPostMediaValidator = vine.create({
  type: mediaType,
  url: mediaUrl,
  thumbnailUrl,
  altText,
  sortOrder,
})

export const updatePostMediaValidator = vine.create({
  type: mediaType.optional(),
  url: mediaUrl.optional(),
  thumbnailUrl,
  altText,
  sortOrder,
})

export const showPostMediaValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})

export const listPostMediasValidator = vine.create({
  postId: vine.number().positive().withoutDecimals(),
})
