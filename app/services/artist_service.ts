
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import Artist from '#models/artist'
import ArtistUserRole from '#models/artist_user_role'
import Genre from '#models/genre'

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

type SyncGenresResult =
  | { status: 'success'; artist: Artist }
  | { status: 'not_found' }
  | { status: 'forbidden' }
  | { status: 'invalid_genres' }

export default class ArtistService {
  /**
   * Cria uma nova vitrine e define o usuário como proprietário.
   */
  async create(
    userId: number | bigint,
    payload: CreateArtistPayload
  ): Promise<Artist> {
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

  /**
   * Sincroniza os gêneros musicais de uma vitrine.
   */
  async syncGenres(
    artistId: string,
    userId: number | bigint,
    genreIds: number[]
  ): Promise<SyncGenresResult> {
    return db.transaction(async (trx) => {
      const artist = await Artist.query({ client: trx })
        .where('id', artistId)
        .first()

      if (!artist) {
        return { status: 'not_found' }
      }

      const artistIdString = String(artist.id)
      const userIdString = String(userId)

      // Verifica se o usuário pode administrar a vitrine.
      const permission = await ArtistUserRole.query({ client: trx })
        .where('artistId', artistIdString)
        .where('userId', userIdString)
        .whereIn('role', ['owner', 'admin', 'editor'])
        .first()

      if (!permission) {
        return { status: 'forbidden' }
      }

      // Remove IDs duplicados.
      const uniqueGenreIds = [...new Set(genreIds)]

      // Converte IDs para string para manter compatibilidade
      // com os campos BIGINT e com o Lucid.
      const genreIdsAsStrings = uniqueGenreIds.map((id) => String(id))

      // Confere se todos os gêneros existem.
      if (genreIdsAsStrings.length > 0) {
        const existingGenres = await Genre.query({ client: trx })
          .whereIn('id', genreIdsAsStrings)
          .select('id')

        if (existingGenres.length !== genreIdsAsStrings.length) {
          return { status: 'invalid_genres' }
        }
      }

      // Sincroniza as relações sem criar duplicações.
      await artist
        .related('genres')
        .sync(genreIdsAsStrings, true, trx)

      // Atualiza os gêneros carregados no objeto.
      await artist.load('genres')

      return {
        status: 'success',
        artist,
      }
    })
  }

  /**
   * Gera um slug único para o artista.
   */
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
