import { PostSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Artist from '#models/artist'
import User from '#models/user'
import PostMedia from '#models/post_media'

export default class Post extends PostSchema {
  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  declare createdByUser: BelongsTo<typeof User>

  @hasMany(() => PostMedia)
  declare medias: HasMany<typeof PostMedia>
}