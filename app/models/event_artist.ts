
import { EventArtistSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Event from '#models/event'
import Artist from '#models/artist'

export default class EventArtist extends EventArtistSchema {
  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => Artist)
  declare artist: BelongsTo<typeof Artist>
}
