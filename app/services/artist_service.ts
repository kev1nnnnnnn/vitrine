
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Artist from '#models/artist'
import ArtistUserRole from '#models/artist_user_role'

interface CreateArtistPayload {
  name: string
  type: 'band' | 'solo' | 'duo' | 'group'
  bio?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  avatarUrl?: string | null
  coverUrl?: string | null
}

export default class ArtistService {
  async create(userId: number | bigint, payload: CreateArtistPayload) {
    return db.transaction(async (trx) => {
      const slug = await this.generateUniqueSlug(payload.name, trx)

      const artist = await Artist.create(
        {
          createdByUserId: userId,
          name: payload.name,
          slug,
          type: payload.type,
          bio: payload.bio ?? null,
          city: payload.city ?? null,
          state: payload.state?.toUpperCase() ?? null,
          country: payload.country ?? null,
          avatarUrl: payload.avatarUrl ?? null,
          coverUrl: payload.coverUrl ?? null,
          status: 'active',
        },
        { client: trx }
      )

      await ArtistUserRole.create(
        {
          artistId: artist.id,
          userId,
          role: 'owner',
        },
        { client: trx }
      )

      return artist
    })
  }

  private async generateUniqueSlug(
    name: string,
    trx: TransactionClientContract
  ): Promise<string> {
    const baseSlug =
      name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'artista'

    let slug = baseSlug
    let counter = 2

    while (
      await Artist.query({ client: trx })
        .where('slug', slug)
        .first()
    ) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }
}
