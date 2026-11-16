import { ArtistMemberSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Artist from '#models/artist'
import User from '#models/user'

export default class ArtistMember extends ArtistMemberSchema {
  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}