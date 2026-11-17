
import type { HttpContext } from '@adonisjs/core/http'

import Artist from '#models/artist'
import ArtistService from '#services/artist_service'

import {
  createArtistValidator,
  listArtistsValidator,
  syncArtistGenresValidator,
} from '#validators/artist'

export default class ArtistsController {
  /**
   * Lista artistas ativos com paginação e filtros.
   */
  async index({ request, response }: HttpContext) {
    const filters = await request.validateUsing(listArtistsValidator)

    const page = filters.page ?? 1
    const limit = filters.limit ?? 15

    const query = Artist.query()
      .where('status', 'active')
      .orderBy('createdAt', 'desc')

    if (filters.search) {
      query.where('name', 'like', `%${filters.search}%`)
    }

    if (filters.type) {
      query.where('type', filters.type)
    }

    const artists = await query.paginate(page, limit)

    return response.ok({
      data: artists.all().map((artist) => ({
        id: String(artist.id),
        name: artist.name,
        slug: artist.slug,
        type: artist.type,
        bio: artist.bio,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        avatarUrl: artist.avatarUrl,
        coverUrl: artist.coverUrl,
        status: artist.status,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      })),
      meta: artists.getMeta(),
    })
  }

  /**
   * Exibe os detalhes de um artista.
   */
  async show({ params, response }: HttpContext) {
    const artistId = String(params.id)

    if (!/^[1-9]\d*$/.test(artistId)) {
      return response.badRequest({
        message: 'ID do artista inválido.',
      })
    }

    const artist = await Artist.query()
      .where('id', artistId)
      .where('status', 'active')
      .preload('genres')
      .preload('members', (query) => {
        query
          .where('isActive', true)
          .orderBy('sortOrder', 'asc')
      })
      .preload('followers')
      .first()

    if (!artist) {
      return response.notFound({
        message: 'Artista não encontrado.',
      })
    }

    return response.ok({
      data: {
        id: String(artist.id),
        name: artist.name,
        slug: artist.slug,
        type: artist.type,
        bio: artist.bio,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        avatarUrl: artist.avatarUrl,
        coverUrl: artist.coverUrl,
        status: artist.status,

        genres: artist.genres.map((genre) => ({
          id: String(genre.id),
          name: genre.name,
          slug: genre.slug,
        })),

        members: artist.members.map((member) => ({
          id: String(member.id),
          name: member.name,
          position: member.position,
          bio: member.bio,
          photoUrl: member.photoUrl,
          sortOrder: member.sortOrder,
        })),

        followersCount: artist.followers.length,

        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      },
    })
  }

  /**
   * Cria uma nova vitrine de artista.
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const payload = await request.validateUsing(createArtistValidator)

    const artistService = new ArtistService()

    const artist = await artistService.create(user.id, payload)

    return response.created({
      message: 'Artista criado com sucesso.',
      data: {
        id: String(artist.id),
        name: artist.name,
        slug: artist.slug,
        type: artist.type,
        bio: artist.bio,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        avatarUrl: artist.avatarUrl,
        coverUrl: artist.coverUrl,
        status: artist.status,
        createdAt: artist.createdAt,
        updatedAt: artist.updatedAt,
      },
    })
  }

  /**
   * Atualiza os gêneros musicais de uma vitrine.
   */
  async syncGenres({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const artistId = String(params.id)

    if (!/^[1-9]\d*$/.test(artistId)) {
      return response.badRequest({
        message: 'ID do artista inválido.',
      })
    }

    const payload = await request.validateUsing(
      syncArtistGenresValidator
    )

    const artistService = new ArtistService()

    const result = await artistService.syncGenres(
      artistId,
      user.id,
      payload.genreIds
    )

    if (result.status === 'not_found') {
      return response.notFound({
        message: 'Artista não encontrado.',
      })
    }

    if (result.status === 'forbidden') {
      return response.forbidden({
        message: 'Você não tem permissão para editar esta vitrine.',
      })
    }

    if (result.status === 'invalid_genres') {
      return response.badRequest({
        message: 'Um ou mais gêneros informados não existem.',
      })
    }

    return response.ok({
      message: 'Gêneros do artista atualizados com sucesso.',
      data: {
        artistId: String(result.artist.id),
        genres: result.artist.genres.map((genre) => ({
          id: String(genre.id),
          name: genre.name,
          slug: genre.slug,
        })),
      },
    })
  }
}
