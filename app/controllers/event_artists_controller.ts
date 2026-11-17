
import type { HttpContext } from '@adonisjs/core/http'

import EventArtistService from '#services/event_artist_service'
import {
  attachArtistValidator,
  updateArtistPerformanceValidator,
} from '#validators/event_artist'

export default class EventArtistsController {
  private eventArtistService = new EventArtistService()

  /**
   * Lista os artistas associados a um evento.
   */
  async index({ params, auth, response }: HttpContext) {
    const result = await this.eventArtistService.listByEvent(
      params.eventId,
      auth.user?.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.eventArtists,
          total: result.eventArtists.length,
        })

      case 'not_found':
        return response.notFound({
          message: 'Evento não encontrado.',
        })
    }
  }

  /**
   * Associa um artista a um evento.
   */
  async store({ params, auth, request, response }: HttpContext) {
    const data = await request.validateUsing(attachArtistValidator)

    const result = await this.eventArtistService.attach(
      params.eventId,
      data.artistId,
      auth.user!.id,
      {
        performanceName: data.performanceName,
        performanceStartsAt: data.performanceStartsAt,
        performanceEndsAt: data.performanceEndsAt,
      }
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Artista associado ao evento com sucesso.',
          data: result.eventArtist,
        })

      case 'event_not_found':
        return response.notFound({
          message: 'Evento não encontrado.',
        })

      case 'artist_not_found':
        return response.notFound({
          message: 'Artista não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para associar este artista ao evento.',
        })

      case 'already_associated':
        return response.conflict({
          message: 'Este artista já está associado ao evento.',
        })

      case 'invalid_date':
        return response.unprocessableEntity({
          message: 'Uma ou mais datas informadas são inválidas.',
        })

      case 'invalid_period':
        return response.unprocessableEntity({
          message: 'O horário de término deve ser posterior ao horário de início.',
        })
    }
  }

  /**
   * Atualiza os dados da apresentação do artista.
   */
  async update({ params, auth, request, response }: HttpContext) {
    const data = await request.validateUsing(updateArtistPerformanceValidator)

    const result = await this.eventArtistService.update(
      params.eventArtistId,
      auth.user!.id,
      {
        performanceName: data.performanceName,
        performanceStartsAt: data.performanceStartsAt,
        performanceEndsAt: data.performanceEndsAt,
      }
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Apresentação atualizada com sucesso.',
          data: result.eventArtist,
        })

      case 'not_found':
        return response.notFound({
          message: 'Associação entre artista e evento não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para atualizar esta apresentação.',
        })

      case 'invalid_date':
        return response.unprocessableEntity({
          message: 'Uma ou mais datas informadas são inválidas.',
        })

      case 'invalid_period':
        return response.unprocessableEntity({
          message: 'O horário de término deve ser posterior ao horário de início.',
        })
    }
  }

  /**
   * Remove a associação entre artista e evento.
   */
  async destroy({ params, auth, response }: HttpContext) {
    const result = await this.eventArtistService.detach(
      params.eventArtistId,
      auth.user!.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Artista removido do evento com sucesso.',
        })

      case 'not_found':
        return response.notFound({
          message: 'Associação entre artista e evento não encontrada.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para remover este artista do evento.',
        })
    }
  }
}
