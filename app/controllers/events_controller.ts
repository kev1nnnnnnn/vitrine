
import type { HttpContext } from '@adonisjs/core/http'

import EventService from '#services/event_service'

import {
  createEventValidator,
  updateEventValidator,
  listEventsValidator,
  showEventValidator,
} from '#validators/event'

export default class EventsController {
  private eventService = new EventService()

  /**
   * GET /api/v1/events
   * Lista eventos públicos.
   */
  async index({ request, response }: HttpContext) {
    const payload = await listEventsValidator.validate(request.qs())

    const result = await this.eventService.list(payload)

    return response.ok({
      data: result.events,
      meta: result.meta,
    })
  }

  /**
   * GET /api/v1/events/:id
   * Consulta um evento.
   */
  async show({ params, response, auth }: HttpContext) {
    const payload = await showEventValidator.validate({
      id: Number(params.id),
    })

    const result = await this.eventService.findById(
      String(payload.id),
      auth.user?.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.event,
        })

      case 'not_found':
        return response.notFound({
          message: 'Evento não encontrado.',
        })
    }
  }

  /**
   * POST /api/v1/events
   * Cadastra um evento.
   */
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createEventValidator)

    const result = await this.eventService.create(
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Evento cadastrado com sucesso.',
          data: result.event,
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para cadastrar eventos.',
        })

      case 'invalid_date':
        return response.badRequest({
          message: 'Uma ou mais datas informadas são inválidas.',
        })

      case 'invalid_period':
        return response.badRequest({
          message: 'A data de encerramento deve ser posterior à data de início.',
        })

      case 'venue_not_found':
        return response.notFound({
          message: 'O local informado não foi encontrado.',
        })

      case 'venue_inactive':
        return response.unprocessableEntity({
          message: 'O local informado está desativado e não pode ser associado ao evento.',
        })
    }
  }

  /**
   * PUT /api/v1/events/:id
   * Atualiza um evento.
   */
  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateEventValidator)

    const result = await this.eventService.update(
      String(params.id),
      auth.user!.id,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Evento atualizado com sucesso.',
          data: result.event,
        })

      case 'not_found':
        return response.notFound({
          message: 'Evento não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para atualizar este evento.',
        })

      case 'invalid_date':
        return response.badRequest({
          message: 'Uma ou mais datas informadas são inválidas.',
        })

      case 'invalid_period':
        return response.badRequest({
          message: 'A data de encerramento deve ser posterior à data de início.',
        })

      case 'venue_not_found':
        return response.notFound({
          message: 'O local informado não foi encontrado.',
        })

      case 'venue_inactive':
        return response.unprocessableEntity({
          message: 'O local informado está desativado e não pode ser associado ao evento.',
        })
    }
  }

  /**
   * PATCH /api/v1/events/:id/cancel
   * Cancela um evento sem excluí-lo.
   */
  async cancel({ params, response, auth }: HttpContext) {
    const payload = await showEventValidator.validate({
      id: Number(params.id),
    })

    const result = await this.eventService.cancel(
      String(payload.id),
      auth.user!.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Evento cancelado com sucesso.',
          data: result.event,
        })

      case 'not_found':
        return response.notFound({
          message: 'Evento não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para cancelar este evento.',
        })
    }
  }
}
