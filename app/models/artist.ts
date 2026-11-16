import { ArtistSchema } from '#database/schema'
import { belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  ManyToMany,
  HasMany,
} from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Genre from '#models/genre'
import ArtistMember from '#models/artist_member'
import ArtistFollower from '#models/artist_follower'
import Post from '#models/post'
import Event from '#models/event'

export default class Artist extends ArtistSchema {
  @belongsTo(() => User, {
    foreignKey: 'createdByUserId',
  })
  declare createdByUser: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'artist_user_roles',
    pivotForeignKey: 'artist_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Genre, {
    pivotTable: 'artist_genres',
    pivotForeignKey: 'artist_id',
    pivotRelatedForeignKey: 'genre_id',
    pivotTimestamps: true,
  })
  declare genres: ManyToMany<typeof Genre>

  @hasMany(() => ArtistMember)
  declare members: HasMany<typeof ArtistMember>

  @hasMany(() => ArtistFollower)
  declare followers: HasMany<typeof ArtistFollower>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @manyToMany(() => Event, {
    pivotTable: 'event_artists',
    pivotForeignKey: 'artist_id',
    pivotRelatedForeignKey: 'event_id',
    pivotColumns: [
      'performance_name',
      'performance_starts_at',
      'performance_ends_at',
    ],
    pivotTimestamps: true,
  })
  declare events: ManyToMany<typeof Event>
}