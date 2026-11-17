
import { EventSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Venue from '#models/venue'
import Artist from '#models/artist'

export default class Event extends EventSchema {
  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  declare createdByUser: BelongsTo<typeof User>

  @belongsTo(() => Venue)
  declare venue: BelongsTo<typeof Venue>

  @manyToMany(() => Artist, {
    pivotTable: 'event_artists',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'artist_id',
    pivotColumns: [
      'performance_name',
      'performance_starts_at',
      'performance_ends_at',
    ],
    pivotTimestamps: true,
  })
  declare artists: ManyToMany<typeof Artist>
}
