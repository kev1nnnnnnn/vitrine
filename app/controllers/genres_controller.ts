
import type { HttpContext } from '@adonisjs/core/http'

import GenreService from '#services/genre_service'
import {
  listGenresValidator,
  showGenreValidator,
} from '#validators/genre'

export default class GenresController {
  private genreService = new GenreService()

  async index({ request, response }: HttpContext) {
    const filters = await request.validateUsing(listGenresValidator)

    const genres = await this.genreService.list(filters)

    return response.ok(genres.toJSON())
  }

  async show({ params, response }: HttpContext) {
    const { id } = await showGenreValidator.validate({
      id: params.id,
    })

    const genre = await this.genreService.findById(id)

    if (!genre) {
      return response.notFound({
        message: 'Gênero musical não encontrado.',
      })
    }

    return response.ok({
      data: genre,
    })
  }
}
