
import db from '@adonisjs/lucid/services/db'

import Artist from '#models/artist'
import ArtistMember from '#models/artist_member'
import ArtistUserRole from '#models/artist_user_role'
import User from '#models/user'

interface CreateArtistMemberPayload {
  userId?: number | null
  name: string
  position?: string | null
  bio?: string | null
  photoUrl?: string | null
  sortOrder?: number
  isActive?: boolean
}

interface UpdateArtistMemberPayload {
  userId?: number | null
  name?: string
  position?: string | null
  bio?: string | null
  photoUrl?: string | null
  sortOrder?: number
  isActive?: boolean
}

type ArtistMemberResult =
  | { status: 'success'; member: ArtistMember }
  | { status: 'not_found' }
  | { status: 'forbidden' }
  | { status: 'invalid_user' }

export default class ArtistMemberService {
  async index(
    artistId: string,
    userId: number | bigint
  ): Promise<ArtistMemberResult | { status: 'success'; members: ArtistMember[] }> {
    const artist = await Artist.query()
      .where('id', artistId)
      .first()

    if (!artist) {
      return { status: 'not_found' }
    }

    const permission = await this.hasPermission(artistId, userId)

    if (!permission) {
      return { status: 'forbidden' }
    }

    const members = await ArtistMember.query()
      .where('artistId', artistId)
      .orderBy('sortOrder', 'asc')
      .orderBy('id', 'asc')

    return {
      status: 'success',
      members,
    }
  }

  async create(
    artistId: string,
    userId: number | bigint,
    payload: CreateArtistMemberPayload
  ): Promise<ArtistMemberResult> {
    return db.transaction(async (trx) => {
      const artist = await Artist.query({ client: trx })
        .where('id', artistId)
        .first()

      if (!artist) {
        return { status: 'not_found' }
      }

      const permission = await this.hasPermission(
        artistId,
        userId,
        trx
      )

      if (!permission) {
        return { status: 'forbidden' }
      }

      if (payload.userId !== undefined && payload.userId !== null) {
        const user = await User.query({ client: trx })
          .where('id', String(payload.userId))
          .first()

        if (!user) {
          return { status: 'invalid_user' }
        }
      }

      const member = await ArtistMember.create(
        {
          artistId: artist.id,
          userId: payload.userId ?? null,
          name: payload.name,
          position: payload.position ?? null,
          bio: payload.bio ?? null,
          photoUrl: payload.photoUrl ?? null,
          sortOrder: payload.sortOrder ?? 0,
          isActive: payload.isActive ?? true,
        },
        { client: trx }
      )

      return {
        status: 'success',
        member,
      }
    })
  }

  async update(
    artistId: string,
    memberId: string,
    userId: number | bigint,
    payload: UpdateArtistMemberPayload
  ): Promise<ArtistMemberResult> {
    return db.transaction(async (trx) => {
      const permission = await this.hasPermission(
        artistId,
        userId,
        trx
      )

      if (!permission) {
        const artist = await Artist.query({ client: trx })
          .where('id', artistId)
          .first()

        return artist
          ? { status: 'forbidden' }
          : { status: 'not_found' }
      }

      const member = await ArtistMember.query({ client: trx })
        .where('id', memberId)
        .where('artistId', artistId)
        .first()

      if (!member) {
        return { status: 'not_found' }
      }

      if (payload.userId !== undefined && payload.userId !== null) {
        const user = await User.query({ client: trx })
          .where('id', String(payload.userId))
          .first()

        if (!user) {
          return { status: 'invalid_user' }
        }
      }

      if (payload.userId !== undefined) member.userId = payload.userId
      if (payload.name !== undefined) member.name = payload.name
      if (payload.position !== undefined) member.position = payload.position
      if (payload.bio !== undefined) member.bio = payload.bio
      if (payload.photoUrl !== undefined) member.photoUrl = payload.photoUrl
      if (payload.sortOrder !== undefined) member.sortOrder = payload.sortOrder
      if (payload.isActive !== undefined) member.isActive = payload.isActive

      member.useTransaction(trx)
      await member.save()

      return {
        status: 'success',
        member,
      }
    })
  }

  async delete(
    artistId: string,
    memberId: string,
    userId: number | bigint
  ): Promise<
    | { status: 'success' }
    | { status: 'not_found' }
    | { status: 'forbidden' }
  > {
    return db.transaction(async (trx) => {
      const permission = await this.hasPermission(
        artistId,
        userId,
        trx
      )

      if (!permission) {
        const artist = await Artist.query({ client: trx })
          .where('id', artistId)
          .first()

        return artist
          ? { status: 'forbidden' }
          : { status: 'not_found' }
      }

      const member = await ArtistMember.query({ client: trx })
        .where('id', memberId)
        .where('artistId', artistId)
        .first()

      if (!member) {
        return { status: 'not_found' }
      }

      await member.delete()

      return { status: 'success' }
    })
  }

  private async hasPermission(
    artistId: string,
    userId: number | bigint,
    trx?: Parameters<typeof ArtistUserRole.query>[0] extends never
      ? never
      : import('@adonisjs/lucid/types/database').TransactionClientContract
  ): Promise<boolean> {
    const query = ArtistUserRole.query(
      trx ? { client: trx } : undefined
    )
      .where('artistId', artistId)
      .where('userId', String(userId))
      .whereIn('role', ['owner', 'admin', 'editor'])

    return Boolean(await query.first())
  }
}
