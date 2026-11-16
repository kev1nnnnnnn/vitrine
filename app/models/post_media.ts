import { PostMediaSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Post from '#models/post'

export default class PostMedia extends PostMediaSchema {
  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>
}