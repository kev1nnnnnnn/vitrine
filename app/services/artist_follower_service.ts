
import db from '@adonisjs/lucid/services/db'

import Artist from '#models/artist'
import ArtistFollower from '#models/artist_follower'

type FollowResult =
  | { status: 'success'; follower: ArtistFollower }
  | { status: 'not_found' }
  | { status: 'already_following' }

type UnfollowResult =
  | { status: 'success' }
  | { status: 'not_found' }
  | { status: 'not_following' }

type ArtistFollowersResult =
  | { status: 'success'; followers: ArtistFollower[] }
  | { status: 'not_found' }

type UserFollowingResult = {
  status: 'success'
  following: ArtistFollower[]
}

type CountFollowersResult =
  | { status: 'success'; count: number }
  | { status: 'not_found' }

export default class ArtistFollowerService {
  /**
   * Segue um artista.
   */
  async follow(
    artistId: string,
    userId: number | bigint
  ): Promise<FollowResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const existingFollow = await ArtistFollower.query()
      .where('artistId', String(artist.id))
      .where('userId', String(userId))
      .first()

    if (existingFollow) {
      return { status: 'already_following' }
    }

    const follower = await ArtistFollower.create({
      artistId: artist.id,
      userId,
    })

    return {
      status: 'success',
      follower,
    }
  }

  /**
   * Deixa de seguir um artista.
   */
  async unfollow(
    artistId: string,
    userId: number | bigint
  ): Promise<UnfollowResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const follower = await ArtistFollower.query()
      .where('artistId', String(artist.id))
      .where('userId', String(userId))
      .first()

    if (!follower) {
      return { status: 'not_following' }
    }

    await follower.delete()

    return {
      status: 'success',
    }
  }

  /**
   * Lista os seguidores de um artista.
   */
  async getArtistFollowers(
    artistId: string
  ): Promise<ArtistFollowersResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const followers = await ArtistFollower.query()
      .where('artistId', String(artist.id))
      .preload('user')
      .orderBy('createdAt', 'desc')

    return {
      status: 'success',
      followers,
    }
  }

  /**
   * Lista os artistas seguidos por um usuário.
   */
  async getUserFollowing(
    userId: number | bigint
  ): Promise<UserFollowingResult> {
    const following = await ArtistFollower.query()
      .where('userId', String(userId))
      .preload('artist')
      .orderBy('createdAt', 'desc')

    return {
      status: 'success',
      following,
    }
  }

  /**
   * Consulta a quantidade de seguidores de um artista.
   */
  async countFollowers(
    artistId: string
  ): Promise<CountFollowersResult> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const result = await db
      .from('artist_followers')
      .where('artist_id', String(artist.id))
      .count('* as total')
      .first()

    return {
      status: 'success',
      count: Number(result?.total ?? 0),
    }
  }
}
