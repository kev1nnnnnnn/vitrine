import { GenreSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import Artist from '#models/artist'

export default class Genre extends GenreSchema {
  @manyToMany(() => Artist, {
    pivotTable: 'artist_genres',
    pivotForeignKey: 'genre_id',
    pivotRelatedForeignKey: 'artist_id',
    pivotTimestamps: true,
  })
  declare artists: ManyToMany<typeof Artist>
}