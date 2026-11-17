
import type { HttpContext } from '@adonisjs/core/http'

import { VenueService } from '#services/venue_service'

import {
  createVenueValidator,
  updateVenueValidator,
  listVenuesValidator,
  showVenueValidator,
} from '#validators/venue'

export default class VenuesController {
  private venueService = new VenueService()

  /**
   * GET /api/v1/venues
   * Lista locais ativos.
   */
  async index({ request, response }: HttpContext) {
    const payload = await listVenuesValidator.validate(
      request.qs()
    )

    const result = await this.venueService.list(payload)

    return response.ok({
      data: result.venues,
      meta: result.meta,
    })
  }

  /**
   * GET /api/v1/venues/:id
   * Consulta um local individual.
   */
  async show({ params, response }: HttpContext) {
    const payload = await showVenueValidator.validate({
      id: Number(params.id),
    })

    const result = await this.venueService.findById(
      payload.id
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          data: result.venue,
        })

      case 'not_found':
        return response.notFound({
          message: 'Local não encontrado.',
        })
    }
  }

  /**
   * POST /api/v1/venues
   * Cadastra um novo local.
   */
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(
      createVenueValidator
    )

    const userId = Number(auth.user!.id)

    const result = await this.venueService.create(
      userId,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.created({
          message: 'Local cadastrado com sucesso.',
          data: result.venue,
        })
    }
  }

  /**
   * PUT /api/v1/venues/:id
   * Atualiza um local existente.
   */
  async update({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(
      updateVenueValidator
    )

    const userId = Number(auth.user!.id)

    const result = await this.venueService.update(
      String(params.id),
      userId,
      payload
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Local atualizado com sucesso.',
          data: result.venue,
        })

      case 'not_found':
        return response.notFound({
          message: 'Local não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para atualizar este local.',
        })
    }
  }

  /**
   * DELETE /api/v1/venues/:id
   * Desativa um local sem excluí-lo.
   */
  async destroy({ params, response, auth }: HttpContext) {
    const payload = await showVenueValidator.validate({
      id: Number(params.id),
    })

    const userId = Number(auth.user!.id)

    const result = await this.venueService.deactivate(
      String(payload.id),
      userId
    )

    switch (result.status) {
      case 'success':
        return response.ok({
          message: 'Local desativado com sucesso.',
          data: result.venue,
        })

      case 'not_found':
        return response.notFound({
          message: 'Local não encontrado.',
        })

      case 'forbidden':
        return response.forbidden({
          message: 'Você não tem permissão para desativar este local.',
        })

      case 'already_inactive':
        return response.ok({
          message: 'Este local já está desativado.',
          data: result.venue,
        })
    }
  }
}
