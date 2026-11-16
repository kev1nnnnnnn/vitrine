import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import {
  type AccessToken,
  DbAccessTokensProvider,
} from '@adonisjs/auth/access_tokens'
import {
  hasOne,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type {
  HasOne,
  HasMany,
  ManyToMany,
} from '@adonisjs/lucid/types/relations'

import UserProfile from '#models/user_profile'
import Role from '#models/role'
import ArtistFollower from '#models/artist_follower'
import Artist from '#models/artist'
import Event from '#models/event'
import Post from '#models/post'
import Report from '#models/report'
import UserDevice from '#models/user_device'
import Notification from '#models/notification'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)

  declare currentAccessToken?: AccessToken

  @hasOne(() => UserProfile)
  declare profile: HasOne<typeof UserProfile>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'role_id',
    pivotTimestamps: true,
  })
  declare roles: ManyToMany<typeof Role>

  @hasMany(() => ArtistFollower)
  declare artistFollows: HasMany<typeof ArtistFollower>

  @manyToMany(() => Artist, {
    pivotTable: 'artist_user_roles',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'artist_id',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  declare managedArtists: ManyToMany<typeof Artist>

  @hasMany(() => Event, {
    foreignKey: 'createdByUserId',
  })
  declare createdEvents: HasMany<typeof Event>

  @hasMany(() => Post, {
    foreignKey: 'createdByUserId',
  })
  declare createdPosts: HasMany<typeof Post>

  @hasMany(() => Report, {
    foreignKey: 'reportedByUserId',
  })
  declare submittedReports: HasMany<typeof Report>

  @hasMany(() => Report, {
    foreignKey: 'reviewedByUserId',
  })
  declare reviewedReports: HasMany<typeof Report>

  @hasMany(() => UserDevice)
  declare devices: HasMany<typeof UserDevice>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  get initials(): string {
    const name = this.fullName?.trim()
    const source = name || this.email.split('@')[0] || 'U'
    const parts = source.split(/\s+/).filter(Boolean)

    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
    }

    return source.slice(0, 2).toUpperCase()
  }
}