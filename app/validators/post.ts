
import vine from '@vinejs/vine'

const postStatus = vine.enum(['draft', 'published', 'hidden'] as const)

const content = vine.string().trim().maxLength(10000).nullable().optional()

const status = postStatus.optional()

export const createPostValidator = vine.create({
  content,
  status,
})

export const updatePostValidator = vine.create({
  content,
  status,
})

export const listPostsValidator = vine.create({
  page: vine.number().positive().withoutDecimals().optional(),
  limit: vine.number().positive().withoutDecimals().max(100).optional(),
})

export const showPostValidator = vine.create({
  id: vine.number().positive().withoutDecimals(),
})
