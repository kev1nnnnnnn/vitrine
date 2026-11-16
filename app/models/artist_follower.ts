import { ArtistFollowerSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Artist from '#models/artist'

export default class ArtistFollower extends ArtistFollowerSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>
}