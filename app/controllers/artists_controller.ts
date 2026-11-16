
import type { HttpContext } from '@adonisjs/core/http'
import Artist from '#models/artist'
import ArtistService from '#services/artist_service'
import {
  createArtistValidator,
  listArtistsValidator,
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
}
